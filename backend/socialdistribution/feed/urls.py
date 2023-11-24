from django.urls import path
from . import views

urlpatterns = [
    path("author/<str:pk>/authornotifications", views.GetAllNotifications.as_view(), name = "get_notifications"),
    path("author/<str:pk>/allauthorfriends", views.GetAllAuthorFriends.as_view(), name = "get_all_friends"),
    path("author/<str:pk>/authorfollowing", views.GetAuthorFollowing.as_view(), name = "get_all_following"),
    path("author/<str:pk>/authorfollowers", views.GetAuthorFollowers.as_view(), name = "get_all_followers"),
    path("author/<str:pk>/truefriends", views.GetTrueFriends.as_view(), name = "get_true_friends"),
    path("<str:pk>/createnotif", views.NotificationViews.as_view(), name = "create_notification"),
    path("author/search", views.GetUsers.as_view(), name = "search_author"),
    path("author/getall", views.GetAllUsers.as_view(), name = "search_author"),

    # path("author/<str:pk>/friendrequest")
    # path('register', views.AuthorRegistration.as_view(), name="register"),
    # path('login', views.AuthorLogin.as_view(), name = "login"),
    # path('logout', views.AuthorLogout.as_view(), name = "logout"),
    # path('author', views.AuthorView.as_view(), name = "author"),
    
    path("author/<str:pk>/inbox", views.InboxViews.as_view(), name ='Inbox')
]