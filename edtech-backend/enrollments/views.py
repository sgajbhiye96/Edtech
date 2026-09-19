from rest_framework import generics, permissions

from .models import Enrollment
from .serializers import EnrollmentSerializer


class EnrollView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.select_related(
            "batch",
            "batch__course",
        ).filter(user=self.request.user)
