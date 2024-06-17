from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import StudentAnalytics
from .serializers import StudentAnalyticsSerializer, StudentIdSerializer, StudentIdTestSerializer
from .calculations import calculate_analyticity, calculate_leadership
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework.exceptions import NotFound


@extend_schema(tags=["Analytics"])
class StudentAnalyticsViewSet(viewsets.ViewSet):
    serializer_class = StudentAnalyticsSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(name='student_id', type=int, location=OpenApiParameter.PATH, required=True,
                             description="ID of the student")
        ],
        responses={200: StudentAnalyticsSerializer},
        summary="Retrieve student analytics by student ID"
    )
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve student analytics by student ID.
        """
        queryset = StudentAnalytics.objects.filter(student_id=kwargs['student_id'])
        serializer = StudentAnalyticsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={200: StudentAnalyticsSerializer(many=True)},
        summary="List all student analytics"
    )
    def list(self, *args, **kwargs):
        """
        List all student analytics.
        """
        data = list(StudentAnalytics.objects.all().values())
        return Response(data)

    @extend_schema(
        request=StudentIdTestSerializer,
        responses={200: StudentIdTestSerializer},
        summary="Calculate analyticity for a student"
    )
    def calculate_analyticity(self, request):
        """
        Calculate analyticity for a student.
        """
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

    @extend_schema(
        request=StudentIdSerializer,
        responses={200: StudentIdSerializer},
        summary="Calculate leadership for a student"
    )
    def calculate_leadership(self, request):
        """
        Calculate leadership for a student.
        """
        serializer = StudentIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']

        leadership = calculate_leadership(student_id)

        StudentAnalytics.objects.update_or_create(
            student_id=student_id,
            defaults={'leadership': leadership}
        )

        return Response({"message": "Added Successfully"}, status=status.HTTP_200_OK)

    @extend_schema(
        request=StudentIdSerializer,
        responses={201: StudentAnalyticsSerializer},
        summary="Create or update student analytics"
    )
    def create(self, request, *args, **kwargs):
        """
        Create or update student analytics.
        """
        serializer = StudentIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']

        StudentAnalytics.objects.update_or_create(
            student_id=student_id,
            defaults={'analyticity': 0, 'leadership': 0}
        )

        return Response({"message": "Created Successfully"}, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=StudentAnalyticsSerializer,
        responses={200: StudentAnalyticsSerializer},
        summary="Update student analytics"
    )
    def update(self, request):
        """
        Update student analytics.
        """
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

