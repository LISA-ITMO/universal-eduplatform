from django.db import models
from django.contrib.auth.models import User


class StudentAnalytics(models.Model):
    """
    Model representing analytics data for a student.

    Attributes:
        id (AutoField): Primary key for the StudentAnalytics model.
        student_id (IntegerField): Unique identifier of the student.
        analyticity (IntegerField): Analyticity score of the student, default is 0.
        leadership (IntegerField): Leadership score of the student, default is 0.
    """

    id = models.AutoField(primary_key=True)
    student_id = models.IntegerField(
        unique=True, null=False, help_text="Unique identifier of the student."
    )
    analyticity = models.IntegerField(
        default=0, null=False, help_text="Analyticity score of the student."
    )
    leadership = models.IntegerField(
        default=0, null=False, help_text="Leadership score of the student."
    )

    class Meta:
        app_label = "analytics"
        verbose_name_plural = "Student Analytics"

    def __str__(self):
        """
        Returns a string representation of the StudentAnalytics object.

          Args:
            None

          Returns:
            str: A string containing the student ID associated with the analytics.
        """
        return f"StudentAnalytics: student_id {self.student_id}"
