from django.test import TestCase
from rest_framework.test import APIRequestFactory
from ..analytics.views import StudentAnalyticsViewSet
from ..analytics.models import StudentAnalytics


class TestStudentAnalyticsViewSet(TestCase):
    """
    Tests for the StudentAnalyticsViewSet."""

    def setUp(self):
        """
        Sets up test fixtures for analytics tests.

            Creates a StudentAnalytics instance and an API request factory
            for use in subsequent test methods.

            Args:
                None

            Returns:
                None
        """
        self.student_id = 1
        self.test_id = 1
        self.analytics_instance = StudentAnalytics.objects.create(
            student_id=self.student_id
        )
        self.factory = APIRequestFactory()

    def test_retrieve_analytics(self):
        """
        Tests the retrieval of student analytics data.

            Args:
                None

            Returns:
                None
        """
        view = StudentAnalyticsViewSet.as_view({"get": "retrieve"})
        request = self.factory.get(f"/api/analytics/{self.student_id}/")
        response = view(request, student_id=self.student_id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["student_id"], self.student_id)

    def test_calculate_analyticity(self):
        """
        Tests the calculate_analyticity endpoint."""
        view = StudentAnalyticsViewSet.as_view({"patch": "calculate_analyticity"})
        data = {"student_id": self.student_id, "test_id": self.test_id}
        request = self.factory.patch("/api/analytics/calculate_analyticity/", data=data)
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            StudentAnalytics.objects.get(student_id=self.student_id).analyticity > 0,
            True,
        )

    def test_create_analytics(self):
        """
        Tests the creation of a student analytics record.

            Args:
                None

            Returns:
                None
        """
        view = StudentAnalyticsViewSet.as_view({"post": "create"})
        data = {"student_id": 2}
        request = self.factory.post("/api/analytics/create/", data=data)
        response = view(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(StudentAnalytics.objects.filter(student_id=2).exists(), True)

    def test_update_analytics(self):
        """
        Tests the update functionality for student analytics.

            This test case verifies that updating student analytics data via a PUT request
            correctly modifies the corresponding fields in the StudentAnalytics model.

            Args:
                None

            Returns:
                None
        """
        view = StudentAnalyticsViewSet.as_view({"put": "update"})
        data = {"student_id": self.student_id, "analyticity": 4, "leadership": 3}
        request = self.factory.put("/api/analytics/update/", data=data)
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            StudentAnalytics.objects.get(student_id=self.student_id).analyticity, 4
        )
        self.assertEqual(
            StudentAnalytics.objects.get(student_id=self.student_id).leadership, 3
        )
