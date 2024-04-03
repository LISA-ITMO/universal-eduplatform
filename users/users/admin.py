from django.contrib import admin
from .models import User

@admin.register(User)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'role', 'is_active' , 'is_staff', 'is_superuser', 'created_at', 'updated_at')
