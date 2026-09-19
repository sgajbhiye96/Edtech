from rest_framework import serializers
from .models import Course, Lesson, Batch, LiveClass


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class LiveClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveClass
        fields = "__all__"


class BatchSerializer(serializers.ModelSerializer):
    live_classes = LiveClassSerializer(many=True, read_only=True)
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Batch
        fields = "__all__"

    def get_enrolled_count(self, obj):
        return obj.enrollments.filter(status="ACTIVE").count()


class CourseSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    lessons = LessonSerializer(many=True, read_only=True)
    batches = BatchSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = "__all__"
