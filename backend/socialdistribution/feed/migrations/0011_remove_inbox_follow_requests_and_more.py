# Generated by Django 4.2.6 on 2023-11-23 21:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0010_alter_inbox_notifications'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inbox',
            name='follow_requests',
        ),
        migrations.RemoveField(
            model_name='inbox',
            name='post_comments',
        ),
        migrations.RemoveField(
            model_name='inbox',
            name='post_likes',
        ),
        migrations.RemoveField(
            model_name='inbox',
            name='posts',
        ),
        migrations.AddField(
            model_name='inbox',
            name='follow_requests',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='inbox',
            name='post_comments',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='inbox',
            name='post_likes',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='inbox',
            name='posts',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
