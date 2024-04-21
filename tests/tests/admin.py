from django.contrib import admin

from .models import Question, Test, Answer,  Solutions, Result

admin.site.register(Question)
admin.site.register(Test)
admin.site.register(Answer)
admin.site.register(Solutions)
admin.site.register(Result)