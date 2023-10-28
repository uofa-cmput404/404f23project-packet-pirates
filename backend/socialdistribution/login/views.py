from .serializer import AuthorSerializer
# from .models import Author

from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework import permissions, status
from rest_framework.exceptions import AuthenticationFailed

from .validate import *
from .serializer import *
from .models import *
import jwt, datetime
from json import JSONDecoder


class AuthorRegistration(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        validated_data = custom_validation(request.data)
        
        serializer = AuthorRegisterSerializer(data=validated_data)
        if serializer.is_valid(raise_exception=True):
            author = serializer.create(validated_data)

            if author:
                user_id = AppAuthor.objects.get(username = request.data['username']).user_id
                
                payload = {
                    'id': str(user_id),
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes = 60),
                    'iat': datetime.datetime.utcnow()
                }

                token = jwt.encode(payload, 'secret', algorithm ='HS256')

                response = Response()
                response.set_cookie(key='access_token', value=token, httponly=True)
            
                response.data = {'token': token,
                                'User': serializer.data}

                return response
            
        return Response(status = status.HTTP_400_BAD_REQUEST)

class AuthorLogin(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        # print(data)
        assert validate_username(data)
        assert validate_password(data)
        serializer = AuthorLoginSerializer(data = data)
        if serializer.is_valid(raise_exception=True):
            author = serializer.validate_user(data)
            
            serializer = AuthorSerializer(author)
            # print(serializer)
            user_id = AppAuthor.objects.get(username = data['username']).user_id

            payload = {
                'id': str(user_id),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes = 60),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, 'secret', algorithm ='HS256')

            response = Response()
            response.set_cookie(key='access_token', value=token, httponly=True)
        
            response.data = {'token': token,
                            'User': serializer.data}

            return response

class AuthorLogout(APIView):
    # permission_classes = (permissions.AllowAny,)

    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        user_token = request.COOKIES.get('access_token', None)
        if user_token:
            response = Response()
            response.delete_cookie('access_token')
            response.data = {
                'message': 'Logged out successfully.'
            }
            return response
        
        response = Response()
        response.data = {
            'message': 'User is already logged out.'
        }
        return response
          

class AuthorView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        user_token = request.COOKIES.get('access_token')

        if not user_token:
            raise AuthenticationFailed('Unauthenticated user')
        try:
            payload = jwt.decode(user_token, 'secret', algorithms=['HS256'])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        
        author = AppAuthor.objects.filter(user_id = payload['id'])
        print(author)
        serializer = AuthorSerializer(author, many = True)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class GetSingleAuthor(APIView):
    '''
    Get one single author
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        author = AppAuthor.objects.get(author_id = pk) # Find posts that the specific author has posted
        # posts = Post.objects.all()
        serializer = AuthorSerializer(author)
        return Response({"Author": serializer.data}, status=status.HTTP_200_OK)



