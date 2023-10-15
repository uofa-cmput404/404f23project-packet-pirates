from .serializer import AuthorSerializer
from .models import Author
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

class AuthorView(APIView):
    def get(self, request):
        output = [{"username": output.username, 
                   "first_name": output.first_name,
                   "last_name": output.last_name,
                   "date_of_birth": output.date_of_birth,
                   "github": output.github,
                   "profile_picture": output.profile_picture,
                   "url": output.url,
                   "is_active": output.is_active}
                   for output in Author.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = AuthorSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
