from django.db import models
from django.urls import reverse

class Subject(models.Model): #Таблица с данными предметов
    name_subject = models.CharField(max_length=100)

    def __str__(self):
        return self.name_subject

class Student(models.Model): #Таблица с данными учащихся
    id_student = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    isExpert = models.BooleanField(default=False)

    def __str__(self):
        return self.id_student

class Theme(models.Model): #Таблица с темами тестов
    name_theme = models.CharField(max_length=100)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return self.name_theme

class Course(models.Model):
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    id_expert = models.ForeignKey(Student, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.id_subject

class Student_Course_Subject(models.Model):
    id_student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='course_id_student')
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='course_id_subject')
    id_expert = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='course_id_expert')

    def __str__(self):
        return self.id_expert
