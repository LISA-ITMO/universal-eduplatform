from .views import *
from django.urls import path
from .views import SubjectView, ThemeView, CourseView

urlpatterns = [
    path("subjects/add/", SubjectView.as_view({"post": "add"}), name="subjects-add"),
    path("subjects/list/", SubjectView.as_view({"get": "list"}), name="subjects-list"),
    path(
        "subjects/get/<int:pk>/",
        SubjectView.as_view({"get": "retrieve"}),
        name="subjects-get-id",
    ),
    path(
        "subjects/delete/<int:pk>/",
        SubjectView.as_view({"delete": "delete"}),
        name="subjects-delete-id",
    ),
    path("themes/add/", ThemeView.as_view({"post": "add"}), name="themes-add"),
    path("themes/list/", ThemeView.as_view({"get": "list"}), name="themes-list"),
    path(
        "themes/get/<int:pk>/",
        ThemeView.as_view({"get": "retrieve"}),
        name="themes-list-id",
    ),
    path(
        "themes/delete/<int:pk>/",
        ThemeView.as_view({"delete": "delete"}),
        name="themes-delete-id",
    ),
    path(
        "themes/getBySubjectId/<int:subject_id>/",
        ThemeView.as_view(
            {
                "get": "getBySubjectId",
            }
        ),
        name="themes-bySubjects",
    ),
    path("courses/add/", CourseView.as_view({"post": "add"}), name="courses-add"),
    path("courses/list/", CourseView.as_view({"get": "list"}), name="courses-list"),
    path(
        "courses/get/<int:pk>/",
        CourseView.as_view({"get": "retrieve"}),
        name="courses-list-id",
    ),
    path(
        "courses/delete/<int:pk>/",
        CourseView.as_view({"delete": "delete"}),
        name="courses-delete-id",
    ),
    path(
        "courses/getBySubjectId/<int:subject_id>/",
        CourseView.as_view(
            {
                "get": "getBySubjectId",
            }
        ),
        name="courses-bySubjects",
    ),
    path(
        "courses/getByIdExpert/<int:expert_id>/",
        CourseView.as_view(
            {
                "get": "getByIdExpert",
            }
        ),
        name="courses-byIdExpert",
    ),
    path(
        "courses/get/<int:expert_id>/<int:subject_id>",
        CourseView.as_view(
            {
                "get": "getExpertInfo",
            }
        ),
        name="courses-ExpertInfo",
    ),
    # path('students/list/',  StudentView.as_view({'get': 'list'}), name='students-list'),
    # path('students/getById/<int:pk>/', StudentView.as_view({'get': 'retrieve'}), name='students-list-id'),
    # path('students/getBySubjectId/<int:subject_id>/', StudentView.as_view({'get': 'getBySubjectId',}), name='students-bySubjects'),
    # path('students/getByIdExpert/<int:expert_id>/', StudentView.as_view({'get': 'getByIdExpert',}), name='students-byIdExpert'),
    # path('students/get/<int:expert_id>/<int:subject_id>', StudentView.as_view({'get': 'getStudentsInfo',}), name='students-StudentsInfo'),
]
