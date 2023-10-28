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




# class AuthorView(APIView):
#     def get(self, request):
#         output = [{"username": output.username, 
#                    "first_name": output.first_name,
#                    "last_name": output.last_name,
#                    "date_of_birth": output.date_of_birth,
#                    "github": output.github,
#                    "profile_picture": output.profile_picture,
#                    "url": output.url,
#                    "is_active": output.is_active}
#                    for output in Author.objects.all()]
#         return Response(output)

#     def post(self, request):
#         serializer = AuthorSerializer(data = request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)

class AuthorRegistration(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        print(request.data)
        validated_data = custom_validation(request.data)
        serializer = AuthorRegisterSerializer(data=validated_data)
        if serializer.is_valid(raise_exception=True):
            author = serializer.create(validated_data)
            if author:
                return Response(serializer.data, {'message': 'account has been created'}, status=status.HTTP_201_CREATED)
            
        return Response(status = status.HTTP_400_BAD_REQUEST)

class AuthorLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    # authentication_classes = (SessionAuthentication,)

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

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            pass
        
        logout(request)
        return Response({'Message': 'You have successfully logged out'},status = status.HTTP_200_OK)

# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# @login_required(login_url="")
class AuthorView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    # authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = AuthorSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class GetSingleAuthor(APIView):
    '''
    Get one single author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, pk):
        author = AppAuthor.objects.get(author_id = pk) # Find posts that the specific author has posted
        # posts = Post.objects.all()
        serializer = AuthorSerializer(author)
        return Response({"Author": serializer.data}, status=status.HTTP_200_OK)

