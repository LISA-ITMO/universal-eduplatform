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

# class StudentView(viewsets.ModelViewSet):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

#     def retrieve(self, request, *args, **kwargs):
#         data = list(Student.objects.filter(id_student=kwargs['pk']).values())
#         return Response(data)    
    
#     def getBySubjectId(self, request, *args, **kwargs):
#         students_id = list(Student_Course_Subject.objects.filter(id_subject=kwargs['subject_id']).values_list("id_student", flat=True))
#         data = list(Student.objects.filter(pk__in=students_id).values())
#         return Response(data)
    
#     def list(self, request, *args, **kwargs):
#         data = list(Student.objects.all().values())
#         return Response(data)
    
#     def getByIdExpert(self, request, *args, **kwargs):
#         students_id = list(Student_Course_Subject.objects.filter(id_expert=kwargs['expert_id']).values_list("id_student", flat=True))
#         data = list(Student.objects.filter(pk__in=students_id).values())
#         return Response(data)
    
#     def getStudentsInfo(self, request, *args, **kwargs):
#         students_id = list(Student_Course_Subject.objects.filter(id_expert=kwargs['expert_id']).filter(id_subject=kwargs['subject_id']).values_list('id_student',  flat=True))
#         data = list(Student.objects.filter(pk__in=students_id).values())
#         return Response(data)

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
        course_serializer_data = CourseSerializer(data=request.data)
        if course_serializer_data.is_valid():
            data = list(Course.objects.filter(id_expert=request.data['id_expert']).filter(id_subject=request.data['id_subject']).values())
            if len(data) != 0:
                return Response({"message": "Already exists"})
            course_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response({"message": "Added Sucessfully", "status": status_code}, status_code)
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response({"message": "Please fill the datails", "status": status_code}, status_code)
        
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
