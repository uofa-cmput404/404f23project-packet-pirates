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

from rest_framework import generics
from .models import PostLike

from .serializer import *
from login.models import AppAuthor

from login.serializer import *

from post.validate import *

# Create your views here.


class GetPost(APIView):
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


class CreatePost(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        # print(request)
        # author = AppAuthor.objects.get(user_id = request.user.user_id)
        # print(author.display_name)
        # authorSerializer = AuthorSerializer(author)
        # print(authorSerializer)
    
        # validated_data = custom_validation(request.data)
        serializer = PostSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)

        

# class LikePost(APIView):
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = PostLikeSerializer

#     def perform_create(self, serializer):
#         post_id = serializer.validated_data.get('post_id')
#         author = self.request.user
#         # Check if the user hasn't already liked the post
#         if not PostLike.objects.filter(post_id=post_id, author=author).exists():
#             serializer.save(author=author)
            


# class EditPost(APIView):
#     permission_classes = (permissions.IsAuthenticated,)

#     def get_queryset(self):
#         # Filter posts based on the author and post_id
#         return Post.objects.filter(author=self.request.user, id=self.kwargs['pk'])