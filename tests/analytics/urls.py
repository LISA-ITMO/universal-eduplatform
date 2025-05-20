from django.urls import path
from .views import StudentAnalyticsViewSet

urlpatterns = [
    path('analiticity/test/<int:student_id>/<int:test_id>', StudentAnalyticsViewSet.as_view({'get': 'retrieve_test_analyticity'})),
    path('analiticity/theme/<int:student_id>/<int:theme_id>/<int:subject_id>', StudentAnalyticsViewSet.as_view({'get': 'retrieve_theme_analyticity'})),
    path('analiticity/course/<int:student_id>/<int:subject_id>', StudentAnalyticsViewSet.as_view({'get': 'retrieve_course_analyticity'})),
    path('analiticity/test/list_test', StudentAnalyticsViewSet.as_view({'get': 'list_test_analyticity'})),
    path('analiticity/theme/list_theme', StudentAnalyticsViewSet.as_view({'get': 'list_theme_analyticity'})),
    path('analiticity/course/list_course', StudentAnalyticsViewSet.as_view({'get': 'list_course_analyticity'})),
    # path('analiticity/calculate_analyticity_test/', StudentAnalyticsViewSet.as_view({'patch': 'calculate_analyticity_test'})),
    # path('analiticity/calculate_analyticity_theme/', StudentAnalyticsViewSet.as_view({'patch': 'calculate_analyticity_theme'})),

    path('leadership/test/<int:student_id>/<int:test_id>', StudentAnalyticsViewSet.as_view({'get': 'retrieve_test_leadership'})),
    path('leadership/theme/<int:student_id>/<int:theme_id>/<int:subject_id>', StudentAnalyticsViewSet.as_view({'get': 'retrieve_theme_leadership'})),
    path('leadership/course/<int:student_id>/<int:subject_id>', StudentAnalyticsViewSet.as_view({'get': 'retrieve_course_leadership'})),
    path('leadership/test/list_test', StudentAnalyticsViewSet.as_view({'get': 'list_test_leadership'})),
    path('leadership/theme/list_theme', StudentAnalyticsViewSet.as_view({'get': 'list_theme_leadership'})),
    path('leadership/course/list_course', StudentAnalyticsViewSet.as_view({'get': 'list_course_leadership'})),
    # path('leadership/calculate_leadership_test/', StudentAnalyticsViewSet.as_view({'patch': 'calculate_leadership_test'})),
    # path('leadership/calculate_leadership_theme/', StudentAnalyticsViewSet.as_view({'patch': 'calculate_leadership_theme'})),

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
