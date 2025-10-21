from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import (
    Module,
    Lesson
)
from .serializers import (
    LessonSerializer,
    ModuleSerializer,
    ModuleWithLessonsSerializer,
    ModuleWithProgressSerializer
)

# Create your views here.


class ModuleView(ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]


class LessonView(ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def modules_overview(request):
    """
    Get all modules with their lessons nested inside and user progress.
    This provides a complete overview of all available modules and their content.
    """
    modules = Module.objects.all().prefetch_related('lesson_set').order_by('-date_created')
    serializer = ModuleWithProgressSerializer(modules, many=True, context={'request': request})
    
    return Response({
        'success': True,
        'count': modules.count(),
        'modules': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def module_detail_with_lessons(request, module_id):
    """
    Get a specific module with all its lessons.
    """
    try:
        module = Module.objects.prefetch_related('lesson_set').get(id=module_id)
        serializer = ModuleWithLessonsSerializer(module)
        
        return Response({
            'success': True,
            'module': serializer.data
        }, status=status.HTTP_200_OK)
    except Module.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Module not found'
        }, status=status.HTTP_404_NOT_FOUND)