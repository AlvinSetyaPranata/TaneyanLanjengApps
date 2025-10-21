

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import (
    RoleView,
    UserView,
    LoginView,
    RegisterView
)
from modules.views import (
    ModuleView,
    LessonView
)
from activities.views import (
    UserOverviewView,
    ActivityView
)

router = DefaultRouter(trailing_slash=False)

router.register(r'roles', RoleView)
router.register(r'users', UserView)
router.register(r'modules', ModuleView)
router.register(r'lessons', LessonView)
router.register(r'activities', ActivityView)
router.register(r'overviews', UserOverviewView)


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login', LoginView.as_view(), name='login'),
    path('api/register', RegisterView.as_view(), name='register'),
]
