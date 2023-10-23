from django.db import models
from markdownfield.models import MarkdownField, RenderedMarkdownField
from ..login.models import AppAuthor
import uuid

# Create your models here.
class Post(models.Model):

    post_id = models.UUIDField(default = uuid.uuid4, primary_key = True)

    author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE)

    title = models.CharField(max_length=50)

    is_private = models.BooleanField(default=True)

    #Typing needed (image, md, text)
    content = models.CharField(max_length=50)

    source = models.CharField(max_length=50)

    origin = models.CharField(max_length=50)

    date_time = models.DateTimeField(auto_now_add=True, null = True, blank = True)


class Comment(models.Model):

    comment_id = models.UUIDField(default = uuid.uuid4, primary_key=True)

    post = models.ForeignKey(Post, on_delete = models.CASCADE)

    author = models.ForeignKey(AppAuthor, on_delete=models.CASCADE)

    text = models.TextField(max_length=256)

    date_time = models.DateTimeField(auto_now_add=True, null = True, blank = True)