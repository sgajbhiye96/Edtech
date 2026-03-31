from rest_framework import serializers
from .models import Course, Lesson
class LessonSerializer(serializers.ModelSerializer):
   class Meta:
       model = Lesson
       fields = "__all__"
class CourseSerializer(serializers.ModelSerializer):
   thumbnail = serializers.ImageField(required=False)
   lessons = LessonSerializer(many=True, read_only=True)  # ← add this
   class Meta:
       model = Course
       fields = "__all__"