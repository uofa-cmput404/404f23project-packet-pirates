from django.db import models
import uuid
from login.models import AppAuthor
from post.models import Post, Comment, PostLike
# Create your models here.


class FollowerRequest(models.Model):
    sender = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="follow_requester")
    recipient = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="follow_receiver")

class Friends(models.Model):
    # Check if author and friend both follow each other => True friend
    # If friendship one way => Friend
    # Did one model because Friend => Still need both author and friend

    author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name= "authors") # Overwrites query_set name. so query by using AppAuthor.objects.get(uuid).authors.all()
    friend = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name= "authors_friends")

class Notifications(models.Model):
    # Need two authors
    # Also need FollowRequests
    # Posts, Likes, Comments
    author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="main_author") # Main user

    notification_author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE, related_name="notifier") # Person who likes/comments

    messages = [('liked your post', 'liked'), ('commented on your post', 'commented')]
    message = models.CharField(max_length=200,choices=messages)

    url = models.URLField(max_length = 300, null=True, blank=True) # URL of post

    # # Set symmetrical to false since we don't want it to work both ways. 
    # posts_liked = models.ManyToManyField(Post, symmetrical=False, blank = True)
    # post_comments = models.ManyToManyField(Comment, symmetrical=False, blank = True)
    # likes = models.ManyToManyField(PostLike, symmetrical=False, blank = True)
    # friend_requests = models.ManyToManyField(FollowerRequest, symmetrical=False, blank = True)



