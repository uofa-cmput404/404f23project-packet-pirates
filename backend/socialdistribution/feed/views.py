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


from post.serializer import PostSerializer

from django.core.serializers import serialize

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
        users = AppAuthor.objects.filter(username__icontains = query)
        serializer = AuthorSerializer(users, many = True)
        return Response({"Users": serializer.data}, status=status.HTTP_200_OK)
    
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
    Creates a Follow Request Object
    '''

    def post(self, request, pk): # pk should be the user's primary key and in the request we pass back the profile user's ID they were looking at
                                  # Or request can have both.

        serializer = FollowerRequestSerializer(data = request.data)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message': 'Follow Request Object Successfully Created'}, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk):


class FriendsViews(APIView):
    '''
    Creates a Follow Request Object
    '''

    def post (self, request, pk):

        serializer = FriendsSerializer(data = request.data)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({'message': 'Friend Object Successfully Created'}, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

class NotificationViews(APIView):
    '''
    Creates a notification object
    '''

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
    
    # def delete(self, request, pk):


class InboxViews(APIView):
    '''
    Inbox Notification Views
    Get, Post
    '''

    def get(self, request, pk): 
        '''
        Return the inbox of an author
        '''
        inbox = Inbox.objects.get(author = pk)

        serializer = InboxSerializer(inbox)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def post(self, request, pk):
        '''
        Update the inbox of an author
        '''
        inbox = Inbox.objects.get(author = pk)

        print("Inbox", inbox.author.user_id)

        print("Inbox", inbox.posts.all())

        # for post in list(inbox.posts.all()):
        #     print(serialize('json', [post]) + "\n")

        print("Inbox", inbox.post_comments.all())

        print("Inbox", inbox.post_likes.all())

        print("Inbox", inbox.follow_requests.all())

        author = request.data['author']

        posts = request.data['posts']

        post_comments = request.data['post_comments']

        post_likes = request.data['post_likes']

        follow_requests = request.data['follow_requests']

        new_inbox = None
        
        print("Request", author)

        print("Request", posts)

        print("POST_ID", posts['post_id'])

        post = Post.objects.filter(post_id = posts['post_id'])

        # KEEP THIS BECAUSE WE NEED TO MAKE NOTIFICATIONS HERE AND APPEND TO NOTIFICATION FIELD
        if (len(post) != 0):
            print(post[0])
            inbox.posts.add(post[0])
        elif (len(post) == 0):
            found_author = AppAuthor.objects.get(user_id = posts['author']) # Check if author exists, otherwise create

            new_post = Post.objects.create(post_id = posts['post_id'], title = posts['title'], is_private = posts['is_private'],
                                                    url = posts['url'], likes_count = posts['likes_count'], content_type = posts['content_type'],
                                                    content = posts['content'], source = posts['source'], origin = posts['origin'],
                                                    date_time = posts['date_time'], image_file = posts['image_file'], image_url = ['image_url'],
                                                    unlisted = posts['unlisted'], author = found_author)
            inbox.posts.add(new_post)
            print(new_post)

        print(inbox.posts.all())

        print("Request", post_comments)

        print("COMMENT_ID", post_comments['comment_id'])

        comment = Comment.objects.filter(comment_id = post_comments['comment_id'])

        if (len(comment) != 0):
            print(comment[0])
            inbox.post_comments.add(comment[0])

        elif (len(comment) == 0):
            found_author = AppAuthor.objects.get(user_id = post_comments['author']) # Check if author exists, otherwise create

            found_post = Post.objects.get(post_id = post_comments['post'])

            new_comment = Comment.objects.create(comment_id = post_comments['comment_id'], post = found_post, author = found_author,
                                                author_picture = post_comments['author_picture'], author_username = post_comments['author_username'],
                                                text = post_comments['text'], date_time = post_comments['date_time'])
            
            inbox.post_comments.add(new_comment)
            print(new_comment)

        print("Request", post_likes)

        like = PostLike.objects.filter(like_id = post_likes['like_id'])

        if (len(like) != 0):
            print(like[0])
            inbox.post_likes.add(like[0])

        elif (len(like) == 0):
            found_author = AppAuthor.objects.get(user_id = post_comments['author']) # Check if author exists, otherwise create

            found_post = Post.objects.get(post_id = post_likes['post'])

            new_like = PostLike.objects.create(like_id = post_likes['like_id'], author = found_author, post_object = found_post)
            
            inbox.post_likes.add(new_like)
            print(new_like)

        print("Request", follow_requests)

        print(new_inbox)
        # serializer = InboxSerializer(inbox, data = new_inbox)

        # if (serializer.is_valid(raise_exception=True)):

        return Response(status=status.HTTP_400_BAD_REQUEST)
