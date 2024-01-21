from django.urls import path
from .views import TestAddView, TestListView, TestGetView, GetAllCorrectAnswersView, GetCorrectAnswerByQuestionIdView

urlpatterns = [
    path('tests/add', TestAddView.as_view(), name='tests-add'),
    path('tests/list', TestListView.as_view(), name='tests-list'),
    path('tests/<int:pk>', TestGetView.as_view(), name='tests-get'),
    path('tests/get-all-correct-answers/<int:pk>', GetAllCorrectAnswersView.as_view(),
         name='tests-get-all-right-answers'),
    path('tests/get-correct-answer-by-question-id/<int:question_pk>', GetCorrectAnswerByQuestionIdView.as_view(),
         name='tests-get-right-answer'),
]
