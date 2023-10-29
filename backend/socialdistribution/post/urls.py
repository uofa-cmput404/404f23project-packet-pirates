from django.urls import path
from . import views

app_name = "post"
urlpatterns = [
    path("author/<str:pk>/authorposts", views.GetAuthorsPosts.as_view(), name = "get_author_post"),
    path("author/<str:pk>/feedposts", views.GetFeedPosts.as_view(), name = "get_feed_posts"),
    path("author/<str:pk>/feedposts_byusername", views.GetFeedPostsByUsername.as_view(), name = "get_feed_posts_by_username"),
    path("test", views.test.as_view(), name = "test"),
    
    path("author/<str:pk>/postcomments", views.PostComments.as_view(), name = "get_comments_post"),
    path("author/<str:pk>/postlikes", views.PostLikeViews.as_view(), name = "get_likes_post"),
    path('author/<str:pk>/editpost', views.EditPost.as_view(), name="editpost"),
    # path("author/<str:pk>/postlikes", views.getPostLike.as_view(), name = "get_likes_post"),
    path('createpost', views.CreatePost.as_view(), name="createpost"),
    # path("user/", views.GetPost.as_view(), name = "get_post")
    path('api/posts/<str:pk>/editpost', views.EditPost.as_view(), name='edit_post'),
]