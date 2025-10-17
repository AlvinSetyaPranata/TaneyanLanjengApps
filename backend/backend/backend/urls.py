

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import (
    RoleView,
    UserView
)
from modules.views import (
    ModuleView,
    LessonView
)
from activities.views import ActivityView

router = DefaultRouter(trailing_slash=False)

router.register(r'roles', RoleView)
router.register(r'users', UserView)
router.register(r'modules', ModuleView)
router.register(r'lessons', LessonView)
router.register(r'activities', ActivityView)


urlpatterns = [
    path('api/', include(router.urls))
]
