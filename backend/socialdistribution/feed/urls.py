from django.urls import path
from . import views

urlpatterns = [
    path("author/<str:pk>/authornotifications", views.GetAllNotifications.as_view(), name = "get_notifications"),
    path("author/<str:pk>/authorfriends", views.GetAuthorFriends.as_view(), name = "get_friends"),
    # path('register', views.AuthorRegistration.as_view(), name="register"),
    # path('login', views.AuthorLogin.as_view(), name = "login"),
    # path('logout', views.AuthorLogout.as_view(), name = "logout"),
    # path('author', views.AuthorView.as_view(), name = "author"),
]