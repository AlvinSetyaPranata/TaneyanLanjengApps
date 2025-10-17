from rest_framework.viewsets import ModelViewSet
from .models import (
    Module,
    Lesson
)
from .serializers import (
    LessonSerializer,
    ModuleSerializer
)

# Create your views here.


class ModuleView(ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer


class LessonView(ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer