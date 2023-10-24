from .serializer import AuthorSerializer
# from .models import Author

from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status

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
        validated_data = custom_validation(request.data)
        serializer = AuthorRegisterSerializer(data=validated_data)
        if serializer.is_valid(raise_exception=True):
            author = serializer.create(validated_data)
            if author:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(status = status.HTTP_400_BAD_REQUEST)

class AuthorLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        assert validate_username(data)
        assert validate_password(data)
        serializer = AuthorLoginSerializer(data = data)
        if serializer.is_valid(raise_exception=True):
            author = serializer.validate_user(data)
            login(request, author)
            # session = request.session
            # print(session.cookie)
            headers = {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
                "Access-Control-Allow-Methods ": "POST",
                "Access-Control-Allow-Headers ": "Authorization",
                "Access-Control-Allow-Credentials": "true",
                # "Set-Cookie:" : f"{cookie}",
                "Content-Type": "application/json"
            }
            return Response(data = serializer.data,headers=headers, status=status.HTTP_200_OK)

class AuthorLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status = status.HTTP_200_OK)

class AuthorView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = AuthorSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

