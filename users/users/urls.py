from django.urls import path, re_path
from .views import *
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    re_path(r'^signin/$', LoginView.as_view(), name='login'),
    re_path(r'^signup/$', RegistrationAPIView.as_view({'post':'signup'}), name='register'),
    re_path(r'^refresh/$', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('get_user/<int:pk>', UserAPIView.as_view({'get': 'get_user'}), name='get_user'),
    path('admin/<str:token>', UserAPIView.as_view({'get': 'admin'}), name='get_admin'),
    path('teacher/<str:token>', UserAPIView.as_view({'get': 'teacher'}), name='get_teacher'),
    path('student/<str:token>', UserAPIView.as_view({'get': 'student'}), name='get_student')
]

