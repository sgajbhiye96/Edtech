import hashlib
import hmac
import uuid
from decimal import Decimal

import requests
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from courses.models import Course
from enrollments.models import Enrollment
from .models import Payment

RAZORPAY_KEY_ID = settings.RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET = settings.RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET = settings.RAZORPAY_WEBHOOK_SECRET
RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"

def generate_order_id():
    return f"ORD-{uuid.uuid4().hex[:16].upper()}"

def razorpay_request(method, path, **kwargs):
    return requests.request(method, f"{RAZORPAY_BASE_URL}{path}",
                            auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
                            timeout=15, **kwargs)

def is_genai_agentic_course(course):
    title = (course.title or "").lower()
    return "generative" in title and "agentic" in title

def calculate_order_amount(course):
    if is_genai_agentic_course(course):
        return Decimal(str(getattr(settings, "GENAI_AGENTIC_PRICE", "4999.00"))).quantize(Decimal("0.01"))
    return Decimal(str(course.price)).quantize(Decimal("0.01"))

def _auto_enroll(payment):
    course = Course.objects.get(pk=payment.course_id)
    Enrollment.objects.get_or_create(user=payment.user, course=course)

def _mark_payment_success(payment, payment_id):
    payment.status = "SUCCESS"
    payment.payment_id = str(payment_id or "")
    payment.save(update_fields=["status", "payment_id", "updated_at"])
    _auto_enroll(payment)

class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        payments = Payment.objects.filter(user=request.user).values(
            "order_id", "course_id", "amount", "status", "created_at", "payment_id"
        )
        return Response(list(payments))

class AdminPaymentListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Forbidden"}, status=403)
        payments = Payment.objects.select_related("user").all().values(
            "order_id", "course_id", "amount", "status", "created_at",
            "payment_id", "user__username", "user__email"
        )
        return Response(list(payments))

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response({"error": "course_id is required"}, status=400)
        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        amount = calculate_order_amount(course)
        payload = {
            "amount": int(amount * 100),
            "currency": "INR",
            "receipt": generate_order_id(),
            "notes": {"course_id": str(course.id), "user_id": str(request.user.id)},
        }
        try:
            response = razorpay_request("POST", "/orders", json=payload)
            data = response.json()
            if response.status_code >= 400:
                return Response(
                    {"error": data.get("error", {}).get("description", "Failed to create Razorpay order.")},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            Payment.objects.create(
                user=request.user, course_id=course.id, order_id=data["id"],
                amount=amount, currency="INR", status="PENDING"
            )
            return Response({
                "key_id": RAZORPAY_KEY_ID, "order_id": data["id"],
                "amount": int(amount * 100), "currency": "INR",
                "course_title": course.title,
            })
        except requests.RequestException:
            return Response({"error": "Payment gateway is temporarily unavailable."}, status=502)

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        order_id = request.data.get("razorpay_order_id")
        payment_id = request.data.get("razorpay_payment_id")
        signature = request.data.get("razorpay_signature")
        if not all([order_id, payment_id, signature]):
            return Response({"error": "Payment verification data is incomplete."}, status=400)
        try:
            payment = Payment.objects.get(order_id=order_id, user=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)
        expected = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            return Response({"error": "Invalid payment signature."}, status=400)
        if payment.status != "SUCCESS":
            _mark_payment_success(payment, payment_id)
        return Response({
            "status": "SUCCESS", "order_id": payment.order_id,
            "payment_id": payment.payment_id, "course_id": payment.course_id,
        })

@method_decorator(csrf_exempt, name="dispatch")
class WebhookView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        signature = request.headers.get("X-Razorpay-Signature", "")
        if not signature:
            return Response({"error": "Missing signature."}, status=400)
        expected = hmac.new(
            RAZORPAY_WEBHOOK_SECRET.encode(), request.body, hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            return Response({"error": "Invalid signature."}, status=400)
        if request.data.get("event") != "order.paid":
            return Response({"ok": True})
        order = request.data.get("payload", {}).get("order", {}).get("entity", {})
        payment_entity = request.data.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = order.get("id")
        if not order_id:
            return Response({"ok": True})
        try:
            payment = Payment.objects.get(order_id=order_id)
        except Payment.DoesNotExist:
            return Response({"ok": True})
        if payment.status != "SUCCESS":
            _mark_payment_success(payment, payment_entity.get("id"))
        return Response({"ok": True})
