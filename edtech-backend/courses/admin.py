from django.contrib import admin

from .models import Course, Lesson, Batch, LiveClass


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "price", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description")


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "course",
        "start_date",
        "end_date",
        "max_students",
        "price",
        "registration_open",
        "status",
    )
    list_filter = ("status", "registration_open")
    search_fields = ("name", "course__title")


@admin.register(LiveClass)
class LiveClassAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "batch",
        "scheduled_at",
        "duration_minutes",
        "recording_available",
    )
    list_filter = ("recording_available",)
    search_fields = ("title", "batch__name")


admin.site.register(Lesson)
