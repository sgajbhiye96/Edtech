from django.db import migrations, models
import django.db.models.deletion


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
                blank=True,
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
                choices=[("RAZORPAY", "Razorpay"), ("UPI_QR", "UPI QR")],
                default="RAZORPAY",
                max_length=20,
            ),
        ),
        # Deliberately retain course_id and cf_order_id. Existing payment rows
        # are not rewritten or deleted by this migration.
    ]
