from rest_framework.views import APIView
from rest_framework.response import Response
from .models import StudentAnalytics
from .serializers import StudentAnalyticsSerializer
from django.http import Http404
from rest_framework import status


class StudentAnalyticsView(APIView):
    """
    Retrieve analytics for a specific student.
    """

    def get(self, request):
        student_analytics = StudentAnalytics.objects.all()
        serializer = StudentAnalyticsSerializer(student_analytics, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StudentAnalyticsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentDetailAnalyticsView(APIView):
    """
    Retrieve, update or delete a specific student's analytics.
    """

    def get_object(self, pk):
        try:
            return StudentAnalytics.objects.get(pk=pk)
        except StudentAnalytics.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        student_analytics = self.get_object(pk)
        serializer = StudentAnalyticsSerializer(student_analytics)
        return Response(serializer.data)

    def put(self, request, pk):
        student_analytics = self.get_object(pk)
        serializer = StudentAnalyticsSerializer(student_analytics, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        student_analytics = self.get_object(pk)
        student_analytics.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentListAnalyticsView(APIView):
    """
    Retrieve all student analytics.
    """

    def get(self, request):
        student_analytics = StudentAnalytics.objects.all()
        serializer = StudentAnalyticsSerializer(student_analytics, many=True)
        return Response(serializer.data)