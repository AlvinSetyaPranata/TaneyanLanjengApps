from rest_framework.serializers import ModelSerializer
from .models import (
    Activity,
    UserOverview,
    TestHistory
)
from modules.serializers import LessonSerializer


class ActivitySerializer(ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'student_id', 'modules_id']


class UserOverviewSerializer(ModelSerializer):
    class Meta:
        model = UserOverview
        fields = ['id', 'user_id', 'user_activities', 'last_module_learned_id']


class TestHistorySerializer(ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = TestHistory
        fields = ['id', 'student', 'lesson', 'score', 'max_score', 'answers', 'correct_answers', 'date_finished']
        read_only_fields = ['id', 'date_finished']