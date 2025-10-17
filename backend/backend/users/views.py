from rest_framework.viewsets import ModelViewSet
from .models import (
    Role,
    User
)
from .serializers import (
    RoleSerializer,
    UserSerializer
)

# Create your views here.


class RoleView(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer