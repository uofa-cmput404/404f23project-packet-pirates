# Generated by Django 4.2.6 on 2023-11-22 08:31

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0006_notifications_is_follow_notification_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notifications',
            name='id',
        ),
        migrations.AddField(
            model_name='notifications',
            name='notif_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='notifications',
            name='notif_author_pfp',
            field=models.URLField(blank=True, max_length=300, null=True),
        ),
    ]
