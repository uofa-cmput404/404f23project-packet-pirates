# Generated by Django 4.2.6 on 2023-12-02 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0007_postlike_author_origin'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='author_origin',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='post',
            name='author_origin',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
