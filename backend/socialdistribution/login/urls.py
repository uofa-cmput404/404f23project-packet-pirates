from django.urls import path
from . import views



urlpatterns = [
    path('random_song/', views.get_random_song, name='get_random_song'),
]

urlpatterns = [
    path('authors/', views.AuthorView.as_view(), name='authors'),
]