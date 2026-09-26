from django.conf import settings
from django.db import models


class CVSubscription(models.Model):
    STATUS_CHOICES = [
        ("CREATED", "Created"),
        ("ACTIVE", "Active"),
        ("PAUSED", "Paused"),
        ("CANCELLED", "Cancelled"),
        ("EXPIRED", "Expired"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cv_subscription")
    razorpay_subscription_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="CREATED")
    current_period_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_active(self):
        from django.utils import timezone
        return self.status == "ACTIVE" and (
            self.current_period_end is None or self.current_period_end >= timezone.now()
        )


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resumes")
    title = models.CharField(max_length=150, default="My ATS Resume")
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-updated_at"]
