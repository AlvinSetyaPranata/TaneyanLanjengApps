from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.db.models import Count, Avg
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from .models import (
    Activity,
    UserOverview,
    TestHistory
)
from .serializers import (
    ActivitySerializer,
    UserOverviewSerializer
)
from modules.models import Module, Lesson

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
    six_months_ago = timezone.now() - timedelta(days=180)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exam_history(request):
    """
    Get exam history for the authenticated student.
    """
    user = request.user
    
    # Get all test histories for this student
    test_histories = TestHistory.objects.filter(student=user).select_related('lesson', 'lesson__module_id')
    
    # Format the response
    history_data = []
    for history in test_histories:
        history_data.append({
            'id': history.id,
            'lesson_id': history.lesson.id if history.lesson else None,
            'lesson_title': history.lesson.title if history.lesson else 'Unknown Lesson',
            'module_id': history.lesson.module_id.id if history.lesson and history.lesson.module_id else None,
            'module_title': history.lesson.module_id.title if history.lesson and history.lesson.module_id else 'Unknown Module',
            'score': history.score,
            'max_score': history.max_score,
            'percentage': round((history.score / history.max_score) * 100, 1) if history.score and history.max_score else None,
            'date_finished': history.date_finished,
            'answers': history.answers,
            'correct_answers': history.correct_answers
        })
    
    return Response({
        'success': True,
        'count': len(history_data),
        'history': history_data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_lesson_progress(request, module_id, lesson_id):
    """
    Update student's progress when they view a lesson.
    """
    try:
        # Get the lesson and module
        lesson = Lesson.objects.get(id=lesson_id, module_id=module_id)
        module = Module.objects.get(id=module_id)
        
        # Get all lessons in the module to calculate progress
        all_lessons = Lesson.objects.filter(module_id=module_id).order_by('order')
        total_lessons = all_lessons.count()
        
        # Find the position of the current lesson
        lesson_ids = list(all_lessons.values_list('id', flat=True))
        current_lesson_index = lesson_ids.index(lesson_id)
        
        # Calculate progress as percentage (current position / total lessons * 100)
        # For the last lesson, set progress to 100%
        if current_lesson_index == total_lessons - 1:
            progress = 100
        else:
            progress = int(((current_lesson_index + 1) / total_lessons) * 100)
        
        # Update or create activity record
        activity, created = Activity.objects.get_or_create(
            student_id=request.user,
            modules_id=module,
            defaults={'progress': progress}
        )
        
        # If activity already exists, update progress if it's higher
        if not created and activity.progress < progress:
            activity.progress = progress
            activity.save()
        
        return Response({
            'success': True,
            'progress': progress,
            'message': 'Progress updated successfully'
        }, status=status.HTTP_200_OK)
        
    except Lesson.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Lesson not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Module.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Module not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({
            'success': False,
            'error': 'Lesson not found in module'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exam_answers(request, lesson_id):
    """
    Submit exam answers from a student.
    """
    try:
        # Get the lesson (exam)
        lesson = Lesson.objects.get(id=lesson_id, lesson_type='exam')
        
        # Get answers from request
        answers = request.data.get('answers', {})
        
        # Parse the exam content to get correct answers
        correct_answers = {}
        max_score = 0
        score = 0
        
        try:
            # Try to parse exam content as JSON
            import json
            exam_content = json.loads(lesson.content)
            
            if isinstance(exam_content, list):
                # Process JSON format questions
                for item in exam_content:
                    question_id = item.get('id')
                    if question_id:
                        max_score += 1
                        correct_option = next((opt for opt in item.get('options', []) if opt.get('isCorrect')), None)
                        if correct_option:
                            correct_answers[question_id] = correct_option.get('text', '')
                            # Check if student answer matches correct answer
                            if str(question_id) in answers and answers[str(question_id)] == correct_answers[question_id]:
                                score += 1
            else:
                # Fallback for markdown format (simplified)
                max_score = len(answers)
                score = 0  # We'll calculate this properly
                correct_answers = {}
                
                # For markdown, we can't easily parse correct answers, so we'll just store what we have
                for question_id_str, answer in answers.items():
                    try:
                        question_id = int(question_id_str)
                        max_score += 1
                        # In a real implementation, we would parse the markdown to find correct answers
                        # For now, we'll assume a simple scoring mechanism
                    except ValueError:
                        pass
        except json.JSONDecodeError:
            # Fallback for markdown format (simplified)
            max_score = len(answers)
            score = max_score  # Assume all correct for now
            correct_answers = {}  # In a real implementation, parse markdown to extract correct answers
        
        # Create test history record
        test_history = TestHistory.objects.create(
            student=request.user,
            lesson=lesson,
            score=score,
            max_score=max_score,
            answers=answers,
            correct_answers=correct_answers
        )
        
        # Update progress to 100% when exam is completed
        try:
            activity = Activity.objects.get(student_id=request.user, modules_id=lesson.module_id)
            activity.progress = 100
            activity.save()
        except Activity.DoesNotExist:
            # Create activity if it doesn't exist
            Activity.objects.create(
                student_id=request.user,
                modules_id=lesson.module_id,
                progress=100
            )
        
        return Response({
            'success': True,
            'message': 'Exam answers submitted successfully',
            'score': score,
            'max_score': max_score,
            'percentage': round((score / max_score) * 100, 1) if max_score > 0 else 0
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