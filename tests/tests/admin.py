from django.contrib import admin

from .models import Question, Test, Answer, TestUser, Grade, Solutions

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('author_id', 'subject_id', 'theme_id', 'times_solved' , 'expert_id')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('test', 'question_text', 'correct_answer', 'addition_info' )

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('question', 'answer_text' )


@admin.register(TestUser)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'test_id')


@admin.register(Grade)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'test_id', 'question_id', 'answer' )

@admin.register(Solutions)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id_result', 'answer', 'correct_answer' )



# Register your models here.
