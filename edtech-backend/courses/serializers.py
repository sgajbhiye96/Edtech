from rest_framework import serializers
from .models import Course, Lesson, Batch, LiveClass, LearningResource, Assignment, Project


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class LiveClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveClass
        fields = "__all__"


class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = "__all__"


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class BatchSerializer(serializers.ModelSerializer):
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Batch
        fields = "__all__"

    def get_enrolled_count(self, obj):
        return obj.enrollments.filter(status="ACTIVE").count()


class CourseCatalogSerializer(serializers.ModelSerializer):
    """Keep the public catalog response independent of nested lesson/batch data."""
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ("id", "title", "description", "price", "thumbnail", "is_active", "created_at", "updated_at")

    def get_thumbnail(self, obj):
        try:
            return obj.thumbnail.url if obj.thumbnail else None
        except (ValueError, OSError):
            # A missing/unavailable optional thumbnail must not break the catalog.
            return None


class CourseSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    lessons = LessonSerializer(many=True, read_only=True)
    batches = BatchSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = "__all__"
