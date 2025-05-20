from django.apps import AppConfig


class AnalyticsConfig(AppConfig):
    """
    Configuration settings for analytics tracking."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "analytics"
