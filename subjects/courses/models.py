from django.db import models
from django.urls import reverse

class Subject(models.Model): #Таблица с данными предметов
    name_subject = models.CharField(max_length=100)

class Student(models.Model): #Таблица с данными учащихся
    id_student = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    isExpert = models.BooleanField(default=False)

class Theme(models.Model): #Таблица с темами тестов
    name_theme = models.CharField(max_length=100)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

class Course(models.Model):
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    id_expert = models.ForeignKey(Student, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)

class Student_Course_Subject(models.Model):
    id_student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='course_id_student')
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='course_id_subject')
    id_expert = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='course_id_expert')