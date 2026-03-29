from rest_framework import serializers
from .models import Course, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)

    class Meta:
        model = Course
        fields = "__all__"

