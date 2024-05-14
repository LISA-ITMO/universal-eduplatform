from rest_framework import serializers
from .models import StudentAnalytics


class StudentAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnalytics
        fields = ['analyticity', 'leadership']
