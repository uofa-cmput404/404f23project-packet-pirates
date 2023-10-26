# Generated by Django 4.2.6 on 2023-10-26 22:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0005_alter_comment_comment_id_alter_post_post_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='image',
            new_name='image_file',
        ),
        migrations.AddField(
            model_name='post',
            name='image_url',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
