from django.urls import path
from .views import (TestAddView,
                    TestListView,
                    TestGetView,
                    GetAllCorrectAnswersView,
                    GetCorrectAnswerByQuestionIdView,
                    ResultsView)

urlpatterns = [
    path('tests/add', TestAddView.as_view(), name='tests-add'),
    path('tests/list', TestListView.as_view(), name='tests-list'),
    path('tests/<int:pk>', TestGetView.as_view(), name='tests-get'),
    path('tests/get-all-correct-answers/<int:pk>', GetAllCorrectAnswersView.as_view(),
         name='tests-get-all-right-answers'),
    path('tests/get-correct-answer-by-question-id/<int:question_pk>', GetCorrectAnswerByQuestionIdView.as_view(),
         name='tests-get-right-answer'),

    path('results/add', ResultsView.as_view({'post': 'add'}), name='results-add'),
    path('results/list', ResultsView.as_view({'get': 'list'}), name='results-list'),
    path('results/getByResultId/<int:id>', ResultsView.as_view({'get': 'getByResultId'}), name='results-getByResultId'),
    path('results/getByStudentTestId/<int:studentId>/<int:testId>', ResultsView.as_view({'get': 'getByStudentTestId'}), name='results-getByStudentTestId'),
    path('results/getByStudentId/<int:studentId>', ResultsView.as_view({'get': 'getByStudentId'}), name='results-getByStudentId'),
    path('results/getByTestId/<int:testId>', ResultsView.as_view({'get': 'getByTestId'}), name='results-getByTestId'),
    path('results/full/getByStudentTestId/<int:studentId>/<int:testId>', ResultsView.as_view({'get': 'fullStudentTestId'}), name='results-full'),
    path('results/full/getByStudentId/<int:studentId>', ResultsView.as_view({'get': 'fullStudentId'}), name='results-fullStudentId'),
    path('results/full/getByTestId/<int:testId>', ResultsView.as_view({'get': 'fullTestId'}), name='results-fullTestId')
]
