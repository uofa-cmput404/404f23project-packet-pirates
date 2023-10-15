from django.shortcuts import render
from django.http import JsonResponse


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
    