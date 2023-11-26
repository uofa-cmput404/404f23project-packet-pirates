from django.db import models
import uuid
from login.models import AppAuthor
from post.models import Post, Comment, PostLike
# Create your models here.


class FollowerRequest(models.Model):
    # sender = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="follow_requester")
    # recipient = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="follow_receiver")

    sender = models.CharField(max_length=200, blank=True)
    recipient = models.CharField(max_length=200, blank=True)

    sender_origin = models.CharField(max_length=200, blank=True)
    recipient_origin = models.CharField(max_length=200, blank=True)

    is_pending = models.BooleanField(default=True)
    
class Friends(models.Model):
    # Check if author and friend both follow each other => True friend
    # If friendship one way => Friend
    # Did one model because Friend => Still need both author and friend

    # Author is recipient, friend is following author
    # author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name= "authors") # Overwrites query_set name. so query by using AppAuthor.objects.get(uuid).authors.all()
    # friend = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name= "authors_friends")

    author = models.CharField(max_length=200, blank=True)
    friend = models.CharField(max_length=200, blank=True)

    author_origin = models.CharField(max_length=200, blank=True)
    friend_origin = models.CharField(max_length=200, blank=True)

    friend_pfp = models.URLField(max_length= 200, null=True, blank=True)
    friend_username = models.CharField(max_length=40, blank=True)

class Notifications(models.Model):
    # Need two authors
    # Also need FollowRequests
    # Posts, Likes, Comments
    notif_id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable=False, unique=True)

    # author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="main_author") # Main user
    # notification_author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="notifier") # Person who likes/comments

    author = models.CharField(max_length=200, blank=True)
    notification_author = models.CharField(max_length=200, blank=True)

    notification_author_origin = models.CharField(max_length=200, blank=True)

    notif_author_pfp = models.URLField(max_length=300, null=True, blank=True)
    notif_author_username = models.CharField(max_length=40, blank=True)

    messages = [('Liked your post', 'liked'), ('Commented on your post', 'commented'), ("Created a new post", "posted"), ("Requested to follow you", "follow")]
    message = models.CharField(max_length=200,choices=messages)

    is_follow_notification = models.BooleanField(default = False)

    url = models.URLField(max_length = 300, null=True, blank=True) # URL of post

    # # Set symmetrical to false since we don't want it to work both ways. 
    # posts_liked = models.ManyToManyField(Post, symmetrical=False, blank = True)
    # post_comments = models.ManyToManyField(Comment, symmetrical=False, blank = True)
    # likes = models.ManyToManyField(PostLike, symmetrical=False, blank = True)
    # friend_requests = models.ManyToManyField(FollowerRequest, symmetrical=False, blank = True)

class Inbox(models.Model):
    author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE)

    notifications = models.ManyToManyField(Notifications, symmetrical=False, blank=True)

    # posts = models.ManyToManyField(Post, symmetrical=False, blank = True)
    posts = models.JSONField(blank=True, null=True)

    # post_comments = models.ManyToManyField(Comment, symmetrical=False, blank = True)
    post_comments = models.JSONField(blank=True, null=True)

    # post_likes = models.ManyToManyField(PostLike, symmetrical=False, blank = True)
    post_likes = models.JSONField(blank=True, null=True)

    # follow_requests = models.ManyToManyField(FollowerRequest, symmetrical=False, blank = True)
    follow_requests = models.JSONField(blank=True, null=True)

