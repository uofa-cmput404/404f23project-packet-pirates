from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

class CommentSerializer (serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"