from django.urls import path
from . import views

app_name = "post"
urlpatterns = [
    path("author/<str:pk>/authorposts", views.GetAuthorsPosts.as_view(), name = "get_author_post"),
    path("author/<str:pk>/feedposts", views.GetFeedPosts.as_view(), name = "get_feed_posts"),
    path('createpost', views.CreatePost.as_view(), name="createpost"),
    path('editpost', views.EditPost.as_view(), name="editpost"),
    # path("user/", views.GetPost.as_view(), name = "get_post")
]