from django.db import models
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin


class AppAuthorManager(BaseUserManager):
    def create_user(self, username, password = None):
        if not username:
            raise ValueError("An username is required.")
        if not password:
            raise ValueError("A password is required.")
        
        user = self.model(username = username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password = None):
        if not username:
            raise ValueError("An username is required.")
        if not password:
            raise ValueError("A password is required.")
        
        user = self.create_user(username, password)
        user.is_superuser = True
        user.save()
        return user


class AppAuthor(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key =True)
    username = models.CharField(max_length=40, unique=True, default="Temporary")
    display_name = models.CharField(max_length=40)

    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)

    date_of_birth = models.DateField(blank=True, null=True)

    github = models.CharField(max_length=50, blank=True)

    profile_picture = models.CharField(max_length=50, blank=True)

    url = models.CharField(max_length=50, blank=True)

    is_active = models.BooleanField(default=True)

    is_staff = True

    USERNAME_FIELD = 'username'
    # REQUIRED_FIELDS = ["username"]

    objects = AppAuthorManager()

    def __str__(self):
        return self.username

# # Create your models here.
# class Author(models.Model):

#     username = models.CharField(max_length=40)
#     display_name = models.CharField(max_length=40)

#     first_name = models.CharField(max_length=20)
#     last_name = models.CharField(max_length=20)

#     date_of_birth = models.DateField()

#     github = models.CharField(max_length=50)

#     profile_picture = models.CharField(max_length=50)

#     url = models.CharField(max_length=50)

#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return self.username

