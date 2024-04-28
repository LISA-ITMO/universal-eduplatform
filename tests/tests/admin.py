from django.contrib import admin

from .models import Question, Test, Answer, Result, Solutions

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('author_id', 'subject_id', 'theme_id', 'times_solved' , 'expert_id', 'max_points')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id_test', 'question_text', 'addition_info', 'question_points')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id_question', 'answer_text', 'is_correct')

@admin.register(Result)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id_user', 'id_test', 'points_user')

@admin.register(Solutions)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id_result', 'id_question', 'user_answer' )
