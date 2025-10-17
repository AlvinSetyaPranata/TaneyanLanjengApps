from rest_framework.viewsets import ModelViewSet
from .models import Activity
from .serializers import ActivitySerializer

# Create your views here.


class ActivityView(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer