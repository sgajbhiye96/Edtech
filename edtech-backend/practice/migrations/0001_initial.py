from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]
    operations = [
        migrations.CreateModel(
            name="PracticeProblem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("category", models.CharField(choices=[("Python","Python"),("Machine Learning","Machine Learning"),("MySQL","MySQL"),("Excel","Excel")], max_length=40)),
                ("difficulty", models.CharField(choices=[("Easy","Easy"),("Medium","Medium"),("Hard","Hard")], max_length=20)),
                ("problem_type", models.CharField(choices=[("CODE","CODE"),("SQL","SQL"),("CONCEPT","CONCEPT"),("EXCEL","EXCEL")], max_length=20)),
                ("prompt", models.TextField()),
                ("starter_code", models.TextField(blank=True, default="")),
                ("solution", models.TextField()),
                ("test_cases", models.JSONField(blank=True, default=list)),
                ("xp", models.PositiveIntegerField(default=10)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering":["category","id"]},
        ),
        migrations.CreateModel(
            name="PracticeProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("xp", models.PositiveIntegerField(default=0)),
                ("solved_count", models.PositiveIntegerField(default=0)),
                ("current_streak", models.PositiveIntegerField(default=0)),
                ("last_practice_date", models.DateField(blank=True, null=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="practice_profile", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="PracticeAttempt",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("answer", models.TextField(blank=True)),
                ("status", models.CharField(choices=[("SUBMITTED","Submitted"),("PASSED","Passed")], default="SUBMITTED", max_length=20)),
                ("xp_awarded", models.PositiveIntegerField(default=0)),
                ("submitted_at", models.DateTimeField(auto_now_add=True)),
                ("problem", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="attempts", to="practice.practiceproblem")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="practice_attempts", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering":["-submitted_at"]},
        ),
    ]
