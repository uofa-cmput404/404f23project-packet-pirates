from django.urls import path
from . import views



urlpatterns = [
    path('random_song/', views.get_random_song, name='get_random_song'),
]

urlpatterns = [
    path('authors/', views.AuthorView.as_view(), name='authors'),
    path('register', views.AuthorRegistration.as_view(), name="register"),
    path('login', views.AuthorLogin.as_view(), name = "login"),
    path('logout', views.AuthorLogout.as_view(), name = "logout"),
    path('author', views.AuthorView.as_view(), name = "author"),
]