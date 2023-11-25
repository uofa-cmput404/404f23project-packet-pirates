# Generated by Django 4.2.6 on 2023-11-22 04:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0005_friends_friend_pfp_friends_friend_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='notifications',
            name='is_follow_notification',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='notifications',
            name='message',
            field=models.CharField(choices=[('Liked your post', 'liked'), ('Commented on your post', 'commented'), ('Created a new post', 'posted'), ('Requested to follow you', 'follow')], max_length=200),
        ),
    ]
