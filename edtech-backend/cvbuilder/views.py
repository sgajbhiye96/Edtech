import hashlib
import hmac
import json
from datetime import datetime

import requests
from requests import RequestException
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CVSubscription, Resume

RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"


def razorpay_request(method, path, **kwargs):
    return requests.request(
        method,
        f"{RAZORPAY_BASE_URL}{path}",
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
        timeout=15,
        **kwargs,
    )


def subscription_period_end(entity):
    value = entity.get("current_end")
    if not value:
        return None
    try:
        return datetime.fromtimestamp(int(value), tz=timezone.utc)
    except (TypeError, ValueError, OSError):
        return None


def has_active_subscription(user):
    try:
        subscription = user.cv_subscription
    except CVSubscription.DoesNotExist:
        return False
    return subscription.is_active()


class CVSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            subscription = request.user.cv_subscription
            active = subscription.is_active()
            if subscription.status == "ACTIVE" and subscription.current_period_end and subscription.current_period_end < timezone.now():
                subscription.status = "EXPIRED"
                subscription.save(update_fields=["status", "updated_at"])
                active = False
            return Response({
                "active": active,
                "status": subscription.status,
                "current_period_end": subscription.current_period_end,
            })
        except CVSubscription.DoesNotExist:
            return Response({"active": False, "status": "NONE", "current_period_end": None})

    def post(self, request):
        existing = getattr(request.user, "cv_subscription", None)
        if existing and existing.is_active():
            return Response({"active": True, "status": existing.status})

        plan_id = settings.RAZORPAY_CV_PLAN_ID
        if not plan_id:
            return Response({"error": "CV subscription plan is not configured yet."}, status=503)

        payload = {
            "plan_id": plan_id,
            "customer_notify": 1,
            "notes": {"user_id": str(request.user.id), "product": "ATS CV Maker"},
        }
        try:
            response = razorpay_request("POST", "/subscriptions", json=payload)
        except RequestException as exc:
            return Response({"error": f"Unable to reach Razorpay: {exc}"}, status=502)

        try:
            data = response.json()
        except ValueError:
            return Response({"error": f"Razorpay returned an unexpected response (HTTP {response.status_code})."}, status=502)

        if response.status_code >= 400:
            error_data = data.get("error") or {}
            description = error_data.get("description") or error_data.get("reason") or "Unable to create subscription."
            return Response({"error": description}, status=502)

        if not data.get("id"):
            return Response({"error": "Razorpay did not return a subscription ID."}, status=502)

        subscription, _ = CVSubscription.objects.update_or_create(
            user=request.user,
            defaults={
                "razorpay_subscription_id": data["id"],
                "status": "CREATED",
                "current_period_end": subscription_period_end(data),
            },
        )
        return Response({
            "subscription_id": subscription.razorpay_subscription_id,
            "key_id": settings.RAZORPAY_KEY_ID,
            "status": subscription.status,
            "amount": 900,
            "currency": "INR",
        })


class VerifyCVSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subscription_id = request.data.get("razorpay_subscription_id")
        payment_id = request.data.get("razorpay_payment_id")
        signature = request.data.get("razorpay_signature")
        if not all([subscription_id, payment_id, signature]):
            return Response({"error": "Subscription verification data is incomplete."}, status=400)

        try:
            subscription = CVSubscription.objects.get(
                razorpay_subscription_id=subscription_id,
                user=request.user,
            )
        except CVSubscription.DoesNotExist:
            return Response({"error": "Subscription not found."}, status=404)

        if not settings.RAZORPAY_KEY_SECRET:
            return Response({"error": "Razorpay secret is not configured on the backend."}, status=503)

        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{subscription_id}|{payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            return Response({"error": "Invalid subscription signature."}, status=400)

        subscription.status = "ACTIVE"
        subscription.save(update_fields=["status", "updated_at"])
        return Response({"status": "ACTIVE"})


@method_decorator(csrf_exempt, name="dispatch")
class CVSubscriptionWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.headers.get("X-Razorpay-Signature", "")
        if not settings.RAZORPAY_WEBHOOK_SECRET:
            return Response({"error": "Razorpay webhook secret is not configured."}, status=503)
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            request.body,
            hashlib.sha256,
        ).hexdigest()
        if not signature or not hmac.compare_digest(expected, signature):
            return Response({"error": "Invalid signature."}, status=400)

        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON."}, status=400)

        event = payload.get("event", "")
        entity = payload.get("payload", {}).get("subscription", {}).get("entity", {})
        subscription_id = entity.get("id")
        if not subscription_id:
            return Response({"ok": True})

        try:
            subscription = CVSubscription.objects.get(razorpay_subscription_id=subscription_id)
        except CVSubscription.DoesNotExist:
            return Response({"ok": True})

        if event in ("subscription.activated", "subscription.charged", "subscription.resumed"):
            subscription.status = "ACTIVE"
            subscription.current_period_end = subscription_period_end(entity)
        elif event == "subscription.paused":
            subscription.status = "PAUSED"
        elif event in ("subscription.cancelled", "subscription.halted"):
            subscription.status = "CANCELLED"
        subscription.save(update_fields=["status", "current_period_end", "updated_at"])
        return Response({"ok": True})


class ResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_active_subscription(request.user):
            return Response({"error": "An active CV subscription is required."}, status=402)
        resume, _ = Resume.objects.get_or_create(user=request.user)
        return Response({"id": resume.id, "title": resume.title, "data": resume.data})

    def put(self, request):
        if not has_active_subscription(request.user):
            return Response({"error": "An active CV subscription is required."}, status=402)
        resume, _ = Resume.objects.get_or_create(user=request.user)
        resume.title = request.data.get("title", resume.title)
        resume.data = request.data.get("data", resume.data)
        resume.save(update_fields=["title", "data", "updated_at"])
        return Response({"id": resume.id, "title": resume.title, "data": resume.data})
