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


class InboxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = "__all__"
        
class InboxPostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = "__all__"
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        posts_representation = representation['posts']

        # Extract only the 'API' field from each post
        api_fields = {}

        for post_id, post_data in posts_representation.items():
            api_fields[post_id] = {'API': post_data.get('API', '')}

        representation['posts'] = api_fields
        return representation['posts']