from rest_framework import status, viewsets
from .models import (StudentAnalyticsTest,StudentAnalyticsTheme, StudentAnalyticsCourse,
                    StudentLeadershipTest, StudentLeadershipTheme, StudentLeadershipCourse)
from .serializers import StudentIdTestSerializer, StudentIdThemeSerializer, StudentIdSubjectSerializer
from .calculations import (calculate_analyticity_test, calculate_analyticity_theme, calculate_analyticity_course,
                            calculate_leadership_test, calculate_leadership_theme, calculate_leadership_course)
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from django.http import Http404

class StudentAnalyticsViewSet(viewsets.ViewSet):
    @swagger_auto_schema(tags=["Analyticity"], operation_description="Retrieve student analytics for test by student ID")
    def retrieve_test_analyticity(self, request, *args, **kwargs):
        analyticity_test = get_object_or_404(StudentAnalyticsTest, student_id=kwargs['student_id'], test=kwargs['test_id']).analyticity_test
        return Response(analyticity_test, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Analyticity"], operation_description="Retrieve student analytics for theme by student ID")
    def retrieve_theme_analyticity(self, request, *args, **kwargs):
        analyticity_theme = get_object_or_404(StudentAnalyticsTheme, student_id=kwargs['student_id'], theme_id=kwargs['theme_id'], subject_id=kwargs['subject_id']).analyticity_theme
        return Response(analyticity_theme, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Analyticity"], operation_description="Retrieve student analytics for course by student ID")
    def retrieve_course_analyticity(self, request, *args, **kwargs):
        analyticity_course = get_object_or_404(StudentAnalyticsCourse, student_id=kwargs['student_id'], subject_id=kwargs['subject_id']).analyticity_course
        return Response(analyticity_course, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["Analyticity"], operation_description="List all student analytics for test")
    def list_test_analyticity(self, *args, **kwargs):
        tests = StudentAnalyticsTest.objects.all().values()
        return Response(tests)

    @swagger_auto_schema(tags=["Analyticity"], operation_description="List all student analytics for theme")
    def list_theme_analyticity(self, *args, **kwargs):
        data = list(StudentAnalyticsTheme.objects.all().values())
        return Response(data)
    
    @swagger_auto_schema(tags=["Analyticity"], operation_description="List all student analytics for course")
    def list_course_analyticity(self, *args, **kwargs):
        data = list(StudentAnalyticsCourse.objects.all().values())
        return Response(data)
    
    @swagger_auto_schema(tags=["Leadership"], operation_description="Retrieve student leadership for test by student ID")
    def retrieve_test_leadership(self, request, *args, **kwargs):
        try :
            leadership_test = get_object_or_404(StudentLeadershipTest, student_id=kwargs['student_id'], test=kwargs['test_id']).leadership_test
        except Http404:
             leadership_test = 0
        return Response(leadership_test, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Leadership"], operation_description="Retrieve student leadership for theme by student ID")
    def retrieve_theme_leadership(self, request, *args, **kwargs):
        try:
            leadership_theme = get_object_or_404(StudentLeadershipTheme, student_id=kwargs['student_id'], theme_id=kwargs['theme_id'], subject_id=kwargs['subject_id']).leadership_theme
        except Http404:
             leadership_theme = 0
        return Response(leadership_theme, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Leadership"], operation_description="Retrieve student leadership for course by student ID")
    def retrieve_course_leadership(self, request, *args, **kwargs):
        try:
            leadership_course = get_object_or_404(StudentLeadershipCourse, student_id=kwargs['student_id'], subject_id=kwargs['subject_id']).leadership_course
        except Http404:
             leadership_course = 0
        return Response(leadership_course, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=["Leadership"], operation_description="List all student leadership for test")
    def list_test_leadership(self, *args, **kwargs):
        tests = StudentLeadershipTest.objects.all().values()
        return Response(tests)

    @swagger_auto_schema(tags=["Leadership"], operation_description="List all student leadership for theme")
    def list_theme_leadership(self, *args, **kwargs):
        data = list(StudentLeadershipTheme.objects.all().values())
        return Response(data)
    @swagger_auto_schema(tags=["Leadership"], operation_description="List all student leadership for course")
    def list_course_leadership(self, *args, **kwargs):
        data = list(StudentLeadershipCourse.objects.all().values())
        return Response(data)


def calculating_analyticity_test(data):
        serializer = StudentIdTestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']
        test_id = serializer.validated_data['test_id']

        analyticity_test = calculate_analyticity_test(student_id, test_id)

        StudentAnalyticsTest.objects.update_or_create(
            student_id=student_id,
            test_id=test_id,
            defaults={'analyticity_test': analyticity_test}
        )

def calculating_analyticity_theme(data):
        serializer = StudentIdThemeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']
        theme_id = serializer.validated_data['theme_id']
        subject_id = serializer.validated_data['subject_id']


        analyticity_theme = calculate_analyticity_theme(student_id, theme_id, subject_id)

        StudentAnalyticsTheme.objects.update_or_create(
            student_id=student_id,
            subject_id=subject_id,
            theme_id=theme_id,
            defaults={'analyticity_theme': analyticity_theme}
        )

def calculating_analyticity_course(data):
        serializer = StudentIdSubjectSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']
        subject_id = serializer.validated_data['subject_id']

        analyticity_course = calculate_analyticity_course(student_id, subject_id)

        StudentAnalyticsCourse.objects.update_or_create(
            student_id=student_id,
            subject_id=subject_id,
            defaults={'analyticity_course': analyticity_course}
        )

def calculating_leadership_test(data):
        serializer = StudentIdTestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        student_id = serializer.validated_data['student_id']
        test_id = serializer.validated_data['test_id']

        leadership_test = calculate_leadership_test(test_id)

        StudentLeadershipTest.objects.update_or_create(
            student_id=student_id,
            test_id=test_id,
            defaults={'leadership_test': leadership_test}
        )

def calculating_leadership_theme(data):
    serializer = StudentIdThemeSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    student_id = serializer.validated_data['student_id']
    theme_id = serializer.validated_data['theme_id']
    subject_id = serializer.validated_data['subject_id']

    leadership_theme = calculate_leadership_theme(student_id, theme_id, subject_id)

    StudentLeadershipTheme.objects.update_or_create(
        student_id=student_id,
        subject_id=subject_id,
        theme_id=theme_id,
        defaults={'leadership_theme': leadership_theme}
    )

def calculating_leadership_course(data):
    serializer = StudentIdSubjectSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    student_id = serializer.validated_data['student_id']
    subject_id = serializer.validated_data['subject_id']

    leadership_course = calculate_leadership_course(student_id, subject_id)

    StudentLeadershipCourse.objects.update_or_create(
        student_id=student_id,
        subject_id=subject_id,
        defaults={'leadership_course': leadership_course}
    )