from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import *
from .serializers import*

class CourseView(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def list(self, request, *args, **kwargs):
        data = list(Course.objects.all().values())
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        data = list(Course.objects.filter(id=kwargs['pk']).values())
        return Response(data)

    def create(self, request, *args, **kwargs):
        course_serializer_data = CourseSerializer(data=request.data)
        if course_serializer_data.is_valid():
            course_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Added Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Please fill the datails", "status": status_code}, status_code)

    def destroy(self, request, *args, **kwargs):
        course_data = Course.objects.filter(id=kwargs['pk'])
        if course_data:
            course_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Deleted Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data not found", "status": status_code}, status_code)

    def update(self, request, *args, **kwargs):
        course_details = Course.objects.get(id=kwargs['pk'])
        course_serializer_data = CourseSerializer(
            course_details, data=request.data, partial=True)
        if course_serializer_data.is_valid():
            course_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Updated Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data Not found", "status": status_code}, status_code)

class StudentView(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def list(self, request, *args, **kwargs):
        data = list(Student.objects.all().values())
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        data = list(Student.objects.filter(id=kwargs['pk']).values())
        return Response(data)

    def create(self, request, *args, **kwargs):
        course_serializer_data = StudentSerializer(data=request.data)
        if course_serializer_data.is_valid():
            course_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Added Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "please fill the datails", "status": status_code}, status_code)

    def destroy(self, request, *args, **kwargs):
        course_data = Student.objects.filter(id=kwargs['pk'])
        if course_data:
            course_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Deleted Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data not found", "status": status_code}, status_code)

    def update(self, request, *args, **kwargs):
        course_details = Student.objects.get(id=kwargs['pk'])
        course_serializer_data = StudentSerializer(
            course_details, data=request.data, partial=True)
        if course_serializer_data.is_valid():
            course_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Updated Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data Not found", "status": status_code}, status_code)

class ThemeView(viewsets.ModelViewSet):
    queryset =Theme.objects.all()
    serializer_class = ThemeSerializer

    def list(self, request, *args, **kwargs):
        data = list(Theme.objects.all().values())
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        data = list(Theme.objects.filter(id=kwargs['pk']).values())
        return Response(data)

    def create(self, request, *args, **kwargs):
        course_serializer_data = ThemeSerializer(data=request.data)
        if course_serializer_data.is_valid():
            course_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Added Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "please fill the datails", "status": status_code}, status_code)

    def destroy(self, request, *args, **kwargs):
        course_data = Theme.objects.filter(id=kwargs['pk'])
        if course_data:
            course_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Deleted Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data not found", "status": status_code}, status_code)

    def update(self, request, *args, **kwargs):
        course_details = Theme.objects.get(id=kwargs['pk'])
        course_serializer_data = ThemeSerializer(
            course_details, data=request.data, partial=True)
        if course_serializer_data.is_valid():
            course_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Updated Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data Not found", "status": status_code}, status_code)
