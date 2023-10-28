from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

AuthorModel = get_user_model()

class AuthorRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorModel
        fields = "__all__"

    def create(self, validated_data):
        print(validated_data["username"])
        print(validated_data['password'])
        print("VALIDATED", validated_data)
        author_obj = AuthorModel.objects.create_user(username = validated_data['username'],
                                                     password = validated_data['password'])
        
        
        # Add more fields that you want to be required in the POST request.
        # author_obj.first_name = validated_data['first_name']
        # author_obj.last_name = validated_data['last_name']
        # author_obj.date_of_birth = validated_data['date_of_birth' ]
        # author_obj.github = validated_data['github']
        # author_obj.display_name = validated_data['display_name']
        print("PIC", author_obj.profile_picture)
        author_obj.save()
        return author_obj

class AuthorLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField() 

    def validate_user(self, validated_data):

        author = authenticate(username=validated_data['username'], password = validated_data['password'])

        if not author:
            raise ValidationError("User Not Found")
        
        return author
    

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorModel
        fields = ("user_id", "username", "first_name", "last_name", "display_name") # Add more fields to display when logged in

# class AuthorSerializer(models.Model):
#     class Meta:
#         model = Author
#         fields = ['username', 'display_name', 'first_name', 'last_name', 'date_of_birth', 'github', 'profile_picture', 'url', 'is_active']

