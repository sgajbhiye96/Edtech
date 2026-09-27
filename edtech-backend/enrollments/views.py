from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Enrollment, Progress
from .serializers import EnrollmentSerializer
from courses.models import Course
from payments.models import Payment


class EnrollView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        course_id = request.data.get("course")

        if not course_id:
            return Response(
                {"error": "course is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course = get_object_or_404(Course, pk=course_id)

        # Enrollment is a paid entitlement. A client-side POST alone
        # must never grant course access.
        has_paid_payment = Payment.objects.filter(
            user=request.user,
            course_id=course.id,
            status="SUCCESS",
        ).exists()

        if not has_paid_payment:
            return Response(
                {"error": "A successful payment is required before enrollment."},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user,
            course=course,
        )

        serializer = self.get_serializer(enrollment)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class UserEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)
