# Generated by Django 4.2.6 on 2023-10-23 23:50

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('post', '0002_alter_post_image'),
        ('feed', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Feed',
            new_name='notifications',
        ),
    ]