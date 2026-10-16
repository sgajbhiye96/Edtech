from django.contrib import admin, messages

from enrollments.models import Enrollment
from .models import Payment


@admin.action(description="Approve selected UPI QR payments")
def approve_upi_payments(modeladmin, request, queryset):
    approved = 0
    skipped = 0

    from .views import activate_enrollment

    for payment in queryset.filter(provider="UPI_QR", status="PENDING"):
        payment.status = "SUCCESS"
        payment.save(update_fields=["status", "updated_at"])
        try:
            activate_enrollment(payment)
            approved += 1
        except ValueError:
            payment.status = "PENDING"
            payment.save(update_fields=["status", "updated_at"])
            skipped += 1

    if approved:
        modeladmin.message_user(request, f"{approved} UPI payment(s) approved and enrollment activated.", messages.SUCCESS)
    if skipped:
        modeladmin.message_user(request, f"{skipped} payment(s) could not be activated because the batch is full.", messages.WARNING)


@admin.action(description="Reject selected UPI QR payments")
def reject_upi_payments(modeladmin, request, queryset):
    rejected = 0

    for payment in queryset.filter(provider="UPI_QR", status="PENDING"):
        payment.status = "FAILED"
        payment.save(update_fields=["status", "updated_at"])

        if not Payment.objects.filter(
            user=payment.user,
            batch=payment.batch,
            provider="UPI_QR",
            status="PENDING",
        ).exclude(pk=payment.pk).exists():
            Enrollment.objects.filter(
                user=payment.user,
                batch=payment.batch,
                status="PENDING_PAYMENT",
            ).delete()
        rejected += 1

    if rejected:
        modeladmin.message_user(request, f"{rejected} UPI payment(s) rejected.", messages.WARNING)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("order_id", "user", "batch", "amount", "provider", "payment_id", "status", "created_at")
    list_filter = ("provider", "status")
    search_fields = ("order_id", "payment_id", "user__email", "batch__name")
    actions = (approve_upi_payments, reject_upi_payments)
