# Generated by Django 4.2.6 on 2023-11-26 02:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0012_alter_friends_friend_pfp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inbox',
            name='follow_requests',
            field=models.JSONField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='inbox',
            name='post_comments',
            field=models.JSONField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='inbox',
            name='post_likes',
            field=models.JSONField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='inbox',
            name='posts',
            field=models.JSONField(blank=True, default=''),
        ),
    ]
