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
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Create your views here.

class GetAllNotifications(APIView):
    '''
    Get all notifications that should show up in a given author's feed
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Get all notifications for a specific author",
                    operation_summary="Get All Author Notifications",
                    responses={200: NotificationsSerializer()},
                    tags=['Feed'],
                    manual_parameters=[
                        openapi.Parameter(
                            name='pk',
                            in_=openapi.IN_PATH,
                            type=openapi.TYPE_STRING,
                            description='Author ID',
                            required=True,
                            enum=[]
                        )
                    ])

    def get(self, request, pk):
        notifications = Notifications.objects.filter(author_id = request.user.user_id)

        serializer = NotificationsSerializer(notifications, many = True)
        return Response({"Notifications": serializer.data}, status=status.HTTP_200_OK)


class GetAllAuthorFriends(APIView):
    '''
    Get all friends of a given author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Get all friends of a specific author",
                    operation_summary="Get Author's Friends",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],
                    manual_parameters=[
                        openapi.Parameter(
                            name='pk',
                            in_=openapi.IN_PATH,
                            type=openapi.TYPE_STRING,
                            description='Author ID',
                            required=True,
                            enum=[]
                        )
                    ])
    
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


    @swagger_auto_schema(operation_description="Get all authors that a specific author follows",
                    operation_summary="Get Authors That Author Follows",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],
                    manual_parameters=[
                        openapi.Parameter(
                            name='pk',
                            in_=openapi.IN_PATH,
                            type=openapi.TYPE_STRING,
                            description='Author ID',
                            required=True,
                            enum=[]
                        )
                    ])
    
    def get(self, request, pk):
          
        friends = Friends.objects.filter(friend_id = request.user.user_id)
        serializer = FriendsSerializer(friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        
        # friends = Friends.author.objects.get(author_id = request.user.user_id)

class GetAuthorFollowers(APIView):
    '''
    Get all authors an following an author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)


    @swagger_auto_schema(operation_description="Get all authors that follow a speciifc author",
                    operation_summary="Get Authors That Follow An Author",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],
                    manual_parameters=[
                        openapi.Parameter(
                            name='pk',
                            in_=openapi.IN_PATH,
                            type=openapi.TYPE_STRING,
                            description='Author ID',
                            required=True,
                            enum=[]
                        )
                    ])
    
    def get(self, request, pk):
          
        friends = Friends.objects.filter(author_id = request.user.user_id)
        serializer = FriendsSerializer(friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        
        # friends = Friends.author.objects.get(author_id = request.user.user_id)

class GetTrueFriends(APIView):
    '''
    Get all true friends of an author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Get all True Friends",
                    operation_summary="Get All True Friends",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],
                    manual_parameters=[
                        openapi.Parameter(
                            name='pk',
                            in_=openapi.IN_PATH,
                            type=openapi.TYPE_STRING,
                            description='Author ID',
                            required=True,
                            enum=[]
                        )
                    ])
    
    def get(self, request, pk):
          
        followers = Friends.objects.filter(author_id = request.user.user_id)

        following = Friends.objects.filter(friend_id = request.user.user_id)

        # Empty queryset
        true_friends = Friends.objects.none() 

        for follow in following:

            friend  =  followers.filter(author_id = follow.friend)

            if friend.exists():

                true_friends = true_friends | friend

        serializer = FriendsSerializer(true_friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        
        # friends = Friends.author.objects.get(author_id = request.user.user_id)
        