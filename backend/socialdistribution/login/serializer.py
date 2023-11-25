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
        author_obj.github = validated_data['github']
        author_obj.display_name = validated_data['display_name']
        author_obj.profile_picture = validated_data['profile_picture']
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
        fields = ("user_id", "username", "first_name", "last_name", "display_name", "profile_picture") # Add more fields to display when logged in

class SimpleAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorModel
        fields = ("user_id", "username", "profile_picture")

class AuthorSerializerRemote(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    profileImage = serializers.SerializerMethodField()

    displayName = serializers.CharField(source = "username")
    
    def get_type(self ,instance):
        return 'author'
    
    def get_id(self, instance):
        return ''
    
    def get_profileImage(self, instance):
        return ''
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        print(representation)
        print(instance)
        representation['id'] = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + str(instance.user_id)

        representation['host'] = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/"

        representation['url'] = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + str(instance.user_id)

        # representation['displayName'] = representation['username']

        representation['profileImage'] = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/media/" + str(instance.profile_picture)
        
        return representation
       
    class Meta:
        model = AuthorModel
        fields = ("type", "id", "url", "host", "displayName", "github", "profileImage")
