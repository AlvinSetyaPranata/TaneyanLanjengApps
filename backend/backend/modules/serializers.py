from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import (
    Lesson,
    Module
)


class LessonSerializer(ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "content", "module_id"]


class ModuleSerializer(ModelSerializer):
    class Meta:
        model = Module
        fields = ["id", "title", "deadline", "author_id"]


class ModuleWithLessonsSerializer(ModelSerializer):
    """Serializer for modules with nested lessons"""
    lessons = LessonSerializer(many=True, read_only=True, source='lesson_set')
    
    class Meta:
        model = Module
        fields = ["id", "title", "deadline", "author_id", "date_created", "date_updated", "lessons"]


class ModuleWithProgressSerializer(ModelSerializer):
    """Serializer for modules with nested lessons and user progress"""
    lessons = LessonSerializer(many=True, read_only=True, source='lesson_set')
    progress = SerializerMethodField()
    
    class Meta:
        model = Module
        fields = ["id", "title", "deadline", "author_id", "date_created", "date_updated", "lessons", "progress"]
    
    def get_progress(self, obj):
        """Get user's progress for this module"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from activities.models import Activity
            try:
                activity = Activity.objects.get(student_id=request.user, modules_id=obj)
                return activity.progress
            except Activity.DoesNotExist:
                return 0
        return 0