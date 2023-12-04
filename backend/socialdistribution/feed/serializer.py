from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from login.serializer import AuthorSerializer, AuthorSerializerRemote

import config as c
import requests
from requests.auth import HTTPBasicAuth

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

class FollowerRemoteSerializer(serializers.Serializer):
    author = serializers.SerializerMethodField()
    
    def get_author(self,instance):
        author = AppAuthor.objects.filter(user_id = instance.user_id)

        if (len(author) > 0):
            author = author[0]
            serializer = AuthorSerializerRemote(author)
            return serializer.data
        else:
            author_origin = instance.author_origin
            if ("super-coding" in author_origin):
                basic = HTTPBasicAuth(c.SUPER_USER, c.SUPER_PASS)
                req = requests.get(author_origin, auth=basic)
                return req.json()
            elif ("web-weavers" in author_origin): # Add other groups
                basic = HTTPBasicAuth(c.WW_USER, c.WW_PASS)
                req = requests.get(author_origin, auth=basic)
                return req.json()
            elif ("node-net" in author_origin):
                basic = HTTPBasicAuth(c.SCRIPTED_USER, c.SCRIPTED_PASS)
                req = requests.get(author_origin, auth=basic)
                return req.json()
            
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return rep

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

class InboxCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = "__all__"
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        posts_representation = representation['post_comments']

        # Extract only the 'API' field from each post
        api_fields = {}

        for comment_id, comment_data in posts_representation.items():
            api_fields[comment_id] = {'API': comment_data.get('API', '')}

        representation['post_comments'] = api_fields
        return representation['post_comments']

class InboxLikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = "__all__"
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        posts_representation = representation['post_likes']

        # Extract only the 'API' field from each post
        api_fields = {}

        for post_likes_id, post_likes_data in posts_representation.items():
            api_fields[post_likes_id] = {'API': post_likes_data.get('API', '')}

        representation['post_likes'] = api_fields
        return representation['post_likes']