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


from .serializer import *
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

    

