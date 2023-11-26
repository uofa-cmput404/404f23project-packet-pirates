# from .models import Author
from .serializer import PostSerializer
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.contrib.auth import get_user_model, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.core.files.images import ImageFile
from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import permissions, status

from post.models import Post, PostLike
from feed.models import Friends

from rest_framework import generics
from .models import PostLike

from .serializer import *
from login.models import AppAuthor

from login.serializer import *
from feed.serializer import *

from post.validate import *

import uuid
import io
from drf_yasg.utils import swagger_auto_schema
# Create your views here.

from drf_yasg import openapi

class ViewPostByID(APIView): # FOR TESTING PURPOSES DELETE LATER

    def get(self, request, pk):
        post = Post.objects.get(post_id = pk)

        serializer = PostSerializer(post)

        return Response({"post": serializer.data}, status=status.HTTP_200_OK)

class GetAuthorsPosts(APIView):
    '''
    Get posts that the specific author has posted in the database
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)


    @swagger_auto_schema(operation_description="Get all posts from a specific author",
                    operation_summary="Get All Author's Posts",
                    responses={200: PostSerializer()},
                    tags=['Post'],)

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

class GetUsers(APIView):
    """Returns a list of users, given query"""
    # no authentication needed
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request):
        query = request.GET.get('query')
        users = AppAuthor.objects.filter(username__icontains = query)
        serializer = AuthorSerializer(users, many = True)
        return Response({"Users": serializer.data}, status=status.HTTP_200_OK)
    
class GetFeedPostsByUsername(APIView):
    '''
    Get all posts made by a specific author
    '''
    permission_classes = (permissions.AllowAny,)
    # no authentication needed
    authentication_classes = ()
    
    @swagger_auto_schema(operation_description="Get all posts made by a specific author",
                            operation_summary="Get posts",
                            responses={200: PostSerializer()},
                            tags=['Post'],)
    
    
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
    authentication_classes = (SessionAuthentication,)
        

    @swagger_auto_schema(operation_description="Get posts that should show up in a author's feed",
                operation_summary="Get posts",
                responses={200: PostSerializer()},
                tags=['Post'],)

    def get(self, request, pk):
        posts = Post.objects.filter(author_id = request.user.user_id).exclude(unlisted = True) # Find posts that the specific author has posted

        friends = Friends.objects.filter(author = request.user.user_id) # Friends of author
        for friend in friends:
            # print(friend.friend.user_id)

            posts = posts | Post.objects.filter(author_id = friend.friend.user_id).exclude(unlisted = True) # Add posts from each friend
        # print("Friends", friends)
        # print("Posts", posts)
        serializer = PostSerializer(posts, many = True)
        return Response({"Posts": serializer.data}, status=status.HTTP_200_OK)


class PostViews(APIView):
    # permission_classes = (permissions.AllowAny,)
    # authentication_classes = ()    

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Create a post for a specific author",
                operation_summary="Create Author Post",
                responses={201: PostSerializer()},
                tags=['Post'],)

    def post(self, request): # Create a post
        # print(request.data['post_id'])
        # author = AppAuthor.objects.get(user_id = request.user.user_id)
        # print(author.display_name)
        # authorSerializer = AuthorSerializer(author)
        # print(authorSerializer)
        # print(request)
        # print(request.data)
        print(request.data['image_file'])

        picture = request.data['image_file']

        if (picture != "null"):
            image = ImageFile(io.BytesIO(picture.file.read()), name = picture.name)
            request.data['image_file'] = image
            request.data['image_url'] = ''
            serializer = PostSerializer(data = request.data)
        else:
            new_request_data = request.data.copy()
            new_request_data['image_file'] = ''
            serializer = PostSerializer(data = new_request_data)


        serializer.is_valid()
        print(serializer)
        print(serializer.errors)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        post_id = uuid.UUID(pk)

        post = Post.objects.filter(post_id = post_id)

        if post:
            post.delete()
            return Response({"message": "Post Model Successfully Deleted"}, status=status.HTTP_200_OK)
        
        return Response({"Message": "Post Model Does Not Exist"}, status=status.HTTP_404_NOT_FOUND)

class EditPost(APIView): # Have to pass the post_id on the content body from the front-end

    # permission_classes = (permissions.AllowAny,)
    # authentication_classes = ()

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    @swagger_auto_schema(operation_description="Edit Post of an Author",
                operation_summary="Edit post",
                responses={200: PostSerializer()},
                tags=['Post'],)

    def post(self, request, pk):
        post_id = uuid.UUID(pk)

        post = Post.objects.get(post_id = post_id)
        
        print(request.data)

        serializer = PostSerializer(post, data = request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"message": "Post successfully updated"}, status=status.HTTP_200_OK)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
    

class PostComments(APIView):
    '''
    All comments of a post
    '''
    # permission_classes = (permissions.AllowAny,)
    # authentication_classes = ()

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    @swagger_auto_schema(operation_description="Get all comments of a post",
                            operation_summary="Get comments",
                            responses={200: CommentSerializer()},
                            tags=['Post'],)

    def get(self, request, pk):
        post_id = uuid.UUID(pk)
        comments = Comment.objects.filter(post_id = post_id)
        serializer = CommentSerializer(comments, many = True)
        
        return Response({"Comments": serializer.data}, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(operation_description="Create comments for a specific post",
                        operation_summary="Create comment",
                        responses={201: CommentSerializer()},
                        tags=['Post'],)
    
    def post(self, request, pk):
        post_id = uuid.UUID(pk)

        request.data['post'] = post_id

        post_data = Post.objects.get(post_id = post_id)
        
        post_author = post_data.author

        notification_author = AppAuthor.objects.get(user_id = request.data['author'])

        if (post_author.user_id != notification_author.user_id):
            notification = {'author':post_author.user_id, 'notification_author':notification_author.user_id, 
                            'notif_author_pfp': "http://127.0.0.1:8000/media/" + str(notification_author.profile_picture),
                            'notif_author_username':notification_author.username, 'message':'Commented on your post', 'is_follow_notification': False} # Swap to heroku link later for pfp
           
            notification_serializer = NotificationsSerializer(data = notification)

            if (notification_serializer.is_valid(raise_exception=True)):
                notification_serializer.save()

        serializer = CommentSerializer(data = request.data)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({"Message" : "Comment & Notification Model Created"}, status=status.HTTP_201_CREATED)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
        

    @swagger_auto_schema(operation_description="Delete comment for a specific post",
                    operation_summary="delete comments",
                    responses={200: CommentSerializer()},
                    tags=['Post'],)
        
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
    authentication_classes = (SessionAuthentication,)

        
    @swagger_auto_schema(operation_description="Get likes of a specific post",
                            operation_summary="post likes",
                            responses={200: LikeSerializer()},
                            tags=['Post'],)

    def get(self, request, pk): # Get all likes
        post_id = uuid.UUID(pk) # pk needs to be post ID not author

        likes = PostLike.objects.filter(post_object_id = post_id)
    
        serializer = LikeSerializer(likes, many = True)
  
        return Response ({"Post Likes": serializer.data}, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(operation_description="Creates likes of a specific post",
                        operation_summary="create post likes",
                        responses={201: LikeSerializer()},
                        tags=['Post'],)
    
    def post(self, request, pk): # For liking a post
        post_object_id = uuid.UUID(pk)

        post = Post.objects.filter(post_id = post_object_id).update(likes_count = request.data['like_count'])

        post_data = Post.objects.get(post_id = post_object_id)
        
        post_author = post_data.author
        
        notification_author = AppAuthor.objects.get(user_id = request.data['author']['user']['user_id'])

        if (post_author.user_id != notification_author.user_id):
            notification = {'author':post_author.user_id, 'notification_author':notification_author.user_id, 
                            'notif_author_pfp': "http://127.0.0.1:8000/media/" + str(notification_author.profile_picture),
                            'notif_author_username':notification_author.username, 'message':'Liked your post', 'is_follow_notification': False} # Swap to heroku link later for pfp
            notification_serializer = NotificationsSerializer(data = notification)

            if (notification_serializer.is_valid(raise_exception=True)):
                notification_serializer.save()

        like_data = {"author":request.data['author']['user']['user_id'], "post_object":post_object_id}

        serializer = LikeSerializer(data = like_data)

        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response({"message" : "Like & Notification Model Successfully Created"}, status=status.HTTP_201_CREATED)
        
        return Response(status = status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(operation_description="delete a like of a specific post",
                        operation_summary="delete post like",
                        responses={200: LikeSerializer()},
                        tags=['Post'])

    def delete(self, request, pk): # For unliking a post
        post_id = uuid.UUID(pk)
        author_id = request.user.user_id

        post_liked = PostLike.objects.filter(author_id = author_id).filter(post_object_id = post_id)

        post = Post.objects.filter(post_id = post_id).update(likes_count = request.data['like_count'])

        if post_liked:
            post_liked.delete()
            return Response({"message": "Like Model Successfully Deleted"}, status=status.HTTP_200_OK)
        
        return Response({"message": "Like Model Does Not Exist"}, status=status.HTTP_404_NOT_FOUND)

class LikedRemote(APIView):
    '''
    All likes of a given author
    URL: ://service/authors/{AUTHOR_ID}/liked
    '''
    # permission_classes = (permissions.AllowAny,)
    
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (BasicAuthentication,)

    @swagger_auto_schema(operation_description="Get All likes of a given author",
                    operation_summary="Get All likes of a given author",
                    responses={200: LikeSerializerRemote()},
                    tags=['Remote'],)

    def get(self, request, author):

        auth_id = uuid.UUID(author)

        likes = PostLike.objects.filter(author = auth_id)

        serializer = LikeSerializerRemote(likes, many = True)

        if likes:

            return Response (serializer.data, status=status.HTTP_200_OK)
        
        return Response({"message": "Likes do not exist"}, status=status.HTTP_404_NOT_FOUND)

    
class GetLikesOnPostRemote(APIView):
    '''
    Get likes on AUTHOR_ID's post POST_ID
    URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}/likes
    '''
    # permission_classes = (permissions.AllowAny,)
    
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (BasicAuthentication,)

    @swagger_auto_schema(operation_description="Get likes on AUTHOR_ID's post POST_ID",
                operation_summary="Get likes on AUTHOR_ID's post POST_ID",
                responses={200: LikeSerializerRemote()},
                tags=['Remote'],)

    def get(self, request, author, post):

        auth_id = uuid.UUID(author)
        
        post_id = uuid.UUID(post)

        likes = PostLike.objects.filter(author = auth_id).filter(post_object = post_id)

        serializer = LikeSerializerRemote(likes, many = True)

        if likes:

            return Response (serializer.data, status=status.HTTP_200_OK)
        
        return Response({"message": "Likes do not exist"}, status=status.HTTP_404_NOT_FOUND)

    

class CommentsRemote(APIView):
    '''
    Get comments on AUTHOR_ID's post POST_ID
    URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}/comments
    '''
    # permission_classes = (permissions.AllowAny,)
    
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (BasicAuthentication,)

    
    @swagger_auto_schema(operation_description="Get comments on AUTHOR_ID's post POST_ID",
                operation_summary="Get comments on AUTHOR_ID's post POST_ID",
                responses={200: CommentSerializerRemote()},
                tags=['Remote'],)

    def get(self, request, author, post):
        
        auth_id = uuid.UUID(author)
        
        post_id = uuid.UUID(post)

        comments = Comment.objects.filter(author_id = auth_id).filter(post_id = post_id)

        print(comments[0])

        serializer = CommentSerializerRemote(comments, many = True)

        if comments:

            return Response (serializer.data, status=status.HTTP_200_OK)
        
        return Response({"message": "Comments do not exist"}, status=status.HTTP_404_NOT_FOUND)

    
class PostRemote(APIView):
    '''
    Get the public post whose id is POST_ID
    URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}
    '''
    # permission_classes = (permissions.AllowAny,)

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (BasicAuthentication,)

    @swagger_auto_schema(operation_description="Get the public post whose id is POST_ID",
                operation_summary="Get the public post whose id is POST_ID",
                responses={200: PostSerializerRemote()},
                tags=['Remote'],)

    def get(self, request, author, post):
        
        auth_id = uuid.UUID(author)
        
        post_id = uuid.UUID(post)

        post = Post.objects.filter(author_id = auth_id).filter(post_id = post_id)

        serializer = PostSerializerRemote(post, many = True)

        if post:

            return Response (serializer.data, status=status.HTTP_200_OK)
        
        return Response({"message": "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
class AuthorPostsRemote(APIView):
    '''
    Get the public posts created by author (paginated)
    URL ://service/authors/{AUTHOR_ID}/posts/
    '''
    # permission_classes = (permissions.AllowAny,)

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (BasicAuthentication,)

    @swagger_auto_schema(operation_description="Get the public posts created by author (paginated)",
                operation_summary="Get the public posts created by author (paginated)",
                responses={200: PostSerializerRemote()},
                tags=['Remote'],)
    
    def get(self, request, author):
        
        auth_id = uuid.UUID(author)

        posts = Post.objects.filter(author_id = auth_id)

        #posts = Post.objects.filter(author = auth_id).order_by('date_time')

        #Extract num from query 
        # page = Paginator(posts, num)

        serializer = PostSerializerRemote(posts, many = True)

        if posts:

            return Response (serializer.data, status=status.HTTP_200_OK)
        
        return Response({"message": "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
class ImagesRemote(APIView):
    '''
    Image Posts are just posts that are images. But they are encoded as base64 data. 
    You can inline an image post using a data url or you can use this shortcut to get the image if authenticated to see it.
    URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}/image
    GET [local, remote] get the public post converted to binary as an iamge
    return 404 if not an image
    '''
    @swagger_auto_schema(operation_description="Get the image of a post of an author if it exists",
            operation_summary="Get the image of a post of an author if it exists",
            responses={200: PostSerializerRemote()},
            tags=['Remote'],)

    def get(self, request, author, post):
        auth_id = uuid.UUID(author)
        
        post_id = uuid.UUID(post)

        post = Post.objects.filter(author_id = auth_id).filter(post_id = post_id)[0]

        image = None # If its None still then it means that its an imageless post
        if (post.image_file != ''):
            image = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" + str(post.image_file)
        elif (post.image_url != ''):
            image = post.image_url
        
        if (post and image != None):
            return Response (image, status = status.HTTP_200_OK)

        return Response ({"Message": "Post/Image does not exist"}, status=status.HTTP_404_NOT_FOUND)
