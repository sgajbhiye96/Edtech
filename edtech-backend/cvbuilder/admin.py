from django.contrib import admin
from .models import CVSubscription, Resume

@admin.register(CVSubscription)
class CVSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "razorpay_subscription_id", "status", "current_period_end", "updated_at")
    list_filter = ("status",)
    search_fields = ("user__email", "user__username", "razorpay_subscription_id")

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "updated_at")
    search_fields = ("user__email", "user__username", "title")
