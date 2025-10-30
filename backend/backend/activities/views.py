from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Avg
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from .models import (
    Activity,
    UserOverview
)
from .serializers import (
    ActivitySerializer,
    UserOverviewSerializer
)
from modules.models import Module

# Create your views here.


class ActivityView(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]


class UserOverviewView(ModelViewSet):
    queryset = UserOverview.objects.all()
    serializer_class = UserOverviewSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_stats(request):
    """
    Get student dashboard statistics.
    Shows active modules count, last module learned, and activity statistics.
    """
    user = request.user
    
    # Get all student's activities
    activities = Activity.objects.filter(student_id=user)
    
    # Get active modules (progress < 100)
    active_modules_count = activities.filter(progress__lt=100).count()
    
    # Get completed modules count
    completed_modules_count = activities.filter(progress=100).count()
    
    # Get last module learned (most recently updated activity)
    last_activity = activities.order_by('-date_updated').first()
    last_module_data = None
    if last_activity:
        last_module = last_activity.modules_id
        last_module_data = {
            'id': last_module.id,
            'title': last_module.title,
            'description': last_module.description,
            'cover_image': last_module.cover_image,
            'progress': last_activity.progress,
            'lessons_count': last_module.lessons.count()
        }
    
    # Get total lessons completed (approximation based on progress)
    total_lessons = 0
    lessons_completed = 0
    for activity in activities:
        module_lessons_count = activity.modules_id.lessons.count()
        total_lessons += module_lessons_count
        lessons_completed += int((activity.progress / 100) * module_lessons_count)
    
    # Get monthly activity for last 6 months
    six_months_ago = datetime.now() - timedelta(days=180)
    monthly_progress = activities.filter(
        date_updated__gte=six_months_ago
    ).annotate(
        month=TruncMonth('date_updated')
    ).values('month').annotate(
        avg_progress=Avg('progress'),
        modules_count=Count('id')
    ).order_by('month')
    
    # Format monthly activity
    monthly_activity = []
    for data in monthly_progress:
        month_str = data['month'].strftime('%Y-%m')
        monthly_activity.append({
            'month': month_str,
            'average_progress': round(data['avg_progress'], 1),
            'modules_active': data['modules_count']
        })
    
    return Response({
        'success': True,
        'stats': {
            'active_modules': active_modules_count,
            'completed_modules': completed_modules_count,
            'total_lessons': total_lessons,
            'lessons_completed': lessons_completed,
            'last_module': last_module_data,
            'monthly_activity': monthly_activity
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exam_answers(request, lesson_id):
    """
    Submit exam answers from a student.
    """
    try:
        # Get the lesson (exam)
        from modules.models import Lesson
        lesson = Lesson.objects.get(id=lesson_id, lesson_type='exam')
        
        # In a real implementation, you would:
        # 1. Validate the answers
        # 2. Store them in a database
        # 3. Calculate score
        # 4. Return results
        
        # For now, we'll just acknowledge the submission
        answers = request.data.get('answers', {})
        
        # Log the submission (in a real app, you'd save to database)
        print(f"User {request.user.username} submitted answers for exam {lesson.title}: {answers}")
        
        return Response({
            'success': True,
            'message': 'Exam answers submitted successfully'
        }, status=status.HTTP_200_OK)
        
    except Lesson.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Exam not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)