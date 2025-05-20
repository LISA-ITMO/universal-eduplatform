from django.urls import path, re_path
from .views import *
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    re_path(r'^signin/$', LoginView.as_view({'post': 'post'}), name='login'),
    re_path(r'^signup/$', RegistrationAPIView.as_view(), name='register'),
    re_path(r'^refresh/$', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/<str:token>', UserAPIView.as_view({'get': 'admin'}), name='get_admin'),
    path('teacher/<str:token>', UserAPIView.as_view({'get': 'teacher'}), name='get_teacher'),
    path('student/<str:token>', UserAPIView.as_view({'get': 'student'}), name='get_student'),
    re_path(r'^logout/$', LogoutAPIView.as_view(), name='logout'),
    path('decode/<str:token>', TokenDecode.as_view({'get': 'decode'}), name='token_decode'),
    path('me/', UserMeView.as_view(), name='user_me'),  # Новый endpoint
]

