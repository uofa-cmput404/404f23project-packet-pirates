from rest_framework import serializers
from .models import *

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['username', 'display_name', 'first_name', 'last_name', 'date_of_birth', 'github', 'profile_picture', 'url', 'is_active']