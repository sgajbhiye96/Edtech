from django.contrib import admin

from .models import Enrollment, Progress


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "batch", "status", "enrolled_at")
    list_filter = ("status", "batch")
    search_fields = ("user__username", "user__email", "batch__name")


admin.site.register(Progress)
