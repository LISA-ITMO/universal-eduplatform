from django.urls import path
from . import views

urlpatterns = [
    path('<int:quiz_id>/questions/<int:question_id>/grade/',
         views.grade_question, name='grade_question'),
    path('results/<int:quiz_id>/', views.test_results,
         name='test_results'),
]
