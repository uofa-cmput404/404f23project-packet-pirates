# Generated by Django 4.2.6 on 2023-11-24 07:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0011_remove_inbox_follow_requests_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friends',
            name='friend_pfp',
            field=models.URLField(blank=True, null=True),
        ),
    ]