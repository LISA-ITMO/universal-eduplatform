from .views import *
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# Register your routes with the router here
router.register('course_data', CourseView, basename='course_data')
router.register('student_data', StudentView, basename='student_data')
router.register('theme_data', ThemeView, basename='theme_data')

urlpatterns = router.urls