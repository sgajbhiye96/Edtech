import hashlib
import hmac
import json
from decimal import Decimal
from unittest.mock import Mock, patch

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from courses.models import Batch, Course, LearningResource, LiveClass
from enrollments.models import Enrollment
from payments.models import Payment


User = get_user_model()


@override_settings(
    RAZORPAY_KEY_ID="rzp_test_key",
    RAZORPAY_KEY_SECRET="rzp_test_secret",
    RAZORPAY_WEBHOOK_SECRET="webhook_test_secret",
)
class PaymentEnrollmentIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="admin", password="pass123", is_staff=True, is_admin=True
        )
        self.student = User.objects.create_user(
            username="student", password="pass123", email="student@example.com"
        )
        self.other_student = User.objects.create_user(
            username="other", password="pass123", email="other@example.com"
        )
        self.course = Course.objects.create(
            title="React Live Cohort",
            description="Live React course",
            price=10000,
        )
        self.batch = Batch.objects.create(
            course=self.course,
            name="September 2026",
            start_date="2026-09-21",
            end_date="2026-10-21",
            max_students=2,
            price=10000,
            registration_open=True,
            status="UPCOMING",
        )

    def auth(self, user):
        self.client.force_authenticate(user=user)

    def create_order(self, user):
        self.auth(user)
        response_payload = {"id": f"order_{user.username}", "status": "created"}
        with patch("payments.views.razorpay_request") as request:
            request.return_value = Mock(status_code=200, json=lambda: response_payload)
            response = self.client.post(
                "/api/payments/create-order/",
                {"batch_id": self.batch.id},
                format="json",
            )
        self.assertEqual(response.status_code, 200, response.data)
        return response.data

    def verify_payment(self, user, order_id, payment_id):
        self.auth(user)
        signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()
        return self.client.post(
            "/api/payments/verify/",
            {
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            },
            format="json",
        )

    def test_admin_course_and_batch_creation(self):
        self.auth(self.admin)

        course_response = self.client.post(
            "/api/courses/admin/create/",
            {
                "title": "Next.js Live Cohort",
                "description": "Build production apps",
                "price": "15000.00",
                "is_active": True,
            },
            format="multipart",
        )
        self.assertEqual(course_response.status_code, 201, course_response.data)
        course_id = course_response.data["id"]

        batch_response = self.client.post(
            "/api/courses/batches/admin/create/",
            {
                "course": course_id,
                "name": "October 2026",
                "start_date": "2026-10-01",
                "end_date": "2026-11-01",
                "max_students": 10,
                "price": "15000.00",
                "registration_open": True,
                "status": "UPCOMING",
            },
            format="json",
        )
        self.assertEqual(batch_response.status_code, 201, batch_response.data)

    def test_full_payment_to_active_enrollment_and_batch_scoped_access(self):
        order = self.create_order(self.student)

        enrollment = Enrollment.objects.get(user=self.student, batch=self.batch)
        self.assertEqual(enrollment.status, "PENDING_PAYMENT")

        payment_id = "pay_test_student"
        verify = self.verify_payment(self.student, order["order_id"], payment_id)
        self.assertEqual(verify.status_code, 200, verify.data)
        self.assertEqual(verify.data["status"], "SUCCESS")

        enrollment.refresh_from_db()
        self.assertEqual(enrollment.status, "ACTIVE")
        payment = Payment.objects.get(order_id=order["order_id"])
        self.assertEqual(payment.status, "SUCCESS")
        self.assertEqual(payment.payment_id, payment_id)

        live = LiveClass.objects.create(
            batch=self.batch,
            title="React Components",
            scheduled_at="2026-09-22T10:00:00Z",
            meeting_url="https://example.com/private-room",
        )
        resource = LearningResource.objects.create(
            batch=self.batch,
            title="React notes",
            resource_type="LINK",
            url="https://example.com/notes",
        )

        self.auth(self.student)
        dashboard = self.client.get("/api/enrollments/dashboard/")
        self.assertEqual(dashboard.status_code, 200)
        self.assertEqual(dashboard.data["enrollments"][0]["batch"]["id"], self.batch.id)
        self.assertEqual(dashboard.data["live_classes"][0]["id"], live.id)
        self.assertEqual(dashboard.data["resources"][0]["id"], resource.id)

        live_response = self.client.get("/api/courses/live-classes/")
        self.assertEqual(live_response.status_code, 200)
        self.assertEqual(len(live_response.data), 1)
        self.assertEqual(live_response.data[0]["meeting_url"], live.meeting_url)

        self.auth(self.other_student)
        self.assertEqual(self.client.get("/api/courses/live-classes/").status_code, 200)
        self.assertEqual(self.client.get("/api/courses/live-classes/").data, [])
        self.assertEqual(self.client.get("/api/courses/resources/").data, [])

        self.client.force_authenticate(user=None)
        self.assertIn(
            self.client.get("/api/courses/live-classes/").status_code, (401, 403)
        )

    def test_webhook_signature_activates_pending_enrollment(self):
        order = self.create_order(self.student)
        payload = {
            "event": "order.paid",
            "payload": {
                "order": {"entity": {"id": order["order_id"]}},
                "payment": {"entity": {"id": "pay_webhook"}},
            },
        }
        body = json.dumps(payload).encode()
        signature = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()

        self.client.force_authenticate(user=None)
        response = self.client.post(
            "/api/payments/webhook/",
            data=body,
            content_type="application/json",
            HTTP_X_RAZORPAY_SIGNATURE=signature,
        )
        self.assertEqual(response.status_code, 200, response.data)

        enrollment = Enrollment.objects.get(user=self.student, batch=self.batch)
        self.assertEqual(enrollment.status, "ACTIVE")
        payment = Payment.objects.get(order_id=order["order_id"])
        self.assertEqual(payment.status, "SUCCESS")
        self.assertEqual(payment.payment_id, "pay_webhook")

    def test_duplicate_and_capacity_behavior(self):
        self.create_order(self.student)
        self.assertEqual(
            self.verify_payment(
                self.student,
                "order_student",
                "pay_student",
            ).status_code,
            200,
        )

        self.auth(self.student)
        duplicate = self.client.post(
            "/api/payments/create-order/",
            {"batch_id": self.batch.id},
            format="json",
        )
        self.assertEqual(duplicate.status_code, 409)

        # A second student can reserve the remaining seat.
        self.create_order(self.other_student)
        self.assertEqual(Enrollment.objects.filter(status="PENDING_PAYMENT").count(), 1)

        full_user = User.objects.create_user(username="third", password="pass123")
        self.auth(full_user)
        response = self.client.post(
            "/api/payments/create-order/",
            {"batch_id": self.batch.id},
            format="json",
        )
        self.assertEqual(response.status_code, 409)
        self.assertFalse(
            Enrollment.objects.filter(user=full_user, batch=self.batch).exists()
        )

        # Completing the second student's payment reaches capacity cleanly.
        verify = self.verify_payment(
            self.other_student,
            "order_other",
            "pay_other",
        )
        self.assertEqual(verify.status_code, 200)
        self.assertEqual(
            Enrollment.objects.filter(batch=self.batch, status="ACTIVE").count(), 2
        )

    def test_invalid_signature_does_not_activate(self):
        order = self.create_order(self.student)
        self.auth(self.student)
        response = self.client.post(
            "/api/payments/verify/",
            {
                "razorpay_order_id": order["order_id"],
                "razorpay_payment_id": "pay_bad",
                "razorpay_signature": "invalid",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            Enrollment.objects.get(user=self.student, batch=self.batch).status,
            "PENDING_PAYMENT",
        )
