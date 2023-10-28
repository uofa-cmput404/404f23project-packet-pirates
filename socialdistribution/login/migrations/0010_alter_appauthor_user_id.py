# Generated by Django 4.2.6 on 2023-10-24 01:39

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0009_alter_appauthor_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appauthor',
            name='user_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]