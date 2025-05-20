from django.urls import path
from .views import (
    TestAPIView,
    TestGetView,
    TestListView,
    GetAllCorrectAnswersView,
    GetAllCorrectAnswersByQuestionView,
    ResultsView,
)

urlpatterns = [
    path("tests/add", TestAPIView.as_view({"post": "add"}), name="tests-add"),
    path(
        "tests/list/<int:subject_id>/<int:theme_id>",
        TestListView.as_view({"get": "get"}),
        name="tests-list",
    ),
    path("tests/<int:pk>", TestGetView.as_view({"get": "get"}), name="tests-get"),
    path(
        "tests/get-all-correct-answers/<int:pk>",
        GetAllCorrectAnswersView.as_view({"get": "get"}),
        name="tests-get-all-right-answers",
    ),
    path(
        "tests/get-correct-answer-by-question-id/<int:question_pk>",
        GetAllCorrectAnswersByQuestionView.as_view({"get": "get"}),
        name="question-get-right-answer",
    ),
    path("results/add", ResultsView.as_view({"post": "add"}), name="results-add"),
    path("results/list", ResultsView.as_view({"get": "list"}), name="results-list"),
    path(
        "results/getByResultId/<int:id>",
        ResultsView.as_view({"get": "getByResultId"}),
        name="results-getByResultId",
    ),
    path(
        "results/getByStudentTestId/<int:studentId>/<int:testId>",
        ResultsView.as_view({"get": "getByStudentTestId"}),
        name="results-getByStudentTestId",
    ),
    path(
        "results/getByStudentId/<int:studentId>",
        ResultsView.as_view({"get": "getByStudentId"}),
        name="results-getByStudentId",
    ),
    path(
        "results/getByTestId/<int:testId>",
        ResultsView.as_view({"get": "getByTestId"}),
        name="results-getByTestId",
    ),
    path(
        "results/full/getByStudentTestId/<int:studentId>/<int:testId>",
        ResultsView.as_view({"get": "fullStudentTestId"}),
        name="results-full",
    ),
    path(
        "results/full/getByStudentId/<int:studentId>",
        ResultsView.as_view({"get": "fullStudentId"}),
        name="results-fullStudentId",
    ),
    path(
        "results/full/getByTestId/<int:testId>",
        ResultsView.as_view({"get": "fullTestId"}),
        name="results-fullTestId",
    ),
]
