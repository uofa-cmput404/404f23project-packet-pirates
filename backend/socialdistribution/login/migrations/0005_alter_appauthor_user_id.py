# Generated by Django 4.2.6 on 2023-10-23 05:36

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0004_alter_appauthor_display_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appauthor',
            name='user_id',
            field=models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False),
        ),
    ]