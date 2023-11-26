from rest_framework import serializers
from .models import *
from login.models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
AuthorModel = get_user_model()
from login.serializer import AuthorSerializer, AuthorSerializerRemote

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
    type = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    origin = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField(source = "content")
    categories = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    published = serializers.SerializerMethodField(source = "date_time")
    visibility = serializers.SerializerMethodField()
    unlisted = serializers.SerializerMethodField()
    contentType = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    def get_type(self,instance):
        return 'post'
    
    def get_id(self,instance):
        return "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + str(instance.author) + "/posts/" + str(instance.post_id)
    
    def get_author(self,instance):
        author = AppAuthor.objects.get(user_id = instance.author)
        serializer = AuthorSerializerRemote(author)
        return serializer.data

    def get_source(self, instance):
        return 'https://packet-pirates-backend-d3f5451fdee4.herokuapp.com'
    
    def get_origin(self, instance):
        return 'https://packet-pirates-backend-d3f5451fdee4.herokuapp.com'
    
    def get_description(self, instance):
        return instance.content
    
    def get_contentType(self, instance):
        return instance.content_type
    
    def get_content(self, instance):
        return instance.content

    def get_categories(self, instance):
        return ["web", "internet"]
    
    def get_count(self, instance):
        num_comments = Comment.objects.filter(post_id = instance.post_id).count()
        return num_comments
    
    def get_comments(self, instance):
        return "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + str(instance.author) + "/posts/" + str(instance.post_id) + "/comments"

    def get_published(self, instance):
        return instance.date_time
    
    def get_visibility(self, instance):
        if (instance.is_private == True):
            return "FRIENDS"
        elif (instance.is_private == False):
            return "PUBLIC"
    
    def get_unlisted(self, instance):
        if (instance.unlisted == True):
            return True
        elif (instance.unlisted == False):
            return False

    class Meta:
        model = Post
        fields = ("type", "title", "id", "source", "origin", "description", "contentType", "content", "author", "categories", "count", "comments", "published", "visibility", "unlisted")


class LikeSerializerRemote(serializers.ModelSerializer):
    summary = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    object = serializers.SerializerMethodField()

    author = serializers.SerializerMethodField()

    def get_type(self,instance):
        return "Like"
    
    def get_author(self,instance):
        author = AppAuthor.objects.get(user_id = instance.author)
        serializer = AuthorSerializerRemote(author)
        return serializer.data
    
    def get_summary(self,instance):
        return ''
    
    def get_object(self, instance):
        return ''
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        author = AppAuthor.objects.get(user_id = instance.author)

        representation['@context'] = "https://www.w3.org/ns/activitystreams"
        representation['summary'] = author.username + " liked your post"
        representation['object'] = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + str(instance.author) + "/posts/" + str(instance.post_object.post_id)
        return representation
    
    class Meta:
        model = PostLike
        fields = ("summary", "type", "author", "object")

class CommentSerializerRemote(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    comment = serializers.SerializerMethodField(source = 'text')
    contentType = serializers.SerializerMethodField()

    published = serializers.SerializerMethodField(source = 'date_time')
    id = serializers.SerializerMethodField()

    def get_type(self, instance):
        return 'comment'
    
    def get_author(self,instance):
        print(instance.author)
        author = AppAuthor.objects.get(user_id = instance.author)
        serializer = AuthorSerializerRemote(author)
        return serializer.data

    def get_comment(self, instance):
        return instance.text
    
    def get_contentType(self, instance):
        return 'text/plaintext'
    
    def get_id(self, instance):
        return ''
    
    def get_published(self, instance):
        return instance.date_time
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['id'] = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + str(instance.author) + "/posts/" + str(instance.post.post_id)
        return representation
    
    class Meta:
        model = Comment
        fields = ("type", "author", "comment", "contentType", "published", "id")
