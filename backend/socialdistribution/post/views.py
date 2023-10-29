# from .models import Author
from .serializer import PostSerializer
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import get_user_model, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status

from django.http import HttpResponseRedirect, HttpResponse

from post.models import Post, PostLike
from feed.models import Friends

from rest_framework import generics
from .models import PostLike

from .serializer import *
from login.models import AppAuthor

from login.serializer import *

from post.validate import *

import uuid
# Create your views here.


class GetAuthorsPosts(APIView):
    '''
    Get posts that the specific author has posted in the database
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        posts = Post.objects.filter(author_id = request.user.user_id) # Find posts that the specific author has posted
        # posts = Post.objects.all()
        serializer = PostSerializer(posts, many = True)
        return Response({"Posts": serializer.data}, status=status.HTTP_200_OK)
    

class GetFeedPosts(APIView):
    '''
    Get posts that should show up in a author's feed
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        posts = Post.objects.filter(author_id = request.user.user_id) # Find posts that the specific author has posted

        friends = Friends.objects.filter(author = request.user.user_id) # Friends of author

        for friend in friends:

            posts = posts | Post.objects.filter(author_id = friend.author_id) # Add posts from each friend

        serializer = PostSerializer(posts, many = True)
        return Response({"Posts": serializer.data}, status=status.HTTP_200_OK)


class CreatePost(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        # print(request.data['post_id'])
        # author = AppAuthor.objects.get(user_id = request.user.user_id)
        # print(author.display_name)
        # authorSerializer = AuthorSerializer(author)
        # print(authorSerializer)
        print(request.body)
    
        # validated_data = custom_validation(request.data)
        serializer = PostSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
    

class EditPost(APIView): # Have to pass the post_id on the content body from the front-end
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, pk):
        post_id = uuid.UUID(pk)

        # validated_data = custom_validation(request.data)
        post = Post.objects.get(post_id = post_id)
        serializer = PostSerializer(post, data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
    

class GetPostComments(APIView):
    '''
    All comments of a post
    '''
    # permission_classes = (permissions.AllowAny,)

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        post_id = uuid.UUID(pk)
        comments = Comment.objects.filter(post_id = post_id)
        serializer = CommentSerializer(comments, many = True)
        
        return Response({"Comments": serializer.data}, status=status.HTTP_200_OK)
  

class getPostLike(APIView):
    '''
    All likes of a post
    '''
    # permission_classes = (permissions.AllowAny,)
    
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        post_id = uuid.UUID(pk)
        likes = PostLike.objects.filter(post_object = post_id)
        serializer = LikeSerializer(likes, many = True)

        return Response ({"Post Likes": serializer.data}, status=status.HTTP_200_OK)