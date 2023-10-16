from django.urls import path
from . import views

urlpatterns = [
    path('authors/', views.AuthorView.as_view(), name='authors'),
]