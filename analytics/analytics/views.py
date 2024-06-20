from rest_framework import status, generics, viewsets
from .models import StudentAnalytics
from .serializers import StudentAnalyticsSerializer, StudentIdSerializer, StudentIdTestSerializer
from .calculations import calculate_analyticity, calculate_leadership
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema


class StudentAnalyticsViewSet(viewsets.ViewSet):
    serializer_class = StudentAnalyticsSerializer

    @swagger_auto_schema(tags=["Analytics"], operation_description="Retrieve student analytics by student ID")
    def retrieve(self, request, *args, **kwargs):
        queryset = StudentAnalytics.objects.filter(student_id=kwargs['student_id'])
        serializer = StudentAnalyticsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["Analytics"], operation_description="List all student analytics")
    def list(self, *args, **kwargs):
        data = list(StudentAnalytics.objects.all().values())
        return Response(data)

    @swagger_auto_schema(tags=["Analytics"], operation_description="Calculate analyticity for a student",
                         request_body=StudentIdTestSerializer)
    def calculate_analyticity(self, request):
        serializer = StudentIdTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']
        test_id = serializer.validated_data['test_id']

        analyticity = calculate_analyticity(student_id, test_id)

        StudentAnalytics.objects.update_or_create(
            student_id=student_id,
            defaults={'analyticity': analyticity}
        )

        return Response({"message": "Added Successfully"}, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["Analytics"], operation_description="Calculate leadership for a student",
                         request_body=StudentIdSerializer)
    def calculate_leadership(self, request):
        serializer = StudentIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']

        leadership = calculate_leadership(student_id)

        StudentAnalytics.objects.update_or_create(
            student_id=student_id,
            defaults={'leadership': leadership}
        )

        return Response({"message": "Added Successfully"}, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["Analytics"], operation_description="add student's result",
                         request_body=StudentIdSerializer)
    def create(self, request, *args, **kwargs):
        serializer = StudentIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']

        StudentAnalytics.objects.update_or_create(
            student_id=student_id,
            defaults={'analyticity': 0, 'leadership': 0}
        )

        return Response({"message": "Created Successfully"}, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(tags=["Analytics"], operation_description="Update student analytics",
                         request_body=StudentAnalyticsSerializer)
    def update(self, request):
        data = request.data
        student_id = data['student_id']
        student_analytics_instance = StudentAnalytics.objects.filter(student_id=student_id).first()
        if not student_analytics_instance:
            raise NotFound(detail="Student not found")

        serializer = StudentAnalyticsSerializer(instance=student_analytics_instance, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
