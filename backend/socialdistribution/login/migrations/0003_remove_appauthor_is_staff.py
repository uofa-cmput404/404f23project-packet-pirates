# Generated by Django 4.2.6 on 2023-10-22 21:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0002_appauthor_is_staff'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appauthor',
            name='is_staff',
        ),
    ]
