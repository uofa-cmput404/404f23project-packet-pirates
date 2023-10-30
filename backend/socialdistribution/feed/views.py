from .serializer import FriendsSerializer, NotificationsSerializer
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import get_user_model, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status
from rest_framework import generics

from django.http import HttpResponseRedirect, HttpResponse

from post.models import Post, PostLike
from feed.models import Friends
from login.models import AppAuthor

from .models import PostLike

from .serializer import *

from login.serializer import *

from post.validate import *

import uuid
# Create your views here.

class GetAllNotifications(APIView):
    '''
    Get all notifications that should show up in a given author's feed
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        notifications = Notifications.objects.filter(author_id = pk)

        serializer = NotificationsSerializer(notifications, many = True)
        return Response({"Notifications": serializer.data}, status=status.HTTP_200_OK)


class GetAllAuthorFriends(APIView):
    '''
    Get all friends of a given author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
          
        friends = Friends.objects.filter(author_id = request.user.user_id)
        serializer = FriendsSerializer(friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        
        # friends = Friends.author.objects.get(author_id = request.user.user_id)

class GetAuthorFollowing(APIView):
    '''
    Get all authors an author follows
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
          
        friends = Friends.objects.filter(friend_id = pk)
        serializer = FriendsSerializer(friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        
        # friends = Friends.author.objects.get(author_id = request.user.user_id)

class GetAuthorFollowers(APIView):
    '''
    Get all authors an following an author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):

        friends = Friends.objects.filter(author_id = pk)
        serializer = FriendsSerializer(friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        
        # friends = Friends.author.objects.get(author_id = request.user.user_id)

class GetTrueFriends(APIView):
    '''
    Get all true friends of an author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
          
        followers = Friends.objects.filter(author_id = pk)

        following = Friends.objects.filter(friend_id = pk)

        # Empty queryset
        true_friends = Friends.objects.none() 

        for follow in following:

            #follow: auth id them friend id me

            friend  =  followers.filter(friend_id = follow.author)

            if friend.exists():

                true_friends = true_friends | friend

        serializer = FriendsSerializer(true_friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        
        # friends = Friends.author.objects.get(author_id = request.user.user_id)
        