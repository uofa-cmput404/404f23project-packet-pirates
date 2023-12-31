from django.urls import path
from . import views

urlpatterns = [
    path("author/<str:pk>/authornotifications", views.GetAllNotifications.as_view(), name = "get_notifications"),
    path("author/<str:pk>/allauthorfriends", views.GetAllAuthorFriends.as_view(), name = "get_all_friends"),
    path("author/<str:pk>/authorfollowing", views.GetAuthorFollowing.as_view(), name = "get_all_following"),
    path("author/<str:pk>/authorfollowers", views.GetAuthorFollowers.as_view(), name = "get_all_followers"),
    path("author/<str:pk>/truefriends", views.GetTrueFriends.as_view(), name = "get_true_friends"),
    path("<str:pk>/createnotif", views.NotificationViews.as_view(), name = "create_notification"),
    path("<str:pk>/deletenotifs", views.DeleteAllNotifications.as_view(), name = "delete_notifications"),
    path("author/search", views.GetUsers.as_view(), name = "search_author"),
    path("author/getall", views.GetAllUsers.as_view(), name = "search_author"),
    path("<str:pk>/followrequest", views.FollowRequestViews.as_view(), name = "follow_request"),
    path("<str:pk>/friends", views.FriendsViews.as_view(), name = "create_friend"),
    path("<str:sender>/followrequest/<str:recipient>/ispending", views.FollowRequestPending.as_view(), name = "follow_request_pending"),
    path("<str:author>/unfriend/<str:friend>", views.FriendsDelete.as_view(), name = "unfriend"),
    path("authors/<str:author_id>/followers/<str:foreign_author_id>/local", views.FollowersLocal.as_view(), name ="Get Authors Followers Local"),

    
    path("author/<str:pk>/inbox/local", views.InboxViews.as_view(), name ='Inbox'),

    # REMOTE URLS
    path("authors/<str:author_id>/followers", views.GetAuthorsFollowersRemote.as_view(), name ="Get Authors Followers Remote"),
    path("authors/<str:author_id>/followers/<str:foreign_author_id>", views.FollowersRemote.as_view(), name ="Boolean Authors Followers Remote"),
    path("authors/<str:author_id>/inbox", views.InboxViewsRemote.as_view(), name ='Inbox Remote'),


]