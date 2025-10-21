from rest_framework.serializers import ModelSerializer, CharField, ValidationError
from .models import (Role, User)


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ['id','name']


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'full_name', 'institution', 'semester', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class RegisterSerializer(ModelSerializer):
    password = CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name', 'institution', 'semester', 'role']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(ModelSerializer):
    username = CharField()
    password = CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password']
    