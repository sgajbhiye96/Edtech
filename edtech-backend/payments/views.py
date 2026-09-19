import hashlib
import hmac
import json
import uuid
from decimal import Decimal, InvalidOperation

import requests
from django.conf import settings
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from courses.models import Batch
from enrollments.models import Enrollment
from .models import Payment


RAZORPAY_KEY_ID = settings.RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET = settings.RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET = settings.RAZORPAY_WEBHOOK_SECRET
RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"


def generate_order_id():
    return f"ORD-{uuid.uuid4().hex[:16].upper()}"


def razorpay_request(method, path, **kwargs):
    return requests.request(
        method,
        f"{RAZORPAY_BASE_URL}{path}",
        auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
        timeout=15,
        **kwargs,
    )


def activate_enrollment(payment):
    with transaction.atomic():
        locked_payment = Payment.objects.select_for_update().select_related(
            "user", "batch"
        ).get(pk=payment.pk)

        if locked_payment.status != "SUCCESS":
            return

        # Serialize activation against other payments for the same batch.
        # The pending enrollment created during order creation is the seat
        # reservation, so it must not be counted against itself.
        batch = Batch.objects.select_for_update().get(pk=locked_payment.batch_id)
        enrollment = (
            Enrollment.objects.select_for_update()
            .filter(user=locked_payment.user, batch=batch)
            .first()
        )

        if enrollment and enrollment.status == "ACTIVE":
            return

        active_count = batch.enrollments.filter(status="ACTIVE").exclude(
            pk=enrollment.pk if enrollment else None
        ).count()

        if active_count >= batch.max_students:
            raise ValueError("This batch is full.")

        if enrollment:
            enrollment.status = "ACTIVE"
            enrollment.save(update_fields=["status", "updated_at"])
        else:
            Enrollment.objects.create(
                user=locked_payment.user,
                batch=batch,
                status="ACTIVE",
            )


class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).values(
            "order_id",
            "batch_id",
            "amount",
            "status",
            "created_at",
            "payment_id",
            "provider",
        )
        return Response(list(payments))


class AdminPaymentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Forbidden"}, status=403)

        payments = Payment.objects.select_related("user", "batch").all().values(
            "order_id",
            "batch_id",
            "amount",
            "status",
            "created_at",
            "payment_id",
            "provider",
            "user__username",
            "user__email",
        )
        return Response(list(payments))


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        batch_id = request.data.get("batch_id")
        if not batch_id:
            return Response(
                {"error": "batch_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            batch = Batch.objects.select_related("course").get(
                pk=batch_id,
                registration_open=True,
                course__is_active=True,
            )
        except Batch.DoesNotExist:
            return Response(
                {"error": "Batch not found or registration is closed."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if batch.status not in ("UPCOMING", "ONGOING"):
            return Response(
                {"error": "This batch is not accepting enrollments."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            # Reserve a seat atomically before contacting Razorpay.
            batch = Batch.objects.select_for_update().get(pk=batch.pk)

            existing = Enrollment.objects.filter(
                user=request.user,
                batch=batch,
                status="ACTIVE",
            ).exists()
            if existing:
                return Response(
                    {"error": "You are already enrolled in this batch."},
                    status=status.HTTP_409_CONFLICT,
                )

            enrollment, enrollment_created = Enrollment.objects.get_or_create(
                user=request.user,
                batch=batch,
                defaults={"status": "PENDING_PAYMENT"},
            )

            if enrollment.status == "ACTIVE":
                return Response(
                    {"error": "You are already enrolled in this batch."},
                    status=status.HTTP_409_CONFLICT,
                )

            reserved_count = batch.enrollments.filter(
                status__in=("ACTIVE", "PENDING_PAYMENT")
            ).count()
            if reserved_count > batch.max_students:
                return Response(
                    {"error": "This batch is full."},
                    status=status.HTTP_409_CONFLICT,
                )


        amount = Decimal(batch.price)
        amount_paise = int(amount * 100)
        order_id = generate_order_id()

        payload = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": order_id,
            "notes": {
                "batch_id": str(batch.id),
                "user_id": str(request.user.id),
            },
        }

        try:
            response = razorpay_request(
                "POST",
                "/orders",
                json=payload,
            )
            data = response.json()

            if response.status_code >= 400:
                return Response(
                    {"error": data.get("error", {}).get(
                        "description", "Failed to create Razorpay order."
                    )},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            Payment.objects.create(
                user=request.user,
                batch=batch,
                provider="RAZORPAY",
                order_id=data["id"],
                amount=amount,
                currency="INR",
                status="PENDING",
            )

            return Response({
                "key_id": RAZORPAY_KEY_ID,
                "order_id": data["id"],
                "amount": amount_paise,
                "currency": "INR",
                "course_title": batch.course.title,
                "batch_name": batch.name,
            })
        except requests.RequestException:
            return Response(
                {"error": "Payment gateway is temporarily unavailable."},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("razorpay_order_id")
        payment_id = request.data.get("razorpay_payment_id")
        signature = request.data.get("razorpay_signature")

        if not all([order_id, payment_id, signature]):
            return Response(
                {"error": "Payment verification data is incomplete."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment = Payment.objects.get(
                order_id=order_id,
                user=request.user,
            )
        except Payment.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        expected = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{payment.order_id}|{payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected, signature):
            return Response(
                {"error": "Invalid payment signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment.status = "SUCCESS"
            payment.payment_id = payment_id
            payment.save(update_fields=["status", "payment_id", "updated_at"])
            activate_enrollment(payment)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=409)

        return Response({
            "status": "SUCCESS",
            "order_id": payment.order_id,
            "payment_id": payment.payment_id,
            "batch_id": payment.batch_id,
        })


@method_decorator(csrf_exempt, name="dispatch")
class WebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.headers.get("X-Razorpay-Signature", "")
        if not signature:
            return Response({"error": "Missing signature."}, status=400)

        expected = hmac.new(
            RAZORPAY_WEBHOOK_SECRET.encode(),
            request.body,
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected, signature):
            return Response({"error": "Invalid signature."}, status=400)

        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON."}, status=400)

        event = payload.get("event")
        if event != "order.paid":
            return Response({"ok": True})

        order = payload.get("payload", {}).get("order", {}).get("entity", {})
        payment_entity = payload.get("payload", {}).get(
            "payment", {}
        ).get("entity", {})

        order_id = order.get("id")
        payment_id = payment_entity.get("id")
        if not order_id:
            return Response({"ok": True})

        try:
            payment = Payment.objects.get(order_id=order_id)
        except Payment.DoesNotExist:
            return Response({"ok": True})

        if payment.status != "SUCCESS":
            payment.status = "SUCCESS"
            payment.payment_id = payment_id or ""
            payment.save(update_fields=["status", "payment_id", "updated_at"])

        try:
            activate_enrollment(payment)
        except ValueError:
            # Payment remains recorded; admin can resolve a capacity conflict.
            return Response({"ok": True})

        return Response({"ok": True})
