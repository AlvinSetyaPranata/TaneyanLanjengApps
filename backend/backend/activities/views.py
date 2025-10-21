from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import (
    Activity,
    UserOverview
)
from .serializers import (
    ActivitySerializer,
    UserOverviewSerializer
)

# Create your views here.


class ActivityView(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]


class UserOverviewView(ModelViewSet):
    queryset = UserOverview.objects.all()
    serializer_class = UserOverviewSerializer
    permission_classes = [IsAuthenticated]