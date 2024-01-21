from django.contrib import admin

#Registering models
from .models import Subject, Student, Theme, Course, Student_Course_Subject

admin.site.register(Subject)
admin.site.register(Student)
admin.site.register(Theme)
admin.site.register(Course)
admin.site.register(Student_Course_Subject)