from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
from .models import (
    Module,
    Lesson
)
from .serializers import (
    LessonSerializer,
    ModuleSerializer,
    ModuleWithLessonsSerializer,
    ModuleWithProgressSerializer,
    ModuleCreateUpdateSerializer
)

# Create your views here.


class ModuleView(ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ModuleCreateUpdateSerializer
        return ModuleSerializer
    
    def perform_update(self, serializer):
        """Custom update to validate exam requirement before publishing"""
        module = self.get_object()
        
        # Check if trying to publish
        if serializer.validated_data.get('is_published', False):
            if not module.has_exam():
                return Response({
                    'success': False,
                    'error': 'Cannot publish module without at least one final exam. Please create an exam lesson first.',
                    'exam_required': True
                }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
    
    def update(self, request, *args, **kwargs):
        """Override update to handle validation errors"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Check if trying to publish without exam
        if serializer.validated_data.get('is_published', False):
            if not instance.has_exam():
                return Response({
                    'success': False,
                    'error': 'Cannot publish module without at least one final exam. Please create an exam lesson first.',
                    'exam_required': True
                }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response(serializer.data)


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
    modules = Module.objects.all().prefetch_related('lessons').order_by('-date_created')
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
        module = Module.objects.prefetch_related('lessons').get(id=module_id)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lesson_detail(request, module_id, lesson_id):
    """
    Get a specific lesson with module context and navigation info.
    """
    try:
        lesson = Lesson.objects.select_related('module_id').get(id=lesson_id, module_id=module_id)
        
        # Get all lessons in the same module for navigation
        all_lessons = Lesson.objects.filter(module_id=module_id, is_published=True).order_by('order')
        
        # Find previous and next lessons
        lesson_list = list(all_lessons)
        current_index = next((i for i, l in enumerate(lesson_list) if l.id == lesson.id), None)
        
        prev_lesson = None
        next_lesson = None
        
        if current_index is not None:
            if current_index > 0:
                prev_lesson = {
                    'id': lesson_list[current_index - 1].id,
                    'title': lesson_list[current_index - 1].title
                }
            if current_index < len(lesson_list) - 1:
                next_lesson = {
                    'id': lesson_list[current_index + 1].id,
                    'title': lesson_list[current_index + 1].title
                }
        
        # Serialize lesson data
        lesson_data = LessonSerializer(lesson).data
        
        # Add module info
        module_data = {
            'id': lesson.module_id.id,
            'title': lesson.module_id.title,
            'description': lesson.module_id.description,
            'cover_image': lesson.module_id.cover_image
        }
        
        # Get all lessons for sidebar
        lessons_for_sidebar = LessonSerializer(all_lessons, many=True).data
        
        return Response({
            'success': True,
            'lesson': lesson_data,
            'module': module_data,
            'navigation': {
                'prev': prev_lesson,
                'next': next_lesson
            },
            'all_lessons': lessons_for_sidebar
        }, status=status.HTTP_200_OK)
        
    except Lesson.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Lesson not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_stats(request):
    """
    Get teacher dashboard statistics.
    Shows total modules, total lessons, last module created, and monthly activity.
    """
    user = request.user
    
    # Get teacher's modules
    teacher_modules = Module.objects.filter(author=user)
    total_modules = teacher_modules.count()
    
    # Get total lessons created by teacher
    total_lessons = Lesson.objects.filter(module_id__author=user).count()
    
    # Get total students enrolled (unique students with activities on teacher's modules)
    from activities.models import Activity
    total_students = Activity.objects.filter(
        modules_id__author=user
    ).values('student_id').distinct().count()
    
    # Get last module created
    last_module = teacher_modules.order_by('-date_created').first()
    last_module_data = None
    if last_module:
        last_module_data = {
            'id': last_module.id,
            'title': last_module.title,
            'description': last_module.description,
            'cover_image': last_module.cover_image,
            'date_created': last_module.date_created,
            'lessons_count': last_module.lessons.count(),
            'is_published': last_module.is_published
        }
    
    # Get monthly activity for last 6 months
    six_months_ago = datetime.now() - timedelta(days=180)
    monthly_modules = teacher_modules.filter(
        date_created__gte=six_months_ago
    ).annotate(
        month=TruncMonth('date_created')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')
    
    monthly_lessons = Lesson.objects.filter(
        module_id__author=user,
        date_created__gte=six_months_ago
    ).annotate(
        month=TruncMonth('date_created')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')
    
    # Format monthly activity
    monthly_activity = []
    for module_data in monthly_modules:
        month_str = module_data['month'].strftime('%Y-%m')
        lesson_count = next(
            (item['count'] for item in monthly_lessons if item['month'].strftime('%Y-%m') == month_str),
            0
        )
        monthly_activity.append({
            'month': month_str,
            'modules_created': module_data['count'],
            'lessons_created': lesson_count
        })
    
    return Response({
        'success': True,
        'stats': {
            'total_modules': total_modules,
            'total_lessons': total_lessons,
            'total_students_enrolled': total_students,
            'last_module': last_module_data,
            'monthly_activity': monthly_activity
        }
    }, status=status.HTTP_200_OK)