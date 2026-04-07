from django.db import models
from django.conf import settings   # ✅ Use custom user model

class Payment(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
        ("CANCELLED", "Cancelled"),
    ]

    # ✅ FIX — use AUTH_USER_MODEL, NOT django.contrib.auth.User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    course_id   = models.IntegerField()
    order_id    = models.CharField(max_length=100, unique=True)
    cf_order_id = models.CharField(max_length=100, blank=True)
    payment_id  = models.CharField(max_length=100, blank=True)
    amount      = models.DecimalField(max_digits=10, decimal_places=2)
    currency    = models.CharField(max_length=10, default="INR")
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} | {self.order_id} | {self.status}"