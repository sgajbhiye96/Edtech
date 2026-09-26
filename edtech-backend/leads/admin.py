from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "mobile", "city", "course_interested", "created_at")
    search_fields = ("name", "email", "mobile", "city", "course_interested")
    list_filter = ("course_interested", "created_at")
    ordering = ("-created_at",)
