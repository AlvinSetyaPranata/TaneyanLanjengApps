from django.db import models
from users.models import User
from modules.models import Module

class Activity(models.Model):
    student_id = models.ForeignKey(User, on_delete=models.CASCADE)
    modules_id = models.ForeignKey(Module, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_updated = models.DateTimeField(auto_now_add=True, editable=False)


class UserOverview(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    last_module_learned_id = models.ForeignKey(Module, on_delete=models.CASCADE)
    user_activities = models.ManyToManyField(Activity)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_updated = models.DateTimeField(auto_now_add=True, editable=False)



class TestHistory(models.Model):
    lesson_id = models.ForeignKey(Module, on_delete=models.CASCADE)
    date_finished = models.DateTimeField(auto_now_add=True, editable=False)