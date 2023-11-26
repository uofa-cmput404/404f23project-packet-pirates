from .serializer import FriendsSerializer, NotificationsSerializer
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import get_user_model, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
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


from post.serializer import PostSerializer

from django.core.serializers import serialize

import json, copy

import requests
from requests.auth import HTTPBasicAuth
import config as c

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
                    tags=['Feed'],)

    def get(self, request, pk):
        notifications = Notifications.objects.filter(author_id = pk)

        serializer = NotificationsSerializer(notifications, many = True)
        return Response({"Notifications": serializer.data}, status=status.HTTP_200_OK)


class GetUsers(APIView):
    """Returns a list of users, given query"""
    # no authentication needed
    # permission_classes = (permissions.IsAuthenticated,)
    # authentication_classes = (SessionAuthentication,)
    
        # no permission needed
    permission_classes = (permissions.AllowAny,)
    authentication_classes = () 
    
    def get(self, request):
        query = request.GET.get('q')

        # Fetch and filter data from external API
        basic = HTTPBasicAuth(c.SUPER_USER, c.SUPER_PASS)
        # external_data = requests.get("https://super-coding-team-89a5aa34a95f.herokuapp.com/authors/", auth=basic).json()
        external_data = requests.get(c.SUPER_ENDPOINT+"authors/", auth=basic).json()

        filtered_external_data = [
            {
                "id": author["id"],
                "displayName": author["displayName"],
                "profileImage": author["profileImage"]
            }
            for author in external_data.get("items", [])
            if query.lower() in author.get('displayName', '').lower()
        ]
        users = AppAuthor.objects.filter(username__icontains=query)
        serializer = AuthorSerializerRemote(users, many=True)
        Users = {
            "Users": serializer.data + filtered_external_data
        }
        # print(Users)

        return Response(Users, status=status.HTTP_200_OK)
    
    # def get(self, request):
    #     query = request.GET.get('q')
    #     users = AppAuthor.objects.filter(username__icontains = query)
    #     serializer = AuthorSerializer(users, many = True)
    #     return Response({"Users": serializer.data}, status=status.HTTP_200_OK)
    
class GetAllUsers(APIView):
    """Returns ALL users"""
    permission_classes = (permissions.AllowAny,)
    authentication_classes = () 
    
    def get(self, request):
        users = AppAuthor.objects.all()
        serializer = AuthorSerializer(users, many=True)
        return Response({"Users": serializer.data}, status=status.HTTP_200_OK)

class GetAllAuthorFriends(APIView):
    '''
    Get all friends of a given author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Get all friends of a specific author",
                    operation_summary="Get Author's Friends",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],)
    
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
                    tags=['Feed'],)
    
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


    @swagger_auto_schema(operation_description="Get all authors that follow a speciifc author",
                    operation_summary="Get Authors That Follow An Author",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],)
    
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

    @swagger_auto_schema(operation_description="Get all True Friends",
                    operation_summary="Get All True Friends",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],)
    
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

class FollowRequestViews(APIView):
    '''
    Follow Request Object Views
    Post, Delete
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Create a follow request object",
                operation_summary="Create a follow request object",
                responses={200: FollowerRequestSerializer()},
                tags=['Feed'],)

    def post(self, request, pk): # pk should be the user's primary key and in the request we pass back the profile user's ID they were looking at
                                  # Or request can have both.

        serializer = FollowerRequestSerializer(data = request.data)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message': 'Follow Request Object Successfully Created'}, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Deletes a follow request object",
            operation_summary="Deletes a follow request object",
            responses={200: FollowerRequestSerializer()},
            tags=['Feed'],)
        
    def delete(self, request, pk):
        print("FR DATA", request.data)
        follow_request_obj = FollowerRequest.objects.filter(sender = request.data['data']['sender']).filter(recipient = request.data['data']['recipient'])

        if (follow_request_obj):
            follow_request_obj.delete()
            return Response({"Message": "Follow Request Object Successfully Deleted"}, status=status.HTTP_200_OK)

        return Response({"Message": "Error has occured when trying to delete follow request"}, status=status.HTTP_400_BAD_REQUEST)

class FriendsViews(APIView):
    '''
    Creates a Friend Object
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Creates a friend object",
        operation_summary="Creates a friend object",
        responses={200: FriendsSerializer()},
        tags=['Feed'],)
    
    def post (self, request, pk):
        
        serializer = FriendsSerializer(data = request.data)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message': 'Friend Object Successfully Created'}, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # def delete (self, request, pk):

        
    

class NotificationViews(APIView):
    '''
    Creates a notification object
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Creates a notification object",
        operation_summary="Creates a notification object",
        responses={200: NotificationsSerializer()},
        tags=['Notifications'],)

    def post(self, request, pk):
        serializer = NotificationsSerializer(data = request.data) # May have to for loop, we need to send a notification to every author
                                                                  # that are affected by the action

        author = AppAuthor.objects.get(username = request.data['author'])
        request.data['author'] = author.user_id

        serializer.is_valid()
        print(serializer.errors)
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message': 'Notification Object Successfully Created'}, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)


    @swagger_auto_schema(operation_description="Delete a notification object",
        operation_summary="Delete a notification object",
        responses={200: NotificationsSerializer()},
        tags=['Notifications'],)
    
    def delete(self, request, pk):
        print("Notify DATA", request.data)

        notification_object = Notifications.objects.get(notif_id = request.data['data']['notif_id'])

        if (notification_object):
            notification_object.delete()
            return Response({"Message": "Notification Object Successfully Deleted"}, status=status.HTTP_200_OK)

        return Response({"Message": "Error has occured when trying to delete notification"}, status=status.HTTP_400_BAD_REQUEST)


class InboxViews(APIView):
    '''
    Inbox Notification Views
    Get, Post
    '''

    @swagger_auto_schema(operation_description="Get an authors inbox",
        operation_summary="Get an authors inbox",
        responses={200: FollowerRequestSerializer()},
        tags=['Feed'],)

    def get(self, request, pk): 
        '''
        Return the inbox of an author
        '''
        inbox = Inbox.objects.get(author = pk)

        serializer = InboxSerializer(inbox)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    @swagger_auto_schema(operation_description="Updates an authors inbox",
        operation_summary="Updates an authors inbox",
        responses={200: InboxSerializer()},
        tags=['Feed'],)
    
    def post(self, request, pk):
        '''
        Update the inbox of an author
        '''
        inbox = Inbox.objects.get(author = pk)

        # inbox = Inbox.objects.get(author = request.data['author'])
        print(inbox.posts)
        # print("Inbox", inbox.author.user_id)

        # print("Inbox", dict(inbox.posts))

        # print("Inbox", inbox.post_comments)

        # print("Inbox", inbox.post_likes)

        # print("Inbox", inbox.follow_requests)

        author = request.data['author']

        posts = request.data.get('posts')

        post_comments = request.data.get('post_comments')

        post_likes = request.data.get('post_likes')

        follow_requests = request.data.get('follow_requests')

        if (posts is not None):
            key = list(posts.keys())[0]
            if(inbox.posts == None):
                inbox.posts = {key:posts[key]}
                print("New object", inbox.posts)
            else:
                inbox.posts[key] = posts[key]
                print("APPENDED", inbox.posts)

        if (post_comments is not None):
            key = list(post_comments.keys())[0]
            if(inbox.post_comments == None):
                inbox.post_comments = {key:post_comments[key]}
                print("New object", inbox.post_comments)
            else:
                inbox.post_comments[key] = post_comments[key]
                print("APPENDED", inbox.post_comments)

        if (post_likes is not None):
            key = list(post_likes.keys())[0]
            if(inbox.post_likes == None):
                inbox.post_likes = {key:post_likes[key]}
                print("New object", inbox.post_likes)
            else:
                inbox.post_likes[key] = post_likes[key]
                print("APPENDED", inbox.post_likes)

        if (follow_requests is not None):
            key = list(follow_requests.keys())[0]
            if(inbox.follow_requests == None):
                inbox.follow_requests = {key:follow_requests[key]}
                print("New object", inbox.follow_requests)
            else:
                inbox.follow_requests[key] = follow_requests[key]
                print("APPENDED", inbox.follow_requests)

        # KEEP THIS BECAUSE WE NEED TO MAKE NOTIFICATIONS HERE AND APPEND TO NOTIFICATION FIELD
        # if (len(post) != 0):
        #     print(post[0])
        #     inbox.posts.add(post[0])
        # elif (len(post) == 0):
        #     found_author = AppAuthor.objects.get(user_id = posts['author']) # Check if author exists, otherwise create

        #     new_post = Post.objects.create(post_id = posts['post_id'], title = posts['title'], is_private = posts['is_private'],
        #                                             url = posts['url'], likes_count = posts['likes_count'], content_type = posts['content_type'],
        #                                             content = posts['content'], source = posts['source'], origin = posts['origin'],
        #                                             date_time = posts['date_time'], image_file = posts['image_file'], image_url = ['image_url'],
        #                                             unlisted = posts['unlisted'], author = found_author)
        #     inbox.posts.add(new_post)
        #     print(new_post)
        # print(inbox.notifications.all())
        # author = AppAuthor.objects.get(user_id = request.data['author'])
        # new_notification = Notifications.objects.create(author = author, notification_author = author, notif_author_pfp = author.profile_picture, 
                                                        # notif_author_username = author.username, message = 'Liked your post', is_follow_notification = False, url = "")
        # print(new_notification)
        
        new_inbox = {'author':inbox.author.user_id, 'posts': inbox.posts, 
                     'post_comments':inbox.post_comments, 'post_likes':inbox.post_likes, "follow_requests":inbox.follow_requests}

        serializer = InboxSerializer(inbox, new_inbox)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message':"Inbox Successfully Updated"}, status = status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


# REMOTE VIEWS
class GetAuthorsFollowersRemote(APIView):
    '''
    URL: ://service/authors/{AUTHOR_ID}/followers
    GET [local, remote]: get a list of authors who are AUTHOR_ID’s followers
    '''

    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (BasicAuthentication, )
    
    @swagger_auto_schema(operation_description="Get a list of authors who are AUTHOR_ID’s followers",
        operation_summary="Get a list of authors who are AUTHOR_ID’s followers",
        responses={200: AuthorSerializer()},
        tags=['Remote'],)
    
    def get(self, request, author_id):
        friends = Friends.objects.filter(author_id = author_id)

        friend_list = []
        for friend in friends:
            friend_list.append(friend.friend.user_id)

        authors = AppAuthor.objects.filter(user_id__in = friend_list)

        serializer = AuthorSerializerRemote(authors, many = True)

        # serializer = FriendsSerializer(friends, many=True)

        if (authors):
            return Response({"type": "followers", "items": serializer.data}, status=status.HTTP_200_OK)
        
        return Response({"message": "Author's Followers do not exist"}, status=status.HTTP_404_NOT_FOUND)



class FollowersRemote(APIView):
    '''
    URL: ://service/authors/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
    GET [local, remote] check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID
    '''

    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (BasicAuthentication, )

    @swagger_auto_schema(operation_description="Check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID",
        operation_summary="Check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID",
        responses={200: FriendsSerializer()},
        tags=['Remote'],)

    def get(self, request, author_id, foreign_author_id):
        
        friend = Friends.objects.filter(author = author_id).filter(friend = foreign_author_id)

        serializer = FriendsSerializer(friend, many = True)

        if (len(serializer.data) == 0):

            return Response(False, status = status.HTTP_200_OK)
        
        return Response (True, status = status.HTTP_200_OK)


class InboxViewsRemote(APIView):
    '''
    Inbox Post Remote
    '''

    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (BasicAuthentication, )

    @swagger_auto_schema(operation_description="Updates an authors inbox remotely",
        operation_summary="Updates an authors inbox remotely",
        responses={200: InboxSerializer()},
        tags=['Remote'],)
    
    def post(self, request, author_id):
        '''
        Update the inbox of an author remotely
        '''
        inbox = Inbox.objects.get(author_id = author_id) # We need to test this

        # inbox = Inbox.objects.get(author = request.data['author'])

        author = request.data['author']

        posts = request.data['posts']

        post_comments = request.data['post_comments']

        post_likes = request.data['post_likes']

        follow_requests = request.data['follow_requests']
        
        if (posts is not None):
            key = list(posts.keys())[0]
            if(inbox.posts == None):
                inbox.posts = {key:posts[key]}
                print("New object", inbox.posts)
            else:
                inbox.posts[key] = posts[key]
                print("APPENDED", inbox.posts)

        if (post_comments is not None):
            key = list(post_comments.keys())[0]
            if(inbox.post_comments == None):
                inbox.post_comments = {key:post_comments[key]}
                print("New object", inbox.post_comments)
            else:
                inbox.post_comments[key] = post_comments[key]
                print("APPENDED", inbox.post_comments)

        if (post_likes is not None):
            key = list(post_likes.keys())[0]
            if(inbox.post_likes == None):
                inbox.post_likes = {key:post_likes[key]}
                print("New object", inbox.post_likes)
            else:
                inbox.post_likes[key] = post_likes[key]
                print("APPENDED", inbox.post_likes)

        if (follow_requests is not None):
            key = list(follow_requests.keys())[0]
            if(inbox.follow_requests == None):
                inbox.follow_requests = {key:follow_requests[key]}
                print("New object", inbox.follow_requests)
            else:
                inbox.follow_requests[key] = follow_requests[key]
                print("APPENDED", inbox.follow_requests)
        
        new_inbox = {'author':inbox.author.user_id, 'posts': inbox.posts, 
                     'post_comments':inbox.post_comments, 'post_likes':inbox.post_likes, "follow_requests":inbox.follow_requests}

        serializer = InboxSerializer(inbox, new_inbox)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'Message':"Inbox Successfully Updated"}, status = status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)