from django.db import models
from django.conf import settings
from courses.models import Course, Lesson, Batch


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ("PENDING_PAYMENT", "Pending payment"),
        ("ACTIVE", "Active"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    batch = models.ForeignKey(
        Batch,
        related_name="enrollments",
        on_delete=models.PROTECT,
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING_PAYMENT",
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "batch"],
                name="unique_user_batch_enrollment",
            )
        ]
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.user.username} → {self.batch}"


class Progress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} ({self.completed})"
