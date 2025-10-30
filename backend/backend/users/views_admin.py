from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User, Role
from modules.models import Module, Lesson
from .serializers import UserSerializer
from modules.serializers import ModuleSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_stats(request):
    """
    Get admin dashboard statistics
    """
    total_users = User.objects.count()
    total_teachers = User.objects.filter(role__name='Teacher').count()
    total_students = User.objects.filter(role__name='Student').count()
    total_modules = Module.objects.count()
    
    return Response({
        'success': True,
        'stats': {
            'total_users': total_users,
            'total_teachers': total_teachers,
            'total_students': total_students,
            'total_modules': total_modules
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    """
    Get all users for admin management
    """
    users = User.objects.all().select_related('role')
    serializer = UserSerializer(users, many=True)
    return Response({
        'success': True,
        'users': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_user(request):
    """
    Create a new user (teacher or student)
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    full_name = request.data.get('full_name')
    institution = request.data.get('institution')
    semester = request.data.get('semester')
    role_id = request.data.get('role')
    
    # Validate required fields
    if not all([username, email, password, full_name, institution, role_id]):
        return Response({
            'success': False,
            'message': 'All fields are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username or email already exists
    if User.objects.filter(username=username).exists():
        return Response({
            'success': False,
            'message': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({
            'success': False,
            'message': 'Email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        role = Role.objects.get(id=role_id)
        if role.name == 'Admin':
            return Response({
                'success': False,
                'message': 'Cannot create admin users through this API'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            full_name=full_name,
            institution=institution,
            semester=semester if semester else 0,
            role=role
        )
        
        serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'User created successfully',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Role.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invalid role'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user(request, user_id):
    """
    Update user information
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Prevent admin from editing other admins
        if user.role.name == 'Admin' and user.id != request.user.id:
            return Response({
                'success': False,
                'message': 'Cannot edit other admin users'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Update fields
        if 'username' in request.data:
            # Check if username already exists for another user
            if User.objects.filter(username=request.data['username']).exclude(id=user_id).exists():
                return Response({
                    'success': False,
                    'message': 'Username already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            user.username = request.data['username']
            
        if 'email' in request.data:
            # Check if email already exists for another user
            if User.objects.filter(email=request.data['email']).exclude(id=user_id).exists():
                return Response({
                    'success': False,
                    'message': 'Email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = request.data['email']
            
        if 'full_name' in request.data:
            user.full_name = request.data['full_name']
            
        if 'institution' in request.data:
            user.institution = request.data['institution']
            
        if 'semester' in request.data:
            user.semester = request.data['semester']
            
        if 'role' in request.data:
            try:
                role = Role.objects.get(id=request.data['role'])
                if role.name == 'Admin':
                    return Response({
                        'success': False,
                        'message': 'Cannot change user to admin role'
                    }, status=status.HTTP_400_BAD_REQUEST)
                user.role = role
            except Role.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Invalid role'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        user.save()
        
        serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'User updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    """
    Delete a user
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Prevent admin from deleting other admins
        if user.role.name == 'Admin':
            return Response({
                'success': False,
                'message': 'Cannot delete admin users'
            }, status=status.HTTP_403_FORBIDDEN)
        
        user.delete()
        
        return Response({
            'success': True,
            'message': 'User deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def change_user_password(request, user_id):
    """
    Change user password
    """
    try:
        user = User.objects.get(id=user_id)
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response({
                'success': False,
                'message': 'New password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.password = make_password(new_password)
        user.save()
        
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_modules(request):
    """
    Get all modules for admin management
    """
    modules = Module.objects.all().select_related('author')
    serializer = ModuleSerializer(modules, many=True)
    return Response({
        'success': True,
        'modules': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_module(request, module_id):
    """
    Delete a module
    """
    try:
        module = Module.objects.get(id=module_id)
        module.delete()
        
        return Response({
            'success': True,
            'message': 'Module deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Module.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Module not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


# In-memory storage for headlines (in a real application, this would be in a database)
HEADLINES = [
    {"id": 1, "title": "Welcome to Taneyan Lanjeng Learning Platform", "url": "/"},
    {"id": 2, "title": "New Python Programming Module Available", "url": "/modules"},
    {"id": 3, "title": "Upcoming Maintenance on Saturday", "url": "/"},
]


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_headlines(request):
    """
    Get all headlines for admin management
    """
    return Response({
        'success': True,
        'headlines': HEADLINES
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_headline(request):
    """
    Create a new headline
    """
    title = request.data.get('title')
    url = request.data.get('url')
    
    if not title or not url:
        return Response({
            'success': False,
            'message': 'Title and URL are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate new ID
    new_id = max([h['id'] for h in HEADLINES]) + 1 if HEADLINES else 1
    
    # Add new headline
    new_headline = {"id": new_id, "title": title, "url": url}
    HEADLINES.append(new_headline)
    
    return Response({
        'success': True,
        'message': 'Headline created successfully',
        'headline': new_headline
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_headline(request, headline_id):
    """
    Update a headline
    """
    title = request.data.get('title')
    url = request.data.get('url')
    
    if not title or not url:
        return Response({
            'success': False,
            'message': 'Title and URL are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Find headline
    headline_index = None
    for i, headline in enumerate(HEADLINES):
        if headline['id'] == headline_id:
            headline_index = i
            break
    
    if headline_index is None:
        return Response({
            'success': False,
            'message': 'Headline not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Update headline
    HEADLINES[headline_index] = {"id": headline_id, "title": title, "url": url}
    
    return Response({
        'success': True,
        'message': 'Headline updated successfully',
        'headline': HEADLINES[headline_index]
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_headline(request, headline_id):
    """
    Delete a headline
    """
    global HEADLINES
    
    # Find headline
    headline_index = None
    for i, headline in enumerate(HEADLINES):
        if headline['id'] == headline_id:
            headline_index = i
            break
    
    if headline_index is None:
        return Response({
            'success': False,
            'message': 'Headline not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Remove headline
    HEADLINES.pop(headline_index)
    
    return Response({
        'success': True,
        'message': 'Headline deleted successfully'
    }, status=status.HTTP_200_OK)