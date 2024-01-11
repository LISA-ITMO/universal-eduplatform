from rest_framework import serializers
from .models  import*

class CourseSerializer(serializers.ModelSerializer):
    class Meta():
        model = Course
        fields = "__all__"

class StudentSerializer(serializers.ModelSerializer):
    class Meta():
        model = Student
        fields = "__all__"


class ThemeSerializer(serializers.ModelSerializer):
    class Meta():
        model = Theme
        fields = "__all__"