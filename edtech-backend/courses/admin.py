from django.contrib import admin
from .models import Course, Lesson, Batch, LiveClass, LearningResource, Assignment, Project


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "price", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description")


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ("name", "course", "start_date", "end_date", "max_students", "price", "registration_open", "status")
    list_filter = ("status", "registration_open")
    search_fields = ("name", "course__title")


@admin.register(LiveClass)
class LiveClassAdmin(admin.ModelAdmin):
    list_display = ("title", "batch", "scheduled_at", "duration_minutes", "recording_available")
    list_filter = ("recording_available",)
    search_fields = ("title", "batch__name")


@admin.register(LearningResource)
class LearningResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "batch", "resource_type", "created_at")
    list_filter = ("resource_type",)
    search_fields = ("title", "batch__name")


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("title", "batch", "due_at", "created_at")
    search_fields = ("title", "batch__name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "batch", "created_at")
    search_fields = ("title", "batch__name")


admin.site.register(Lesson)
