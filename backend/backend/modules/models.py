from django.db import models
from django.core.exceptions import ValidationError
from users.models import User


class Module(models.Model):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    deadline = models.DateTimeField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='modules')
    cover_image = models.URLField(max_length=500, blank=True, null=True)
    is_published = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return self.title
    
    def get_lessons_count(self):
        """Get the number of lessons in this module"""
        return self.lessons.count()
    
    def has_exam(self):
        """Check if module has at least one exam lesson"""
        return self.lessons.filter(lesson_type='exam').exists()
    
    def get_exam_count(self):
        """Get the number of exam lessons in this module"""
        return self.lessons.filter(lesson_type='exam').count()
    
    def clean(self):
        """Validate module before saving"""
        super().clean()
        # Check if module is being published without an exam
        if self.is_published and self.pk:
            if not self.has_exam():
                raise ValidationError(
                    'Cannot publish module without at least one final exam. '
                    'Please create an exam lesson before publishing.'
                )


class Lesson(models.Model):
    LESSON_TYPE_CHOICES = [
        ('lesson', 'Lesson'),
        ('exam', 'Exam'),
    ]
    
    module_id = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField()  # Markdown content
    lesson_type = models.CharField(max_length=10, choices=LESSON_TYPE_CHOICES, default='lesson')
    order = models.IntegerField(default=0)
    duration_minutes = models.IntegerField(default=30, help_text="Estimated duration in minutes")
    is_published = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['module_id', 'order']
        unique_together = ['module_id', 'order']

    def __str__(self):
        return f"{self.module_id.title} - {self.title}"