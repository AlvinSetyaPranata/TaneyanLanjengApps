from django.db import models
from users.models import User


class Module(models.Model):
    title = models.CharField(max_length=255, unique=True)
    deadline = models.DateTimeField()
    author_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_updated = models.DateTimeField(auto_now_add=True, editable=False)


class Lesson(models.Model):
    content = models.TextField()
    module_id = models.ForeignKey(Module, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_updated = models.DateTimeField(auto_now_add=True, editable=False)
