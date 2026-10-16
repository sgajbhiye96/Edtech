from django.db import transaction
from rest_framework import serializers

from courses.models import Batch
from .models import Enrollment, Progress


class EnrollmentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    batch = serializers.PrimaryKeyRelatedField(
        queryset=Batch.objects.select_related("course").filter(
            registration_open=True,
            course__is_active=True,
        )
    )
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Enrollment
        fields = "__all__"

    def validate_batch(self, batch):
        active_count = batch.enrollments.filter(status="ACTIVE").count()
        pending_count = batch.enrollments.filter(status="PENDING_PAYMENT").count()

        if active_count + pending_count >= batch.max_students:
            raise serializers.ValidationError("This batch is full.")

        return batch

    def create(self, validated_data):
        user = self.context["request"].user
        batch = validated_data["batch"]

        existing = Enrollment.objects.filter(user=user, batch=batch).first()
        if existing:
            return existing

        with transaction.atomic():
            return Enrollment.objects.create(
                user=user,
                batch=batch,
                status="PENDING_PAYMENT",
            )


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = "__all__"
