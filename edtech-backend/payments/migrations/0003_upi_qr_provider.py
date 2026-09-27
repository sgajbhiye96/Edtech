from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0002_razorpay_batch"),
    ]

    operations = [
        migrations.AlterField(
            model_name="payment",
            name="provider",
            field=models.CharField(
                max_length=20,
                choices=[
                    ("RAZORPAY", "Razorpay"),
                    ("UPI_QR", "UPI QR"),
                ],
                default="RAZORPAY",
            ),
        ),
    ]
