# from .models import Author
from .serializer import PostSerializer
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.contrib.auth import get_user_model, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.core.files.images import ImageFile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework import permissions, status

from post.models import Post, PostLike
from feed.models import Friends

from rest_framework import generics
from .models import PostLike

from .serializer import *
from login.models import AppAuthor

from login.serializer import *

from post.validate import *

import uuid
import io
# Create your views here.


class GetAuthorsPosts(APIView):
    '''
    Get posts that the specific author has posted in the database
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, pk):
        posts = Post.objects.filter(author_id = request.user.user_id) # Find posts that the specific author has posted
        # posts = Post.objects.all()
        serializer = PostSerializer(posts, many = True)
        return Response({"Posts": serializer.data}, status=status.HTTP_200_OK)
    
    
class test(APIView):
    # no permission needed
    permission_classes = (permissions.AllowAny,)
    # no authentication needed
    authentication_classes = ()
    
    def get(self, request):
        return Response(status=status.HTTP_200_OK)    

    
class GetFeedPostsByUsername(APIView):
    '''
    Get all posts made by a specific author
    '''
    permission_classes = (permissions.AllowAny,)
    # no authentication needed
    authentication_classes = ()
    
    
    def get(self, request, pk):
        author = AppAuthor.objects.get(username = pk)
        # is_private = false
        posts = Post.objects.filter(author_id=author.user_id) # Find posts that the specific author has posted
        serializer = PostSerializer(posts, many = True)
        return Response({"Posts": serializer.data}, status=status.HTTP_200_OK)

    # def get(self, request, pk):
    #     author = AppAuthor.objects.get(username = pk)
    #     posts = Post.objects.filter(author_id = author.user_id) # Find posts that the specific author has posted

    #     friends = Friends.objects.filter(author = author.user_id) # Friends of author

    #     for friend in friends:

    #         posts = posts | Post.objects.filter(author_id = friend.author_id) # Add posts from each friend

    #     serializer = PostSerializer(posts, many = True)
    #     return Response({"Posts": serializer.data}, status=status.HTTP_200_OK)

class GetFeedPosts(APIView):
    '''
    Get posts that should show up in a author's feed
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, pk):
        posts = Post.objects.filter(author_id = request.user.user_id).exclude(unlisted = True) # Find posts that the specific author has posted

        friends = Friends.objects.filter(author = request.user.user_id) # Friends of author

        for friend in friends:

            posts = posts | Post.objects.filter(author_id = friend.author_id).exclude(unlisted = True) # Add posts from each friend

        serializer = PostSerializer(posts, many = True)
        return Response({"Posts": serializer.data}, status=status.HTTP_200_OK)


class PostViews(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request): # Create a post
        # print(request.data['post_id'])
        # author = AppAuthor.objects.get(user_id = request.user.user_id)
        # print(author.display_name)
        # authorSerializer = AuthorSerializer(author)
        # print(authorSerializer)
        print(request)
        print(request.data)

        # data = request.data[0]
        # print(data)
    
        # validated_data = custom_validation(request.data)

        # picture = request.data['image_file']
        # image = ImageFile(io.BytesIO(picture.file.read()), name = picture.name)
        # request.data['image_file'] = image

        request.data['image_url'] = 'https://picsum.photos/200'

        serializer = PostSerializer(data = request.data)
        serializer.is_valid()
        print(serializer.errors)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
    
    # def delete(self, request):

    

class EditPost(APIView): # Have to pass the post_id on the content body from the front-end

    permission_classes = (permissions.AllowAny,)

    authentication_classes = ()

    def post(self, request, pk):
        post_id = uuid.UUID(pk)

        # validated_data = custom_validation(request.data)
        post = Post.objects.get(post_id = post_id)
        
        # Update like count
        new_like_count = request.data.get('like_count', None)
        if new_like_count is not None:
            post.likes = new_like_count
            # post.save() 
            return Response(status=status.HTTP_200_OK)
        
        serializer = PostSerializer(post, data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"message": "Post successfully updated"}, status=status.HTTP_200_OK)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
    

class PostComments(APIView):
    '''
    All comments of a post
    '''
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    # permission_classes = (permissions.IsAuthenticated,)
    # authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        post_id = uuid.UUID(pk)
        comments = Comment.objects.filter(post_id = post_id)
        serializer = CommentSerializer(comments, many = True)
        
        return Response({"Comments": serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request, pk):
        post_id = uuid.UUID(pk)
        request.data['post'] = post_id
        print(request)
        serializer = CommentSerializer(data = request.data)
        serializer.is_valid()
        print(serializer.errors)
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({"message" : "Comment Model Created"}, status=status.HTTP_201_CREATED)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, pk):
        comment_id = request.data['comment_id']
        comment = Comment.objects.filter(comment_id = comment_id)

        if comment:
            comment.delete()
            return Response({"message": "Comment Model Successfully Deleted"}, status=status.HTTP_200_OK)
        
        return Response({"message": "Comment Model Does Not Exist"}, status=status.HTTP_404_NOT_FOUND)
  

class PostLikeViews(APIView):
    '''
    All likes of a post
    '''
    # permission_classes = (permissions.AllowAny,)
    
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, pk): # Get all likes
        post_id = uuid.UUID(pk) # pk needs to be post ID not author

        likes = PostLike.objects.filter(post_object_id = post_id)
    
        serializer = LikeSerializer(likes, many = True)
  
        return Response ({"Post Likes": serializer.data}, status=status.HTTP_200_OK)
 
    def post(self, request, pk): # For liking a post
        post_object_id = uuid.UUID(pk)
        request.data['post_object_id'] = post_object_id
        serializer = LikeSerializer(data = request.data)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({"message" : "Like Model Created"}, status=status.HTTP_201_CREATED)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk): # For unliking a post
        post_id = uuid.UUID(pk)
        author_id = request.user.user_id

        post_liked = PostLike.objects.filter(author_id = author_id).filter(post_object_id = post_id)

        if post_liked:
            post_liked.delete()
            return Response({"message": "Like Model Successfully Deleted"}, status=status.HTTP_200_OK)
        
        return Response({"message": "Like Model Does Not Exist"}, status=status.HTTP_404_NOT_FOUND)
