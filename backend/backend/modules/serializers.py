from rest_framework.serializers import ModelSerializer
from .models import (
    Lesson,
    Module
)




class ModuleSerializer(ModelSerializer):
    class Meta:
        model = Module
        fields = ["id", "title", "deadline", "author_id"]



class LessonSerializer(ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "content", "module_id"]