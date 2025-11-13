from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import (
    RoleView,
    UserView,
    LoginView,
    RegisterView,
    get_user_profile,
    update_user_profile,
    change_password
)
from modules.views import (
    ModuleView,
    LessonView,
    modules_overview,
    module_detail_with_lessons,
    lesson_detail,
    teacher_stats
)
from activities.views import (
    UserOverviewView,
    ActivityView,
    student_stats,
    submit_exam_answers
)
from modules.views_upload import upload_image
from users.views_admin import (
    admin_dashboard_stats,
    get_all_users,
    create_user,
    update_user,
    delete_user,
    change_user_password,
    get_all_modules,
    delete_module,
    get_headlines,
    create_headline,
    update_headline,
    delete_headline
)

router = DefaultRouter()

router.register(r'roles', RoleView)
router.register(r'users', UserView)
router.register(r'modules', ModuleView)
router.register(r'lessons', LessonView)
router.register(r'activities', ActivityView)
router.register(r'overviews', UserOverviewView)


urlpatterns = [
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Specific module endpoints must come BEFORE router.urls to avoid conflicts
    path('api/modules/overview', modules_overview, name='modules-overview'),
    path('api/modules/<int:module_id>/detail', module_detail_with_lessons, name='module-detail-with-lessons'),
    path('api/modules/<int:module_id>/lessons/<int:lesson_id>', lesson_detail, name='lesson-detail'),
    path('api/teacher/stats', teacher_stats, name='teacher-stats'),
    path('api/student/stats', student_stats, name='student-stats'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    # User profile endpoints
    path('api/user/profile/', get_user_profile, name='user-profile'),
    path('api/user/profile/update/', update_user_profile, name='update-user-profile'),
    path('api/user/password/change/', change_password, name='change-password'),
    # Exam endpoints
    path('api/exam/<int:lesson_id>/submit', submit_exam_answers, name='submit-exam-answers'),
    # File upload endpoint
    path('api/upload/image', upload_image, name='upload-image'),
        # Admin endpoints
    path('api/admin/stats', admin_dashboard_stats, name='admin-stats'),
    path('api/admin/users', get_all_users, name='admin-get-all-users'),
    path('api/admin/users/create', create_user, name='admin-create-user'),
    path('api/admin/users/<int:user_id>/update', update_user, name='admin-update-user'),
    path('api/admin/users/<int:user_id>/delete', delete_user, name='admin-delete-user'),
    path('api/admin/users/<int:user_id>/change-password', change_user_password, name='admin-change-user-password'),
    path('api/admin/modules', get_all_modules, name='admin-get-all-modules'),
    path('api/admin/modules/<int:module_id>/delete', delete_module, name='admin-delete-module'),
    path('api/admin/headlines', get_headlines, name='admin-get-headlines'),
    path('api/admin/headlines/create', create_headline, name='admin-create-headline'),
    path('api/admin/headlines/<int:headline_id>/update', update_headline, name='admin-update-headline'),
    path('api/admin/headlines/<int:headline_id>/delete', delete_headline, name='admin-delete-headline'),
    # Router URLs (will match /api/modules, /api/modules/<id>, etc.)
    path('api/', include(router.urls)),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
