# Generated by Django 4.2.6 on 2023-10-29 04:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('feed', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='notifications',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='main_author', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='notifications',
            name='notification_author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifier', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='friends',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='authors', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='friends',
            name='friend',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='authors_friends', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='followerrequest',
            name='recipient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follow_receiver', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='followerrequest',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follow_requester', to=settings.AUTH_USER_MODEL),
        ),
    ]
