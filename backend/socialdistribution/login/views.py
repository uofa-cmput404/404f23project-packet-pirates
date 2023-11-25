from .serializer import AuthorSerializer
# from .models import Author

from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import authentication_classes, permission_classes

from .validate import *
from .serializer import *


from feed.serializer import InboxSerializer

from django.core.files.uploadedfile import InMemoryUploadedFile, UploadedFile
from django.core.files.base import ContentFile
from django.core.files.storage import DefaultStorage, FileSystemStorage
from django.core.files import File
from django.core.files.images import ImageFile
from django.conf import settings

from urllib.request import urlopen
import io
from PIL import Image

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class AuthorRegistration(APIView):
    permission_classes = (permissions.AllowAny,)
    
    @swagger_auto_schema(operation_description="Registers an author", 
                         operation_summary="Register", 
                         responses={201: AuthorSerializer()}, 
                         tags=['Login'])
    
    def post(self, request):
        picture = request.data['profile_picture']

        image = ImageFile(io.BytesIO(picture.file.read()), name = picture.name)
        request.data['profile_picture'] = image
 
        validated_data = custom_validation(request.data)
        serializer = AuthorRegisterSerializer(data=validated_data)

        if serializer.is_valid(raise_exception=True):
            author = serializer.create(validated_data)

            inbox_data = {'author': author.user_id}
            
            inbox_serializer = InboxSerializer(data = inbox_data)

            if (inbox_serializer.is_valid(raise_exception=True)):
                inbox_serializer.save()

                if author:
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(status = status.HTTP_400_BAD_REQUEST)

class AuthorLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)
    
    @swagger_auto_schema(operation_description="Log in an author using their credentials", operation_summary="Login", responses={200: AuthorSerializer()}, tags=['Login'], manual_parameters=[])

    def post(self, request):
        data = request.data
        assert validate_username(data)
        assert validate_password(data)
        serializer = AuthorLoginSerializer(data = data)

        
        if serializer.is_valid(raise_exception=True):
            author = serializer.validate_user(data)
            token, created = Token.objects.get_or_create(user = author)
            login(request, author)
            return Response({
                'token': token.key,
                "User": serializer.data},
                             status=status.HTTP_200_OK)

class AuthorLogout(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    
    @swagger_auto_schema(
        operation_description="Logs out an author", 
        operation_summary="Logout", 
        responses={200: "OK"}, 
        tags=['Login'], 
            manual_parameters=[])
    
    def get(self, request):
        try:
            request.user.auth_token.delete()
            # print(request)
            return Response({'Message': 'You have successfully logged out'}, status=status.HTTP_200_OK)
        
        except (AttributeError, ObjectDoesNotExist):
            return Response({"Error"}, status=status.HTTP_404_NOT_FOUND)

    # def get(self, request):
    #     logout(request)
    #     return Response({'Message': 'You have successfully logged out'},status = status.HTTP_200_OK)


class AuthorView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    # authentication_classes = (SessionAuthentication,)

    @swagger_auto_schema(operation_description="Get all authors", operation_summary="Get all authors", responses={200: AuthorSerializer(many=True)}, tags=['Login'], manual_parameters=[])

    def get(self, request):
        serializer = AuthorSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK) # CHANGE LATER NO MORE JSON, REMOVE
        # return Response(serializer.data, status=status.HTTP_200_OK) # TO THIS


class GetSingleAuthor(APIView):
    '''
    Get one single author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    
    @swagger_auto_schema(operation_description="Get one single author",
            operation_summary="This endpoint returns the username, user_id, first_name, last_name, and display_name of an author.",
            responses={200: AuthorSerializer()},
            tags=['Login'],
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
        author = AppAuthor.objects.get(user_id = pk) # Find posts that the specific author has posted
        # posts = Post.objects.all()
        serializer = AuthorSerializer(author)
        return Response({"Author": serializer.data}, status=status.HTTP_200_OK)

class GetSimpleAuthor(APIView):
    # given author id, gets author username and profile picture
    permission_classes = (permissions.AllowAny,)
    # no authentication needed
    authentication_classes = ()
    
    @swagger_auto_schema(
        operation_description="Get simple author", 
        operation_summary="This endpoint returns the username and profile picture of an author.", 
        responses={200: SimpleAuthorSerializer()}, 
        tags=['Login'])
    
    def get(self, request, pk):
        author = AppAuthor.objects.get(user_id = pk)
        serializer = SimpleAuthorSerializer(author)
        return Response({"Author": serializer.data}, status=status.HTTP_200_OK)

class GetSingleAuthorByUsername(APIView):
    '''
    Get one single author by their username
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    @swagger_auto_schema(operation_description="Get one single author by their username",
            operation_summary="This endpoint returns the username, user_id, first_name, last_name, and display_name of an author.",
            responses={200: AuthorSerializer()},
            tags=['Login'],
            manual_parameters=[
                openapi.Parameter(
                    name='pk',
                    in_=openapi.IN_PATH,
                    type=openapi.TYPE_STRING,
                    description='Author username',
                    required=True,
                    enum=[]
                )
            ])


    def get(self, request, pk):
        author = AppAuthor.objects.get(username = pk) # Find posts that the specific author has posted
        # posts = Post.objects.all()
        serializer = AuthorSerializer(author)
        return Response({"Author": serializer.data}, status=status.HTTP_200_OK)