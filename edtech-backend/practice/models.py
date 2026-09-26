from django.conf import settings
from django.db import models

class PracticeProblem(models.Model):
    CATEGORY_CHOICES = [(x, x) for x in ["Python", "Machine Learning", "MySQL", "Excel"]]
    DIFFICULTY_CHOICES = [(x, x) for x in ["Easy", "Medium", "Hard"]]
    TYPE_CHOICES = [(x, x) for x in ["CODE", "SQL", "CONCEPT", "EXCEL"]]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    problem_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    prompt = models.TextField()
    starter_code = models.TextField(blank=True, default="")
    solution = models.TextField()
    test_cases = models.JSONField(default=list, blank=True)
    xp = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "id"]

class PracticeAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="practice_attempts")
    problem = models.ForeignKey(PracticeProblem, on_delete=models.CASCADE, related_name="attempts")
    answer = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[("SUBMITTED", "Submitted"), ("PASSED", "Passed")], default="SUBMITTED")
    xp_awarded = models.PositiveIntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]

class PracticeProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="practice_profile")
    xp = models.PositiveIntegerField(default=0)
    solved_count = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    last_practice_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
