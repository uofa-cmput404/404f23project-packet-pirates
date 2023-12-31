from .serializer import FriendsSerializer, NotificationsSerializer
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import get_user_model, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication, BasicAuthentication
from rest_framework import permissions, status
from rest_framework import generics

from django.http import HttpResponseRedirect, HttpResponse

from post.models import Post, PostLike
from feed.models import Friends
from login.models import AppAuthor

from .models import PostLike

from .serializer import *

from post.serializer import *

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
    authentication_classes = (TokenAuthentication,)

    @swagger_auto_schema(operation_description="Get all notifications for a specific author",
                    operation_summary="Get All Author Notifications",
                    responses={200: NotificationsSerializer()},
                    tags=['Feed'],)

    def get(self, request, pk):
        pk = uuid.UUID(pk)
        notifications = Notifications.objects.filter(author = pk)
        serializer = NotificationsSerializer(notifications, many = True)
        return Response({"Notifications": serializer.data}, status=status.HTTP_200_OK)


class GetUsers(APIView):
    """Returns a list of users, given query"""
    # no authentication needed
    # no permission needed
    permission_classes = (permissions.AllowAny,)
    authentication_classes = () 
    
    def get(self, request):
        query = request.GET.get('q')

        # Fetch and filter data from external API
        basic = HTTPBasicAuth(c.SUPER_USER, c.SUPER_PASS)
        basic2 = HTTPBasicAuth(c.WW_USER, c.WW_PASS)
        basic3 = HTTPBasicAuth(c.SCRIPTED_USER, c.SCRIPTED_PASS)
        # external_data = requests.get("https://super-coding-team-89a5aa34a95f.herokuapp.com/authors/", auth=basic).json()
        external_data = requests.get(c.SUPER_ENDPOINT+"authors/", auth=basic).json()
        external_data2 = requests.get(c.WW_ENDPOINT+"authors/", auth=basic2).json()

        filtered_external_data = [
            {
                "id": author["id"],
                "displayName": author["displayName"],
                "profileImage": author["profileImage"]
            }
            for author in external_data.get("items", [])
            if query.lower() in author.get('displayName', '').lower()
        ]

        filtered_external_data2 = [
            {
                "id": author["id"],
                "displayName": author["displayName"],
                "profileImage": author["profileImage"]
            }
            for author in external_data2.get("items", [])
            if query.lower() in author.get('displayName', '').lower()
        ]

        users = AppAuthor.objects.filter(username__icontains=query)
        serializer = AuthorSerializerRemote(users, many=True)
        Users = {
            "Users": serializer.data + filtered_external_data + filtered_external_data2
        }


        return Response(Users, status=status.HTTP_200_OK)
    
class GetAllUsers(APIView):
    '''
    Returns a list of all users
    '''
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
    authentication_classes = (TokenAuthentication,)

    @swagger_auto_schema(operation_description="Get all friends of a specific author",
                    operation_summary="Get Author's Friends",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],)
    
    def get(self, request, pk):
          
        friends = Friends.objects.filter(author_id = request.user.user_id)
        serializer = FriendsSerializer(friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        

class GetAuthorFollowing(APIView):
    '''
    Get all authors an author follows
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)


    @swagger_auto_schema(operation_description="Get all authors that a specific author follows",
                    operation_summary="Get Authors That Author Follows",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],)
    
    def get(self, request, pk):

        pk = str(uuid.UUID(pk))

        friends = Friends.objects.filter(friend = pk)

        serializer = FriendsSerializer(friends, many=True)
        
        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)


class GetAuthorFollowers(APIView):
    '''
    Get all authors following an author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)


    @swagger_auto_schema(operation_description="Get all authors that follow a speciifc author",
                    operation_summary="Get Authors That Follow An Author",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],)
    
    def get(self, request, pk):

        friends = Friends.objects.filter(author = pk)
        serializer = FriendsSerializer(friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)


class GetTrueFriends(APIView):
    '''
    Get all true friends of an author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    @swagger_auto_schema(operation_description="Get all True Friends",
                    operation_summary="Get All True Friends",
                    responses={200: FriendsSerializer()},
                    tags=['Feed'],)
    
    def get(self, request, pk):
        pk = uuid.UUID(pk)
        
        followers = Friends.objects.filter(author = pk)

        following = Friends.objects.filter(friend = pk)

        # Empty queryset
        true_friends = Friends.objects.none() 

        for follow in following:

            #follow: auth id them friend id me

            friend  =  followers.filter(friend = follow.author)

            if friend.exists():

                true_friends = true_friends | friend

        serializer = FriendsSerializer(true_friends, many=True)

        return Response({"Friends": serializer.data}, status=status.HTTP_200_OK)
        

class FollowRequestPending(APIView):
    '''
    API to check if there is a pending follow request
    '''
    @swagger_auto_schema(operation_description="Check if a follow request is pending",
        operation_summary="Check if a follow request is pending",
        responses={200: FollowerRequestSerializer()},
        tags=['Feed'],)
    
    def get(self, request, sender, recipient):
        follow_req_obj = FollowerRequest.objects.filter(sender = uuid.UUID(sender)).filter(recipient = uuid.UUID(recipient))
        
        if (follow_req_obj):
            if (follow_req_obj[0].is_pending):
                return Response(True, status=status.HTTP_200_OK)
            elif (follow_req_obj[0].is_pending):
                return Response(False, status=status.HTTP_200_OK)
            
        return Response(False, status=status.HTTP_200_OK)

class FollowRequestViews(APIView):
    '''
    Follow Request Object Views
    Get, Post, Delete
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)


    @swagger_auto_schema(operation_description="Get a follow request object",
        operation_summary="Get a follow request object",
        responses={200: FollowerRequestSerializer()},
        tags=['Feed'],)
    
    def get (self, request, pk):

        follow_req_obj = FollowerRequest.objects.filter(sender = uuid.UUID(request.data['data']['sender'])).filter(recipient = uuid.UUID(request.data['data']['recipient']))
        
        if (follow_req_obj):
            serializer = FollowerRequestSerializer(follow_req_obj, many = True)
            return Response (serializer.data, status=status.HTTP_200_OK)
        
        return Response ({"Message": "Follow Request does not exist"}, status=status.HTTP_404_NOT_FOUND)


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
        follow_request_obj = FollowerRequest.objects.filter(sender = request.data['data']['sender']).filter(recipient = request.data['data']['recipient'])

        if (follow_request_obj):
            follow_request_obj.delete()
            return Response({"Message": "Follow Request Object Successfully Deleted"}, status=status.HTTP_200_OK)

        return Response({"Message": "Error has occured when trying to delete follow request"}, status=status.HTTP_400_BAD_REQUEST)

class FriendsViews(APIView):

    '''
    Friend Object Views
    Get, Post
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    @swagger_auto_schema(operation_description="Get a friend object",
        operation_summary="Get a friend object",
        responses={200: FriendsSerializer()},
        tags=['Feed'],)
    
    def get (self, request, pk):
        follow_req_obj = Friends.objects.filter(author = uuid.UUID(request.data['author'])).filter(friend = uuid.UUID(request.data['friend']))
        if (follow_req_obj):
            serializer = FollowerRequestSerializer(follow_req_obj, many = True)
            return Response (serializer.data, status=status.HTTP_200_OK)
        
        return Response ({"Message": "Friend does not exist"}, status=status.HTTP_404_NOT_FOUND)

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


class FriendsDelete(APIView):
    '''
    API for deleting a friend object
    '''
    @swagger_auto_schema(operation_description="Deletes a friend object",
        operation_summary="Deletes a friend object",
        responses={200: FriendsSerializer()},
        tags=['Feed'],)
    
    def delete(self, request, author, friend):

        author_friend = Friends.objects.filter(author = author).filter(friend = friend)

        if (author_friend):
            author_friend.delete()
            return Response ({'Message':"Friend Object Successfully Deleted"}, status=status.HTTP_200_OK)
        
        return Response ({"Error": "Friend does not exist"}, status=status.HTTP_404_NOT_FOUND)

        
    
class NotificationViews(APIView):
    '''
    Notification Views
    Get, Post, Delete
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    @swagger_auto_schema(operation_description= "Get an authors notifications",
        operation_summary="Get an authors notifications",
        responses={200: NotificationsSerializer()},
        tags=['Notifications'],)

    def get(self, request, pk):
        pk = uuid.UUID(pk)
        notifications = Notifications.objects.filter(author = pk)

        serializer = NotificationsSerializer(notifications, many = True)
        
        if (notifications):
            return Response(serializer.data, status=status.HTTP_200_OK) 
        
        return Response (serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Creates a notification object",
        operation_summary="Creates a notification object",
        responses={200: NotificationsSerializer()},
        tags=['Notifications'],)

    def post(self, request, pk):
        
        serializer = NotificationsSerializer(data = request.data) # May have to for loop, we need to send a notification to every author
                                                                  # that are affected by the action

        author = AppAuthor.objects.get(username = request.data['author'])
        request.data['author'] = str(author.user_id)
        
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message': 'Notification Object Successfully Created'}, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)


    @swagger_auto_schema(operation_description="Delete a notification objects",
        operation_summary="Delete a notification objects",
        responses={200: NotificationsSerializer()},
        tags=['Notifications'],)
    
    def delete(self, request, pk):

        notification_object = Notifications.objects.get(notif_id = request.data['data']['notif_id'])

        if (notification_object):
            notification_object.delete()
            return Response({"Message": "Notification Object Successfully Deleted"}, status=status.HTTP_200_OK)

        return Response({"Message": "Error has occured when trying to delete notification"}, status=status.HTTP_400_BAD_REQUEST)


class DeleteAllNotifications(APIView):
    '''
    API to delete all notifications of an author at once except follow requests
    '''
    @swagger_auto_schema(operation_description="Delete all notification objects",
        operation_summary="Delete all notification objects",
        responses={200: NotificationsSerializer()},
        tags=['Notifications'],)
    
    def delete(self, request, pk):

        pk = uuid.UUID(pk)
        notification_objects = Notifications.objects.filter(author = pk).filter(is_follow_notification = False)

        if (notification_objects):
            for notification in notification_objects:

                notification.delete()
            return Response({"Message": "Notification Object Successfully Deleted"}, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_200_OK)


class InboxViews(APIView):
    '''
    Inbox Views for local purposes
    Get, Post
    '''
    permission_classes = (permissions.AllowAny, )
    authentication_classes = ()

    @swagger_auto_schema(operation_description="Get an authors inbox",
        operation_summary="Get an authors inbox",
        responses={200: FollowerRequestSerializer()},
        tags=['Feed'],)

    def get(self, request, pk): 
        '''
        Return the inbox of an author
        '''
        pk = uuid.UUID(pk)

        inbox = Inbox.objects.get(author = pk)

        serializer = InboxSerializer(inbox)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @swagger_auto_schema(operation_description="Updates an authors inbox",
        operation_summary="Updates an authors inbox",
        responses={200: InboxSerializer()},
        tags=['Feed'],)
    
    def post(self, request, pk):
        '''
        Update the inbox of an author
        '''

        inbox = Inbox.objects.get(author = pk)

        if (request.data['type'].lower() == 'post'):
        
            key = str(uuid.uuid4())
            if(inbox.posts == None):
                inbox.posts = {key: request.data}
            else:
                inbox.posts[key] = request.data

        if (request.data['type'].lower() == 'comment'):
            # Need to create comment object and notification
            post_id = request.data['id'].split('/')[6]
            comment_post = Post.objects.get(post_id = post_id)
            author = request.data['author']['id'].split('/')[4]

            comment_id = uuid.uuid4()

            new_comment = {"comment_id":comment_id, "post": comment_post.post_id, "author": author, "author_picture": request.data['author']['profileImage'], 
                            "author_username": request.data['author']['displayName'], "author_origin": request.data['author']['id'], "text": request.data['comment']}
            
            comment_serializer = CommentSerializer(data = new_comment)

            if (comment_serializer.is_valid(raise_exception=True)):
                comment_serializer.save()


            notification = {'author': str(uuid.UUID(pk)), 'notification_author': author, 'notification_author_origin': request.data['author']['id'],
                            'notif_author_pfp': request.data['author']['profileImage'],'notif_author_username':request.data['author']['displayName'], 
                            'message':'Commented on your post', 'is_follow_notification': False} # Swap to heroku link later for pfp
            
            notification_serializer = NotificationsSerializer(data = notification)

            if (notification_serializer.is_valid(raise_exception=True)):
                notification_serializer.save()

        if (request.data['type'].lower() == 'like'):
            # Need to create like object and notification
            post_id = request.data['object'].split('/')[6]
            
            like_post = Post.objects.get(post_id = post_id)
            author = request.data['author']['id'].split('/')[4]

            new_like = {'like_id': uuid.uuid4(), 'author': request.data['author']['id'].split('/')[4], 
                        'author_origin': request.data['author']['id'], 'post_object': like_post.post_id}

            like_serializer = LikeSerializer(data = new_like)
            if (like_serializer.is_valid(raise_exception=True)):
                like_serializer.save()
                new_like_count = like_post.likes_count + 1
                Post.objects.filter(post_id = post_id).update(likes_count = new_like_count)


            notification = {'author': str(uuid.UUID(pk)), 'notification_author': author, 'notification_author_origin': request.data['author']['id'],
                'notif_author_pfp': request.data['author']['profileImage'],'notif_author_username':request.data['author']['displayName'], 
                'message':'Liked your post', 'is_follow_notification': False} # Swap to heroku link later for pfp
            
            notification_serializer = NotificationsSerializer(data = notification)

            if (notification_serializer.is_valid(raise_exception=True)):
                notification_serializer.save()

        if (request.data['type'].lower() == 'follow'):
            # Need to create follow object and notification
            sender = request.data['actor']['id'].split('/')[4]
            recipient = request.data['object']['id'].split('/')[4]

            follow_request = {'sender': str(uuid.UUID(sender)), 'recipient': str(uuid.UUID(recipient)), 'sender_origin':request.data['actor']['id'], 'recipient_origin':request.data['object']['id']}

            follow_serializer = FollowerRequestSerializer(data = follow_request)

            if (follow_serializer.is_valid(raise_exception=True)):
                follow_serializer.save()

            
            notification = {'author': str(uuid.UUID(pk)), 'notification_author': sender, 'notification_author_origin': request.data['actor']['id'],
                'notif_author_pfp': request.data['actor']['profileImage'],'notif_author_username':request.data['actor']['displayName'], 
                'message':'Requested to follow you', 'is_follow_notification': True} # Swap to heroku link later for pfp
            
            notification_serializer = NotificationsSerializer(data = notification)

            if (notification_serializer.is_valid(raise_exception=True)):
                notification_serializer.save()

        
        new_inbox = {'author':inbox.author.user_id, 'posts': inbox.posts, 
                        'post_comments':inbox.post_comments, 'post_likes':inbox.post_likes, "follow_requests":inbox.follow_requests}

        serializer = InboxSerializer(inbox, new_inbox)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message':"Inbox Successfully Updated"}, status = status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


    @swagger_auto_schema(operation_description="Empties an authors inbox",
        operation_summary="Empties an authors inbox",
        responses={200: InboxSerializer()},
        tags=['Feed'],)

    def delete(self, request, pk):
        pk = uuid.UUID(pk)
        inbox = Inbox.objects.get(author = pk)

        new_inbox = {"author": inbox.author.user_id, "posts": None, "post_comments": None, "post_likes":None, "follow_requests":None, "notifications":[]}

        serializer = InboxSerializer(inbox, data = new_inbox)

        if (serializer.is_valid(raise_exception = True)):

            serializer.save()
            return Response ({"Message":"Inbox successfully deleted"}, status = status.HTTP_200_OK)
        
        return Response (status=status.HTTP_200_OK)

class FollowersLocal(APIView):
    '''
    URL: ://service/authors/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
    GET [local, remote] check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID
    '''
    # permission_classes = (permissions.AllowAny, )
    # authentication_classes = ()
    
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (TokenAuthentication, )

    @swagger_auto_schema(operation_description="Check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID",
        operation_summary="Check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID",
        responses={200: FriendsSerializer()},
        tags=['Remote'],)

    def get(self, request, author_id, foreign_author_id):
        author_id = uuid.UUID(author_id)

        foreign_author_id = uuid.UUID(foreign_author_id)

        friend = Friends.objects.filter(author = author_id).filter(friend = foreign_author_id)

        serializer = FriendsSerializer(friend, many = True)

        if (len(serializer.data) == 0):

            return Response(False, status = status.HTTP_200_OK)
        
        return Response (True, status = status.HTTP_200_OK)

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

        author_id = uuid.UUID(author_id)

        friends = Friends.objects.filter(author = author_id)

        friend_list = []
        friend_origin_list = []

        for friend in friends:

            friend_list.append(uuid.UUID(friend.friend))
            friend_origin_list.append(friend.friend_origin)

        authors = AppAuthor.objects.filter(user_id__in = friend_list)

        external_data = []
        for origin in friend_origin_list:
            if ("super-coding" in origin):
                basic = HTTPBasicAuth(c.SUPER_USER, c.SUPER_PASS)
                req = requests.get(origin, auth=basic)
                external_data.append(req.json())
            elif ("web-weavers" in origin): # Add other groups
                basic = HTTPBasicAuth(c.WW_USER, c.WW_PASS)
                req = requests.get(origin, auth=basic)
                external_data.append(req.json())
    
        # Another query to get all foreign authors info

        serializer = AuthorSerializerRemote(authors, many = True)

        return Response({"type": "followers", "items": serializer.data + external_data}, status=status.HTTP_200_OK)
        

class FollowersRemote(APIView):
    '''
    URL: ://service/authors/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
    GET [local, remote] check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID
    '''

    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (BasicAuthentication, TokenAuthentication, )

    @swagger_auto_schema(operation_description="Check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID",
        operation_summary="Check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID",
        responses={200: FriendsSerializer()},
        tags=['Remote'],)

    def get(self, request, author_id, foreign_author_id):
        author_id = uuid.UUID(author_id)

        foreign_author_id = uuid.UUID(foreign_author_id)

        friend = Friends.objects.filter(author = author_id).filter(friend = foreign_author_id)

        serializer = FriendsSerializer(friend, many = True)

        if (len(serializer.data) == 0):

            return Response(False, status = status.HTTP_200_OK)
        
        return Response (True, status = status.HTTP_200_OK)



class InboxViewsRemote(APIView):
    '''
    Inbox Views for remote purposes
    '''

    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (BasicAuthentication, )

    @swagger_auto_schema(operation_description="Updates an authors inbox remotely",
        operation_summary="Updates an authors inbox remotely",
        responses={200: InboxSerializer()},
        tags=['Remote'],)
    
    def post(self, request, author_id):
        '''
        Update the inbox of an author
        '''

        inbox = Inbox.objects.get(author = author_id)

        if (request.data['type'].lower() == 'post'):
        
            key = str(uuid.uuid4())
            request.data['API'] = request.data['id']
            if(inbox.posts == None):
                inbox.posts = {key: request.data}
            else:
                inbox.posts[key] = request.data

        if (request.data['type'].lower() == 'comment'):
            # Need to create comment object and notification
            post_id = request.data['id'].split('/')[6]
            comment_post = Post.objects.get(post_id = post_id)
            author = request.data['author']['id'].split('/')[4]
            comment_id = uuid.uuid4()

            new_comment = {"comment_id":comment_id, "post": comment_post.post_id, "author": author, "author_picture": request.data['author']['profileImage'], 
                            "author_username": request.data['author']['displayName'], "author_origin": request.data['author']['id'], "text": request.data['comment']}
            
            comment_serializer = CommentSerializer(data = new_comment)

            if (comment_serializer.is_valid(raise_exception=True)):
                comment_serializer.save()

            if (str(uuid.UUID(author_id)) != author): # To prevent self notifications
                notification = {'author': str(uuid.UUID(author_id)), 'notification_author': author, 'notification_author_origin': request.data['author']['id'],
                                'notif_author_pfp': request.data['author']['profileImage'],'notif_author_username':request.data['author']['displayName'], 
                                'message':'Commented on your post', 'is_follow_notification': False} # Swap to heroku link later for pfp
                
                notification_serializer = NotificationsSerializer(data = notification)

                if (notification_serializer.is_valid(raise_exception=True)):
                    notification_serializer.save()

        
        if (request.data['type'].lower() == 'like'):
            # Need to create like object and notification
            post_id = request.data['object'].split('/')[6]
            
            like_post = Post.objects.get(post_id = post_id)
            author = request.data['author']['id'].split('/')[4]

            new_like = {'like_id': uuid.uuid4(), 'author': request.data['author']['id'].split('/')[4], 
                        'author_origin': request.data['author']['id'], 'post_object': like_post.post_id}

            like_serializer = LikeSerializer(data = new_like)
            if (like_serializer.is_valid(raise_exception=True)):
                like_serializer.save()
                new_like_count = like_post.likes_count + 1
                Post.objects.filter(post_id = post_id).update(likes_count = new_like_count)

            notification = {'author': str(uuid.UUID(author_id)), 'notification_author': author, 'notification_author_origin': request.data['author']['id'],
                'notif_author_pfp': request.data['author']['profileImage'],'notif_author_username':request.data['author']['displayName'], 
                'message':'Liked your post', 'is_follow_notification': False} # Swap to heroku link later for pfp
            
            notification_serializer = NotificationsSerializer(data = notification)

            if (notification_serializer.is_valid(raise_exception=True)):
                notification_serializer.save()


        if (request.data['type'].lower() == 'follow'):
            # Need to create follow object and notification
            sender = request.data['actor']['id'].split('/')[4]
            recipient = request.data['object']['id'].split('/')[4]

            follow_request = {'sender': str(uuid.UUID(sender)), 'recipient': str(uuid.UUID(recipient)), 'sender_origin':request.data['actor']['id'], 'recipient_origin':request.data['object']['id']}

            follow_serializer = FollowerRequestSerializer(data = follow_request)

            if (follow_serializer.is_valid(raise_exception=True)):
                follow_serializer.save()

            notification = {'author': str(uuid.UUID(author_id)), 'notification_author': sender, 'notification_author_origin': request.data['actor']['id'],
                'notif_author_pfp': request.data['actor']['profileImage'],'notif_author_username':request.data['actor']['displayName'], 
                'message':'Requested to follow you', 'is_follow_notification': True} # Swap to heroku link later for pfp
            
            notification_serializer = NotificationsSerializer(data = notification)

            if (notification_serializer.is_valid(raise_exception=True)):
                notification_serializer.save()
        
        new_inbox = {'author':inbox.author.user_id, 'posts': inbox.posts, 
                        'post_comments':inbox.post_comments, 'post_likes':inbox.post_likes, "follow_requests":inbox.follow_requests}

        serializer = InboxSerializer(inbox, new_inbox)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message':"Inbox Successfully Updated"}, status = status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)