from .serializer import AuthorSerializer
from .models import Author
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

def get_random_song(request):
    songs = [
        {
            "title": "Hunch Gray",
            "artist": "ZUTOMAYO",
            "url": "https://youtu.be/ugpywe34_30",
        },
        {
            "title": "Hunch Gray",
            "artist": "ZUTOMAYO1",
            "url": "https://youtu.be/ugpywe34_30",
        }
    ]
    
    return JsonResponse(songs, safe=False)
    


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
