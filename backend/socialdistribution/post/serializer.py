from rest_framework import serializers
from .models import *
from login.models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
AuthorModel = get_user_model()
from login.serializer import AuthorSerializer

class PostSerializer(serializers.ModelSerializer):
    # author = serializers.PrimaryKeyRelatedField(queryset=AppAuthor.objects.all(), pk_field = serializers.UUIDField(format ='hex_verbose'))
    # author = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Post
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = "__all__"

class PostSerializerRemote(serializers.ModelSerializer):
    # author = serializers.PrimaryKeyRelatedField(queryset=AppAuthor.objects.all(), pk_field = serializers.UUIDField(format ='hex_verbose'))
    # author = serializers.PrimaryKeyRelatedField(read_only=True)
    author = AuthorSerializer()
    class Meta:
        model = Post
        fields = "__all__"

class LikeSerializerRemote(serializers.ModelSerializer):
    author = AuthorSerializer()
    class Meta:
        model = PostLike
        fields = "__all__"

class CommentSerializerRemote(serializers.ModelSerializer):
    author = AuthorSerializer()
    class Meta:
        model = Comment
        fields = "__all__"
