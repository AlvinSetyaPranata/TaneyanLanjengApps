

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import (
    RoleView
)

router = DefaultRouter()

router.register(r'roles', RoleView)


urlpatterns = [
    path('api/', include(router.urls))
]
