# Generated by Django 4.2.6 on 2023-10-29 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0003_notifications_notif_author_pfp_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notifications',
            name='message',
            field=models.CharField(choices=[('Liked your post', 'liked'), ('Commented on your post', 'commented')], max_length=200),
        ),
    ]