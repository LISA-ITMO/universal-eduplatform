from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'description', 'role')
    list_filter = ('id', 'user', 'description', 'role')
    search_fields = ('id', 'user', 'description', 'role')
