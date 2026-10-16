from rest_framework import serializers
from .models import PracticeProblem, PracticeAttempt, PracticeProfile

class PracticeProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticeProblem
        fields = ["id", "title", "category", "difficulty", "problem_type", "prompt", "starter_code", "xp"]

class PracticeAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticeAttempt
        fields = ["id", "problem", "answer", "status", "xp_awarded", "submitted_at"]
        read_only_fields = ["id", "status", "xp_awarded", "submitted_at"]

class PracticeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticeProfile
        fields = ["xp", "solved_count", "current_streak", "last_practice_date"]
