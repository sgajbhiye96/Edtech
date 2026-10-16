# Generated manually for live cohort support.

from datetime import timedelta
from django.db import migrations, models
import django.db.models.deletion
from django.utils import timezone


def migrate_course_enrollments(apps, schema_editor):
    Course = apps.get_model("courses", "Course")
    Batch = apps.get_model("courses", "Batch")
    Enrollment = apps.get_model("enrollments", "Enrollment")

    today = timezone.now().date()
    default_end = today + timedelta(days=56)

    batches = {}
    for course in Course.objects.all():
        batch, _ = Batch.objects.get_or_create(
            course_id=course.id,
            name="Legacy Batch",
            defaults={
                "start_date": today,
                "end_date": default_end,
                "max_students": 100000,
                "price": course.price,
                "registration_open": False,
                "status": "COMPLETED",
            },
        )
        batches[course.id] = batch.id

    seen = set()
    for enrollment in Enrollment.objects.order_by("id"):
        batch_id = batches.get(enrollment.course_id)
        if not batch_id:
            continue

        key = (enrollment.user_id, batch_id)
        if key in seen:
            enrollment.delete()
            continue

        enrollment.batch_id = batch_id
        enrollment.status = "ACTIVE"
        enrollment.save(update_fields=["batch_id", "status"])
        seen.add(key)


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0004_batch_liveclass_course_fields"),
        ("enrollments", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="enrollment",
            name="batch",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="enrollments",
                to="courses.batch",
            ),
        ),
        migrations.AddField(
            model_name="enrollment",
            name="status",
            field=models.CharField(
                choices=[
                    ("PENDING_PAYMENT", "Pending payment"),
                    ("ACTIVE", "Active"),
                    ("CANCELLED", "Cancelled"),
                    ("COMPLETED", "Completed"),
                ],
                default="PENDING_PAYMENT",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="enrollment",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.RunPython(migrate_course_enrollments, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="enrollment",
            name="course",
        ),
        migrations.AlterField(
            model_name="enrollment",
            name="batch",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="enrollments",
                to="courses.batch",
            ),
        ),
        migrations.AlterField(
            model_name="enrollment",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="enrollments",
                to="users.user",
            ),
        ),
        migrations.AddConstraint(
            model_name="enrollment",
            constraint=models.UniqueConstraint(
                fields=("user", "batch"),
                name="unique_user_batch_enrollment",
            ),
        ),
    ]
