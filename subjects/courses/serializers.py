from rest_framework import serializers
from .models import *


class SubjectSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = Subject
        fields = "__all__"


class ThemeSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = Theme
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = Course
        fields = "__all__"


class Student_Course_SubjectSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = Student_Course_Subject
        fields = "__all__"
