from django.db import models
# from markdownfield.models import MarkdownField, RenderedMarkdownField
from login.models import AppAuthor
import uuid

# Create your models here.
class Post(models.Model):

    post_id = models.UUIDField(default = uuid.uuid4, primary_key = True, unique= True)

    # author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE)
    author = models.CharField(max_length=200, blank=True)

    author_origin = models.CharField(max_length = 200, blank = True)

    title = models.CharField(max_length=50)

    is_private = models.BooleanField(default=False)

    is_friends = models.BooleanField(default = False)

    url = models.CharField(max_length=200, blank = True, null= True)

    likes_count = models.IntegerField(default=0)

    #Typing needed (image, md, text)
    content_types = [('text/plain', 'plaintext'), ('text/markdown', 'markdown')]
    
    content_type = models.CharField(max_length=200,choices=content_types, default=content_types[0])

    content = models.CharField(max_length=200, blank=True) # Change to textField later

    source = models.CharField(max_length=200, blank = True, null= True) # ?

    origin = models.CharField(max_length=200, blank = True, null= True)

    date_time = models.DateTimeField(auto_now_add=True, null = True, blank = True)

    image_file = models.ImageField(null=True, blank=True, upload_to="images/")

    image_url = models.CharField(max_length=200, null=True, blank=True)

    unlisted = models.BooleanField(default=False)


class Comment(models.Model):

    comment_id = models.UUIDField(default = uuid.uuid4, primary_key=True, unique = True)

    post = models.ForeignKey(Post, on_delete = models.CASCADE)

    # author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE)
    author = models.CharField(max_length=200, blank=True)

    author_picture = models.URLField(max_length=200, null=True, blank=True)

    author_username = models.CharField(max_length=200, null=True, blank=True)

    author_origin = models.CharField(max_length = 200, blank = True)

    text = models.TextField(max_length=256)

    date_time = models.DateTimeField(auto_now_add=True, null = True, blank = True)

class PostLike(models.Model): # Assume front-end restricts like
    like_id = models.UUIDField(default = uuid.uuid4, primary_key=True, unique=True)

    # author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE)
    author = models.CharField(max_length=200, blank=True) # Author who liked our post

    author_origin = models.CharField(max_length = 200, blank = True)

    post_object = models.ForeignKey(Post, on_delete=models.CASCADE)