from django.db import models
from django.urls import reverse

class Course(models.Model): #Таблица с данными курсов
    name_subject = models.CharField(max_length=40)
    description = models.TextField(null=True, blank=True)

class Student(models.Model): #Таблица с данными учащихся
    student_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    isTeacher = models.BooleanField(default=False)
    student_courses = models.ManyToManyField(Course, blank=True, related_name='study_courses')
    teacher_courses = models.ManyToManyField(Course, blank=True, related_name='teach_courses')

class Theme(models.Model): #Таблица с темами тестов
    name_theme = models.CharField(max_length=40)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)