from django.urls import path
from . import views

urlpatterns = [
    # path('authors/', views.AuthorView.as_view(), name='authors'),
    path('register', views.AuthorRegistration.as_view(), name="register"),
    path('login', views.AuthorLogin.as_view(), name = "login"),
    path('logout', views.AuthorLogout.as_view(), name = "logout"),
    path('author', views.AuthorView.as_view(), name = "author"),
    path('author/<str:pk>/singleauthor', views.GetSingleAuthor.as_view(), name = "single_author"),
    path('author/<str:pk>/simpleauthor', views.GetSimpleAuthor.as_view(), name = "simple_author"),
    path('author/<str:pk>/username', views.GetSingleAuthorByUsername.as_view(), name = "get_author_by_username_in_path"),
    # path('author/username', views.GetSingleAuthorByUsername.as_view(), name = "get_author_by_username"),


    # Remote URLS
    path('authors', views.getAllAuthorsRemote.as_view(), name = "All Authors Remote"),
    path('authors/<str:author_id>', views.getSingleAuthorRemote.as_view(), name = "All Authors Remote")
]