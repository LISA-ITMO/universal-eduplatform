from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import *
from .serializers import*

class SubjectView(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def list(self, request, *args, **kwargs):
        data = list(Subject.objects.all().values())
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        data = list(Subject.objects.filter(id=kwargs['pk']).values())
        return Response(data)

    def add(self, request, *args, **kwargs):
        subject_serializer_data = SubjectSerializer(data=request.data)
        if subject_serializer_data.is_valid():
            subject_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Added Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Please fill the datails", "status": status_code}, status_code)

    def delete(self, request, *args, **kwargs):
        subject_data = Subject.objects.filter(id=kwargs['pk'])
        if subject_data:
            subject_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Deleted Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data not found", "status": status_code}, status_code)

class ThemeView(viewsets.ModelViewSet):
    queryset =Theme.objects.all()
    serializer_class = ThemeSerializer

    def list(self, request, *args, **kwargs):
        data = list(Theme.objects.all().values())
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        data = list(Theme.objects.filter(id=kwargs['pk']).values())
        return Response(data)

    def add(self, request, *args, **kwargs):
        themes_serializer_data = ThemeSerializer(data=request.data)
        if themes_serializer_data.is_valid():
            themes_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Added Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "please fill the datails", "status": status_code}, status_code)

    def delete(self, request, *args, **kwargs):
        themes_data = Theme.objects.filter(id=kwargs['pk'])
        if themes_data:
            themes_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Deleted Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data not found", "status": status_code}, status_code)
    def getBySubjectId(self, request, *args, **kwargs):
        data = list(Theme.objects.filter(id_subject=kwargs['subject_id']).values())
        return Response(data)

class CourseView(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def add(self, request, *args, **kwargs):
        data = request.data
        id_expert = data.get('id_expert')
        name_course = data.get('name_course')
        id_subject = data.get('id_subject')
        description = data.get('description')

        course_serializer_data = CourseSerializer(data=data)
        if course_serializer_data.is_valid(raise_exception=True):
            course_serializer_data.save()
            return Response({"message": "Added Sucessfully", "status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        else:
            if not name_course or not id_subject:
                return Response({"error": "Both name_course and id_subject are required.", "status": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
            try:
                subject = Subject.objects.get(id=id_subject)
            except Subject.DoesNotExist:
                return Response({"error": f"Subject with id {id_subject} does not exist.",  "status": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
            course = Course(name_course=name_course, id_subject=subject)
            course.save()
            return Response({"message": "Added Sucessfully",  "status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        
    def retrieve(self, request, *args, **kwargs):
        data = list(Course.objects.filter(id=kwargs['pk']).values())
        return Response(data)    
    
    def list(self, request, *args, **kwargs):
        data = list(Course.objects.all().values())
        return Response(data)

    def delete(self, request, *args, **kwargs):
        course_data = Course.objects.filter(id=kwargs['pk'])
        if course_data:
            course_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Deleted Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Data not found", "status": status_code}, status_code)
    def getBySubjectId(self, request, *args, **kwargs):
        data = list(Course.objects.filter(id_subject=kwargs['subject_id']).values())
        return Response(data)
    def getByIdExpert(self, request, *args, **kwargs):
        data = list(Course.objects.filter(id_expert=kwargs['expert_id']).values())
        return Response(data)
    def getExpertInfo(self, request, *args, **kwargs):
        data = list(Course.objects.filter(id_expert=kwargs['expert_id']).filter(id_subject=kwargs['subject_id']).values())
        return Response(data)
