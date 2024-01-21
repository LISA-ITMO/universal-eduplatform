from rest_framework import serializers
from .models  import*

class SubjectSerializer(serializers.ModelSerializer):
    class Meta():
        model = Subject
        fields = "__all__"

class StudentSerializer(serializers.ModelSerializer):
    class Meta():
        model = Student
        fields = "__all__"


class ThemeSerializer(serializers.ModelSerializer):
    class Meta():
        model = Theme
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    class Meta():
        model = Course
        fields = "__all__"

class Student_Course_SubjectSerializer(serializers.ModelSerializer):
    class Meta():
        model = Student_Course_Subject
        fields = "__all__"