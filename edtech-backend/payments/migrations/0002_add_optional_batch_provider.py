from django.db import migrations, models
import django.db.models.deletion


class AddFieldIfColumnMissing(migrations.AddField):
    """Avoid MySQL error 1060 if a prior attempt already created a column.

    MySQL DDL may persist even when Django does not record the migration as
    applied. This lets a retry continue when the requested column is present.
    """

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        model = to_state.apps.get_model(app_label, self.model_name)
        table_name = model._meta.db_table

        with schema_editor.connection.cursor() as cursor:
            tables = schema_editor.connection.introspection.table_names(cursor)
            if table_name in tables:
                columns = {
                    column.name
                    for column in schema_editor.connection.introspection.get_table_description(
                        cursor, table_name
                    )
                }
                field = model._meta.get_field(self.name)
                if field.column in columns:
                    return

        super().database_forwards(app_label, schema_editor, from_state, to_state)


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0004_batch_liveclass_course_fields"),
        ("payments", "0001_initial"),
    ]

    operations = [
        AddFieldIfColumnMissing(
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
        AddFieldIfColumnMissing(
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
