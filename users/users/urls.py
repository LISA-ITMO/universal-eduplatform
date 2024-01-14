from django.urls import path
from . import views

urlpatterns = [
    path('profile/<int:pk>/', views.ProfileDetail.as_view(), name='profile-detail'),
    path('profile/adminstatus/', views.ProfileAdminStatus.as_view(), name='profile-adminstatus')
]
