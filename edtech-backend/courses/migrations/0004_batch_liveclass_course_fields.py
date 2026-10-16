# Generated manually for live cohort support.

from django.db import migrations, models
import django.db.models.deletion
from cloudinary_storage.storage import RawMediaCloudinaryStorage


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0003_course_syllabus"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="course",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.CreateModel(
            name="Batch",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                ("max_students", models.PositiveIntegerField(default=30)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("early_bird_price", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("registration_open", models.BooleanField(default=True)),
                ("status", models.CharField(choices=[("UPCOMING", "Upcoming"), ("ONGOING", "Ongoing"), ("COMPLETED", "Completed"), ("CANCELLED", "Cancelled")], default="UPCOMING", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("course", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="batches", to="courses.course")),
            ],
            options={"ordering": ["start_date", "name"]},
        ),
        migrations.CreateModel(
            name="LiveClass",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("scheduled_at", models.DateTimeField()),
                ("duration_minutes", models.PositiveIntegerField(default=120)),
                ("meeting_url", models.URLField(blank=True)),
                ("recording_url", models.URLField(blank=True)),
                ("recording_available", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("batch", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="live_classes", to="courses.batch")),
            ],
            options={"ordering": ["scheduled_at"]},
        ),
    ]
