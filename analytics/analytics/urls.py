from django.urls import path
from .views import (
    StudentAnalyticsView,
    StudentDetailAnalyticsView,
    StudentListAnalyticsView,
)

urlpatterns = [
    path('analytics/student', StudentAnalyticsView.as_view(), name='student-analytics'),
    path('analytics/student/<int:pk>', StudentDetailAnalyticsView.as_view(), name='student-detail-analytics'),
    path('analytics/students', StudentListAnalyticsView.as_view(), name='student-list-analytics'),
]