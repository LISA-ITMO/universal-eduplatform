from django.db import models

class Subject(models.Model): #Таблица с данными предметов
    name_subject = models.CharField(max_length=100)

    def __str__(self):
        return self.name_subject

class Theme(models.Model): #Таблица с темами тестов
    name_theme = models.CharField(max_length=100)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return self.name_theme

class Course(models.Model):
    name_course = models.CharField(max_length=100)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    id_expert = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name_course

class Student_Course_Subject(models.Model):
    id_student = models.IntegerField(null=True, blank=True)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='course_id_subject')
    id_expert = models.IntegerField(null=True, blank=True)

    # def __str__(self):
    #     return self.id_expert
