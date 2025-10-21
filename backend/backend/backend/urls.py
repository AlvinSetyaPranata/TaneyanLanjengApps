

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
    LessonView,
    modules_overview,
    module_detail_with_lessons
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
    # Specific module endpoints must come BEFORE router.urls to avoid conflicts
    path('api/modules/overview', modules_overview, name='modules-overview'),
    path('api/modules/<int:module_id>/detail', module_detail_with_lessons, name='module-detail-with-lessons'),
    path('api/login', LoginView.as_view(), name='login'),
    path('api/register', RegisterView.as_view(), name='register'),
    # Router URLs (will match /api/modules, /api/modules/<id>, etc.)
    path('api/', include(router.urls)),
]
