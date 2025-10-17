from rest_framework.serializers import ModelSerializer
from .models import (Role, User)


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ['id','name']


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'full_name', 'institution', 'semester', 'role']
    