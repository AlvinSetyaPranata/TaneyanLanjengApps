from django.db import models
from users.models import User
from modules.models import Module, Lesson


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
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='test_histories', null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    max_score = models.FloatField(null=True, blank=True)
    answers = models.JSONField(default=dict)  # Store student answers
    correct_answers = models.JSONField(default=dict)  # Store correct answers for review
    date_finished = models.DateTimeField(auto_now_add=True, editable=False)
    
    class Meta:
        ordering = ['-date_finished']