from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import uuid


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """
    Upload an image file and return its URL.
    """
    if 'image' not in request.FILES:
        return Response({
            'success': False,
            'error': 'No image file provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    image_file = request.FILES['image']
    
    # Validate file type
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    ext = os.path.splitext(image_file.name)[1].lower()
    if ext not in allowed_extensions:
        return Response({
            'success': False,
            'error': f'Invalid file type. Allowed types: {", ".join(allowed_extensions)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate file size (max 5MB)
    if image_file.size > 5 * 1024 * 1024:
        return Response({
            'success': False,
            'error': 'File size too large. Maximum size is 5MB'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    
    # Save file to media directory
    file_path = default_storage.save(f"uploads/{unique_filename}", ContentFile(image_file.read()))
    
    # Generate URL
    file_url = default_storage.url(file_path)
    
    return Response({
        'success': True,
        'url': file_url,
        'filename': unique_filename
    }, status=status.HTTP_201_CREATED)