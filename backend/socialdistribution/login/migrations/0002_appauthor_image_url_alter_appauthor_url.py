# Generated by Django 4.2.6 on 2023-11-24 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='appauthor',
            name='image_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='appauthor',
            name='url',
            field=models.URLField(blank=True),
        ),
    ]
