# Generated by Django 4.2.6 on 2023-11-23 05:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0008_inbox'),
    ]

    operations = [
        migrations.AddField(
            model_name='followerrequest',
            name='is_pending',
            field=models.BooleanField(default=True),
        ),
    ]
