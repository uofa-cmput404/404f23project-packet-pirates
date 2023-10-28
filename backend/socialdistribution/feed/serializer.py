from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

class FollowerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowerRequest
        fields = "__all__"

class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends
        fields = "__all__"

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = "__all__"