from rest_framework.serializers import ModelSerializer, SerializerMethodField, CharField
from .models import (
    Lesson,
    Module
)


class LessonSerializer(ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "title", "content", "lesson_type", "order", "duration_minutes", "is_published", "module_id", "date_created", "date_updated"]
        read_only_fields = ["id", "date_created", "date_updated"]


class LessonCreateUpdateSerializer(ModelSerializer):
    """Serializer for creating and updating lessons"""
    class Meta:
        model = Lesson
        fields = ["title", "content", "lesson_type", "order", "duration_minutes", "is_published", "module_id"]


class ModuleSerializer(ModelSerializer):
    author_name = CharField(source='author_id.full_name', read_only=True)
    lessons_count = SerializerMethodField()
    has_exam = SerializerMethodField()
    exam_count = SerializerMethodField()
    
    class Meta:
        model = Module
        fields = ["id", "title", "description", "deadline", "author_id", "author_name", 
                  "cover_image", "is_published", "lessons_count", "has_exam", "exam_count", 
                  "date_created", "date_updated"]
        read_only_fields = ["id", "author_name", "lessons_count", "has_exam", "exam_count", 
                            "date_created", "date_updated"]
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()
    
    def get_has_exam(self, obj):
        return obj.has_exam()
    
    def get_exam_count(self, obj):
        return obj.get_exam_count()


class ModuleCreateUpdateSerializer(ModelSerializer):
    """Serializer for creating and updating modules"""
    class Meta:
        model = Module
        fields = ["title", "description", "deadline", "cover_image", "is_published"]


class ModuleWithLessonsSerializer(ModelSerializer):
    """Serializer for modules with nested lessons"""
    lessons = LessonSerializer(many=True, read_only=True)
    author_name = CharField(source='author_id.full_name', read_only=True)
    
    class Meta:
        model = Module
        fields = ["id", "title", "description", "deadline", "author_id", "author_name", "cover_image", "is_published", "date_created", "date_updated", "lessons"]


class ModuleWithProgressSerializer(ModelSerializer):
    """Serializer for modules with nested lessons and user progress"""
    lessons = LessonSerializer(many=True, read_only=True)
    progress = SerializerMethodField()
    author_name = CharField(source='author_id.full_name', read_only=True)
    
    class Meta:
        model = Module
        fields = ["id", "title", "description", "deadline", "author_id", "author_name", "cover_image", "is_published", "date_created", "date_updated", "lessons", "progress"]
    
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