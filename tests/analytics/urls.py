from django.urls import path
from .views import StudentAnalyticsViewSet

urlpatterns = [
    path('analytics/<int:student_id>/', StudentAnalyticsViewSet.as_view({'get': 'retrieve'})),
    path('analytics/list/', StudentAnalyticsViewSet.as_view({'get': 'list'})),
    path('analytics/create/', StudentAnalyticsViewSet.as_view({'post': 'create'})),
    path('analytics/update/', StudentAnalyticsViewSet.as_view({'put': 'update'})),
    path('analytics/calculate_analyticity/', StudentAnalyticsViewSet.as_view({'patch': 'calculate_analyticity'})),
    path('analytics/calculate_leadership/', StudentAnalyticsViewSet.as_view({'patch': 'calculate_leadership'})),
]

# Documentation for URLs
"""
Calculates and updates analyticity score for a student.

Endpoint: /analytics/calculate_analyticity/
HTTP Method: PATCH
View: StudentAnalyticsViewSet.calculate_analyticity
"""

"""
Calculates and updates leadership score for a student.

Endpoint: /analytics/calculate_leadership/
HTTP Method: PATCH
View: StudentAnalyticsViewSet.calculate_leadership
"""

"""
Creates a new student analytics entry.

Endpoint: /analytics/create/
HTTP Method: POST
View: StudentAnalyticsViewSet.create
"""

"""
Retrieves a list of all student analytics data.

Endpoint: /analytics/list/
HTTP Method: GET
View: StudentAnalyticsViewSet.list
"""

"""
Retrieves analytics data for a specific student.

Endpoint: /analytics/<student_id>/
HTTP Method: GET
View: StudentAnalyticsViewSet.retrieve
"""

"""
Updates an existing student analytics entry.

Endpoint: /analytics/update/
HTTP Method: PUT
View: StudentAnalyticsViewSet.update
"""
