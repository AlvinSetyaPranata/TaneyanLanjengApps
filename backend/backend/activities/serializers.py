from rest_framework.serializers import ModelSerializer
from .models import (
    Activity,
    UserOverview
)



class ActivitySerializer(ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'student_id', 'modules_id']


class UserOverviewSerializer(ModelSerializer):
    class Meta:
        model = UserOverview
        fields = ['id', 'user_id', 'user_activities', 'last_module_learned_id']