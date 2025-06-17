from django.apps import AppConfig


class TestsConfig(AppConfig):
    """
    Configuration class for tests."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "tests"
