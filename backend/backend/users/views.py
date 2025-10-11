from rest_framework.viewsets import ModelViewSet
from .models import (
    Role,
    User
)
from .serializers import (
    RoleSerializer
)

# Create your views here.


class RoleView(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer