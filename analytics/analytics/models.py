from django.db import models
from django.contrib.auth.models import User


class StudentAnalytics(models.Model):
    objects = None
    student = models.OneToOneField(User, on_delete=models.CASCADE)
    analyticity = models.FloatField(null=True)
    leadership = models.IntegerField(null=True)
