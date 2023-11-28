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
    path('postViews', views.PostViews.as_view(), name="createpost"),
    path('<str:pk>/postViews', views.DeletePost.as_view(), name="createpost"),


    # path("user/", views.GetPost.as_view(), name = "get_post")
    path('<str:pk>/viewpost', views.ViewPostByID.as_view(), name = "View_post"), # For testing purposes, delete later
    path('api/posts/<str:pk>/editpost', views.EditPost.as_view(), name='edit_post'),
    path('profileposts', views.ProfilePosts.as_view(), name='profile_posts'),


    #REMOTE URLS
    path('authors/<str:author>/liked', views.LikedRemote.as_view(), name = 'liked_remote'),
    path('authors/<str:author>/posts/<str:post>/likes', views.GetLikesOnPostRemote.as_view(), name = 'likes_remote'),
    path('authors/<str:author>/posts/<str:post>/comments', views.CommentsRemote.as_view(), name = 'comments_remote'),
    path('authors/<str:author>/posts/<str:post>/comments/<str:comment>', views.PostCommentRemote.as_view(), name = 'comments_remote'),
    path('authors/<str:author>/posts/<str:post>/image', views.ImagesRemote.as_view(), name = 'images_remote'),
    path('authors/<str:author>/posts/<str:post>', views.PostRemote.as_view(), name = 'post_remote'),
    path('authors/<str:author>/posts', views.AuthorPostsRemote.as_view(), name = 'author_posts_remote'),


]