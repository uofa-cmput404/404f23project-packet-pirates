# Generated by Django 4.2.6 on 2023-10-24 01:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0008_alter_appauthor_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appauthor',
            name='username',
            field=models.CharField(max_length=40, unique=True),
        ),
    ]
