# Generated by Django 4.2.6 on 2023-11-26 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0004_alter_post_is_private'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]