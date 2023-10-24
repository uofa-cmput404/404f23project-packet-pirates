from django.urls import path
from . import views

app_name = "post"
urlpatterns = [
    path("author/<str:pk>/post", views.GetPost.as_view(), name = "get_post")
    # path("user/", views.GetPost.as_view(), name = "get_post")
]