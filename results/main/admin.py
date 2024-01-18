from django.contrib import admin

# Register your models here.

from .models import Test, Student, Results, Question, Answer

admin.site.register(Test)
admin.site.register(Student)
admin.site.register(Results)
admin.site.register(Question)
admin.site.register(Answer)
