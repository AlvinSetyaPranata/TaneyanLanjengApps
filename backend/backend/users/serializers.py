from rest_framework.serializers import ModelSerializer, CharField, ValidationError
from .models import (Role, User)


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ['id','name']


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'full_name', 'institution', 'semester', 'profile_photo', 'role']
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
        fields = ['username', 'email', 'password', 'full_name', 'institution', 'semester', 'profile_photo', 'role']
        extra_kwargs = {
            'semester': {'required': False, 'allow_null': True}
        }
    
    def validate(self, data):
        # Check if role is Teacher, if so, set semester to 0 or None
        role_id = data.get('role')
        if role_id:
            try:
                role = Role.objects.get(id=role_id.id if hasattr(role_id, 'id') else role_id)
                if role.name == 'Teacher':
                    # Set semester to 0 for teachers
                    data['semester'] = 0
            except Role.DoesNotExist:
                pass
        
        # Ensure semester is provided for non-teacher roles
        if 'semester' not in data or data['semester'] is None:
            if role_id:
                try:
                    role = Role.objects.get(id=role_id.id if hasattr(role_id, 'id') else role_id)
                    if role.name != 'Teacher':
                        raise ValidationError({'semester': 'Semester wajib diisi untuk peran ini'})
                except Role.DoesNotExist:
                    pass
        
        return data
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        # Set default semester to 0 if not provided
        if 'semester' not in validated_data or validated_data['semester'] is None:
            validated_data['semester'] = 0
            
        # Set default values for required boolean fields
        if 'is_active' not in validated_data:
            validated_data['is_active'] = True
        if 'is_staff' not in validated_data:
            validated_data['is_staff'] = False
            
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