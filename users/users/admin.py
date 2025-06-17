from django.contrib import admin
from .models import User


@admin.register(User)
class TestAdmin(admin.ModelAdmin):
    """
    Represents an admin interface for a test model."""

    list_display = (
        "id",
        "email",
        "username",
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
        "created_at",
        "updated_at",
    )
