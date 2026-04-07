import hmac
import hashlib
import base64
import json
import uuid
import requests

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from .models import Payment


# ------------------ Cashfree Config ----------------------

CF_APP_ID = settings.CASHFREE_APP_ID
CF_SECRET_KEY = settings.CASHFREE_SECRET_KEY
CF_ENV = getattr(settings, "CASHFREE_ENV", "sandbox")

CF_BASE_URL = (
    "https://api.cashfree.com"
    if CF_ENV == "production"
    else "https://sandbox.cashfree.com"
)

CF_API_VERSION = "2023-08-01"

CF_HEADERS = {
    "x-api-version": CF_API_VERSION,
    "x-client-id": CF_APP_ID,
    "x-client-secret": CF_SECRET_KEY,
    "Content-Type": "application/json",
}


def generate_order_id():
    """Generate unique order ID."""
    return f"ORD-{uuid.uuid4().hex[:12].upper()}"

# ------------------ 4. Payment History ----------------------

class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).values(
            "order_id", "course_id", "amount", "status", "created_at", "payment_id"
        )
        return Response(list(payments))


# ------------------ 5. Admin Payments ----------------------

class AdminPaymentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Forbidden"}, status=403)

        payments = Payment.objects.select_related("user").all().values(
            "order_id", "course_id", "amount", "status",
            "created_at", "payment_id",
            "user__username", "user__email",
        )
        return Response(list(payments))
# ------------------ 1. Create Order ----------------------

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        course_id = request.data.get("course_id")
        amount = request.data.get("amount")

        if not course_id or not amount:
            return Response(
                {"error": "course_id and amount are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order_id = generate_order_id()
        user = request.user

        payload = {
            "order_id": order_id,
            "order_amount": float(amount),
            "order_currency": "INR",
            "customer_details": {
                "customer_id": str(user.id),
                "customer_name": user.get_full_name() or user.username,
                "customer_email": user.email or "student@domain.com",
                "customer_phone": "9999999999",
            },
            "order_meta": {
                "return_url": f"https://www.innovationailabs.in/payment/status?order_id={{order_id}}",
                "notify_url": "https://edtech-backend-f7p4.onrender.com/api/payments/webhook/",
            },
            "order_note": f"Enrollment for course {course_id}",
        }

        try:
            cf_res = requests.post(
                f"{CF_BASE_URL}/pg/orders",
                headers=CF_HEADERS,
                json=payload,
                timeout=15
            )

            cf_data = cf_res.json()

            if cf_res.status_code != 200:
                return Response(
                    {"error": cf_data.get("message", "Failed to create order")},
                    status=status.HTTP_502_BAD_GATEWAY
                )

            Payment.objects.create(
                user=user,
                course_id=course_id,
                order_id=order_id,
                cf_order_id=cf_data.get("cf_order_id", ""),
                amount=amount,
                status="PENDING",
            )

            return Response({
                "order_id": order_id,
                "payment_session_id": cf_data["payment_session_id"],
                "cf_order_id": cf_data.get("cf_order_id"),
                "amount": amount,
            })

        except requests.exceptions.Timeout:
            return Response({"error": "Payment gateway timeout"}, status=504)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


# ------------------ 2. Verify Payment ----------------------

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):

        try:
            payment = Payment.objects.get(order_id=order_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        if payment.status == "SUCCESS":
            return Response({"status": "SUCCESS", "order_id": order_id})

        try:
            cf_res = requests.get(
                f"{CF_BASE_URL}/pg/orders/{order_id}/payments",
                headers=CF_HEADERS,
                timeout=15
            )

            cf_data = cf_res.json()

            if cf_res.status_code == 200 and isinstance(cf_data, list) and cf_data:
                latest = cf_data[0]

                cf_status = latest.get("payment_status", "PENDING")

                status_map = {
                    "SUCCESS": "SUCCESS",
                    "FAILED": "FAILED",
                    "PENDING": "PENDING",
                    "USER_DROPPED": "CANCELLED",
                }

                payment.status = status_map.get(cf_status, "PENDING")
                payment.payment_id = latest.get("cf_payment_id", "")
                payment.save()

            return Response({
                "status": payment.status,
                "order_id": order_id,
                "payment_id": payment.payment_id,
            })

        except Exception:
            return Response({"status": payment.status, "order_id": order_id})


# ------------------ 3. Webhook ----------------------
@method_decorator(csrf_exempt, name="dispatch")
class WebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ts = request.headers.get("x-webhook-timestamp", "")
        signature = request.headers.get("x-webhook-signature", "")
        raw_body = request.body.decode("utf-8")

        # Verify signature
        if ts and signature:
            message = f"{ts}{raw_body}"
            computed = base64.b64encode(
                hmac.new(
                    CF_SECRET_KEY.encode("utf-8"),
                    message.encode("utf-8"),
                    hashlib.sha256
                ).digest()
            ).decode("utf-8")

            if not hmac.compare_digest(computed, signature):
                return Response({"error": "Invalid signature"}, status=400)

        try:
            data = json.loads(raw_body)
            event = data.get("type", "")
            order = data.get("data", {}).get("order", {})
            pay = data.get("data", {}).get("payment", {})

            order_id = order.get("order_id", "")
            cf_status = pay.get("payment_status", "")
            payment_id = pay.get("cf_payment_id", "")

            if not order_id:
                return Response({"ok": True})

            try:
                payment = Payment.objects.get(order_id=order_id)
            except Payment.DoesNotExist:
                return Response({"ok": True})

            if cf_status == "SUCCESS":
                payment.status = "SUCCESS"
                payment.payment_id = payment_id
                payment.save()
                _auto_enroll(payment)

            elif cf_status in ("FAILED", "USER_DROPPED"):
                payment.status = "FAILED" if cf_status == "FAILED" else "CANCELLED"
                payment.save()

        except Exception:
            # Avoid webhook retries
            return Response({"ok": True})

        return Response({"ok": True})