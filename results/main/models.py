from django.db import models


class Student (models.Model):
    id_student = models.IntegerField(primary_key=True)
    is_author = models.BooleanField(default=False)


class Test (models.Model):
    id_test = models.IntegerField(primary_key=True)
    max_point = models.IntegerField()
    author = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    correct_answer = models.IntegerField()


class Answer(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.IntegerField()
    is_correct = models.BooleanField(default=False)


class Results (models.Model):
    id_results = models.IntegerField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)
    test = models.ForeignKey(Test, on_delete=models.SET_NULL, null=True)
    point = models.IntegerField(default=0)
