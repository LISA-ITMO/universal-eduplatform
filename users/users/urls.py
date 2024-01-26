from django.urls import path
from .views import register_user, get_user_profile
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('users/register/', register_user, name='register-user'),
    path('users/login/', obtain_auth_token, name='login'),
    path('users/get/', get_user_profile, name='get-user-profile'),
]

