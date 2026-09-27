import hmac
import hashlib
import base64
import json
import uuid
from decimal import Decimal, InvalidOperation

import requests

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from .models import Payment
from courses.models import Course
from enrollments.models import Enrollment


# ------------------ Cashfree Config ----------------------

CF_APP_ID = settings.CASHFREE_APP_ID
CF_SECRET_KEY = settings.CASHFREE_SECRET_KEY
CF_ENV = getattr(settings, "CASHFREE_ENV", "sandbox")

CF_BASE_URL = (
    "https://api.cashfree.com"
    if CF_ENV == "production"
    else "https://sandbox.cashfree.com"
)

# Cashfree's current web checkout examples use this API version.
CF_API_VERSION = "2025-01-01"

CF_HEADERS = {
    "x-api-version": CF_API_VERSION,
    "x-client-id": CF_APP_ID,
    "x-client-secret": CF_SECRET_KEY,
    "Content-Type": "application/json",
}


def generate_order_id():
    return f"ORD-{uuid.uuid4().hex[:12].upper()}"


def is_genai_agentic_course(course):
    title = (course.title or "").lower()
    return "generative" in title and "agentic" in title


def calculate_order_amount(course):
    """
    The browser never decides the final payment amount.

    The GenAI + Agentic AI marketing offer is fixed at ₹4,999.
    Other courses keep the existing 18% GST calculation.
    """
    if is_genai_agentic_course(course):
        configured_price = getattr(settings, "GENAI_AGENTIC_PRICE", "4999.00")
        return Decimal(str(configured_price)).quantize(Decimal("0.01"))

    return (Decimal(course.price) * Decimal("1.18")).quantize(Decimal("0.01"))


def _auto_enroll(payment):
    """Idempotently enroll the paid user in the paid course."""
    course = Course.objects.get(pk=payment.course_id)
    Enrollment.objects.get_or_create(
        user=payment.user,
        course=course,
    )


def _mark_payment_success(payment, payment_id):
    payment.status = "SUCCESS"
    payment.payment_id = str(payment_id or "")
    payment.save(update_fields=["status", "payment_id", "updated_at"])
    _auto_enroll(payment)


# ------------------ Payment History ----------------------

class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).values(
            "order_id", "course_id", "amount", "status", "created_at", "payment_id"
        )
        return Response(list(payments))


# ------------------ Admin Payments ----------------------

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


# ------------------ Create Order ----------------------

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")

        if not course_id:
            return Response(
                {"error": "course_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # IMPORTANT: never trust an amount supplied by the browser.
        amount = calculate_order_amount(course)
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
                "return_url": (
                    "https://www.innovationailabs.in/payment/status"
                    "?order_id={order_id}"
                ),
                "notify_url": (
                    "https://edtech-backend-f7p4.onrender.com/"
                    "api/payments/webhook/"
                ),
            },
            "order_note": f"Enrollment for course {course.id}",
        }

        try:
            cf_res = requests.post(
                f"{CF_BASE_URL}/pg/orders",
                headers=CF_HEADERS,
                json=payload,
                timeout=15,
            )

            cf_data = cf_res.json()

            if cf_res.status_code not in (200, 201):
                return Response(
                    {"error": cf_data.get("message", "Failed to create order")},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            Payment.objects.create(
                user=user,
                course_id=course.id,
                order_id=order_id,
                cf_order_id=cf_data.get("cf_order_id", ""),
                amount=amount,
                status="PENDING",
            )

            return Response({
                "order_id": order_id,
                "payment_session_id": cf_data["payment_session_id"],
                "cf_order_id": cf_data.get("cf_order_id"),
                "amount": str(amount),
                "currency": "INR",
                "course_id": course.id,
            })

        except requests.exceptions.Timeout:
            return Response({"error": "Payment gateway timeout"}, status=504)
        except Exception:
            return Response(
                {"error": "Unable to create payment order"},
                status=500,
            )


# ------------------ Verify Payment ----------------------

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            payment = Payment.objects.get(
                order_id=order_id,
                user=request.user,
            )
        except Payment.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        if payment.status == "SUCCESS":
            return Response({
                "status": "SUCCESS",
                "order_id": order_id,
                "payment_id": payment.payment_id,
            })

        try:
            cf_res = requests.get(
                f"{CF_BASE_URL}/pg/orders/{order_id}/payments",
                headers=CF_HEADERS,
                timeout=15,
            )

            cf_data = cf_res.json()

            if cf_res.status_code == 200 and isinstance(cf_data, list) and cf_data:
                successful = next(
                    (
                        item for item in cf_data
                        if item.get("payment_status") == "SUCCESS"
                    ),
                    None,
                )

                if successful:
                    try:
                        paid_amount = Decimal(
                            str(successful.get("payment_amount", payment.amount))
                        )
                    except (InvalidOperation, TypeError):
                        paid_amount = Decimal("0")

                    if paid_amount != Decimal(payment.amount):
                        return Response({
                            "status": "FAILED",
                            "order_id": order_id,
                            "error": "Payment amount mismatch",
                        }, status=400)

                    _mark_payment_success(
                        payment,
                        successful.get("cf_payment_id", ""),
                    )
                else:
                    latest = cf_data[0]
                    cf_status = latest.get("payment_status", "PENDING")

                    status_map = {
                        "FAILED": "FAILED",
                        "PENDING": "PENDING",
                        "USER_DROPPED": "CANCELLED",
                    }

                    payment.status = status_map.get(cf_status, "PENDING")
                    payment.payment_id = latest.get("cf_payment_id", "")
                    payment.save(update_fields=[
                        "status", "payment_id", "updated_at"
                    ])

            return Response({
                "status": payment.status,
                "order_id": order_id,
                "payment_id": payment.payment_id,
            })

        except Exception:
            return Response({
                "status": payment.status,
                "order_id": order_id,
                "payment_id": payment.payment_id,
            })


# ------------------ Cashfree Webhook ----------------------

@method_decorator(csrf_exempt, name="dispatch")
class WebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ts = request.headers.get("x-webhook-timestamp", "")
        signature = request.headers.get("x-webhook-signature", "")
        raw_body = request.body.decode("utf-8")

        if not ts or not signature:
            return Response({"error": "Missing webhook signature"}, status=400)

        message = f"{ts}{raw_body}"
        computed = base64.b64encode(
            hmac.new(
                CF_SECRET_KEY.encode("utf-8"),
                message.encode("utf-8"),
                hashlib.sha256,
            ).digest()
        ).decode("utf-8")

        if not hmac.compare_digest(computed, signature):
            return Response({"error": "Invalid signature"}, status=400)

        try:
            data = json.loads(raw_body)
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
                try:
                    paid_amount = Decimal(
                        str(pay.get("payment_amount", payment.amount))
                    )
                except (InvalidOperation, TypeError):
                    return Response({"error": "Invalid payment amount"}, status=400)

                if paid_amount != Decimal(payment.amount):
                    return Response({"error": "Payment amount mismatch"}, status=400)

                if payment.status != "SUCCESS":
                    _mark_payment_success(payment, payment_id)

            elif cf_status in ("FAILED", "USER_DROPPED"):
                payment.status = (
                    "FAILED" if cf_status == "FAILED" else "CANCELLED"
                )
                payment.save(update_fields=["status", "updated_at"])

        except (ValueError, json.JSONDecodeError):
            return Response({"error": "Invalid webhook payload"}, status=400)
        except Exception:
            # Keep webhook handling idempotent and avoid repeated retries
            # for application-side failures.
            return Response({"ok": True})

        return Response({"ok": True})
