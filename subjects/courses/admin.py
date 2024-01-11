from django.contrib import admin

#Registering models
from .models import Course, Student, Theme

admin.site.register(Course)
admin.site.register(Student)
admin.site.register(Theme)