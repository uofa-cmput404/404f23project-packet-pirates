# Generated by Django 4.2.6 on 2023-11-23 06:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0009_followerrequest_is_pending'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inbox',
            name='notifications',
            field=models.ManyToManyField(blank=True, to='feed.notifications'),
        ),
    ]
