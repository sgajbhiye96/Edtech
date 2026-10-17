from django.db import migrations, models
import django.db.models.deletion


def migrate_payments_to_batches(apps, schema_editor):
    Payment = apps.get_model("payments", "Payment")
    Batch = apps.get_model("courses", "Batch")
    Course = apps.get_model("courses", "Course")

    batches = {}
    for payment in Payment.objects.all():
        if payment.course_id is None:
            continue
        if payment.course_id not in batches:
            course = Course.objects.filter(pk=payment.course_id).first()
            if course is None:
                continue
            batch, _ = Batch.objects.get_or_create(
                course_id=course.id,
                name="Legacy Payment Batch",
                defaults={
                    "start_date": course.created_at.date(),
                    "end_date": course.created_at.date(),
                    "max_students": 100000,
                    "price": course.price,
                    "registration_open": False,
                    "status": "COMPLETED",
                },
            )
            batches[payment.course_id] = batch.id
        payment.batch_id = batches[payment.course_id]
        payment.save(update_fields=["batch_id"])


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0004_batch_liveclass_course_fields"),
        ("payments", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="payment",
            name="batch",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="payments",
                to="courses.batch",
            ),
        ),
        migrations.AddField(
            model_name="payment",
            name="provider",
            field=models.CharField(
                choices=[("RAZORPAY", "Razorpay")],
                default="RAZORPAY",
                max_length=20,
            ),
        ),
        migrations.RunPython(migrate_payments_to_batches, migrations.RunPython.noop),
        migrations.RemoveField(model_name="payment", name="course_id"),
        migrations.RemoveField(model_name="payment", name="cf_order_id"),
        migrations.AlterField(
            model_name="payment",
            name="batch",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="payments",
                to="courses.batch",
            ),
        ),
    ]
