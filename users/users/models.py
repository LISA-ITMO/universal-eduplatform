from django.db import models
from django.contrib.auth.models import User


class RoleField(models.CharField):
    ROLE_CHOICES = [
        ('student', 'student'),
        ('teacher', 'teacher'),
        ('admin', 'admin'),
    ]

    def __init__(self, *args, **kwargs):
        kwargs['choices'] = self.ROLE_CHOICES
        kwargs['max_length'] = 7
        kwargs['blank'] = False
        kwargs['null'] = False
        super().__init__(*args, **kwargs)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    description = models.TextField()
    role = RoleField()

    def __str__(self):
        return self.user.username
