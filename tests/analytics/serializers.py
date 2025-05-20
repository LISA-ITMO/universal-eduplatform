from rest_framework import serializers
from .models import StudentAnalytics


class StudentAnalyticsSerializer(serializers.ModelSerializer):
    """
    Serializer for the StudentAnalytics model.

    Serializes student analytics data into JSON format.

    Fields:
        student_id (IntegerField): ID of the student.
        analyticity (IntegerField): Analyticity score of the student.
        leadership (IntegerField): Leadership score of the student.
    """

    class Meta:
        model = StudentAnalytics
        fields = ["student_id", "analyticity", "leadership"]


class StudentIdSerializer(serializers.Serializer):
    """
    Serializer for handling student ID.

    Validates and serializes a single student ID.

    Fields:
        student_id (IntegerField): ID of the student.
    """

    student_id = serializers.IntegerField()


class StudentIdTestSerializer(serializers.Serializer):
    """
    Serializer for handling student ID and test ID.

    Validates and serializes a pair of student ID and test ID.

    Fields:
        student_id (IntegerField): ID of the student.
        test_id (IntegerField): ID of the test linked to this student.
    """

    student_id = serializers.IntegerField()
    test_id = serializers.IntegerField()
