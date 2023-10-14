from django.db import models

# Create your models here.
class Author(models.Model):

    username = models.CharField(max_length=40)
    display_name = models.CharField(max_length=40)

    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)

    date_of_birth = models.DateField()

    github = models.CharField(max_length=50)

    profile_picture = models.CharField(max_length=50)

    url = models.CharField(max_length=50)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username

