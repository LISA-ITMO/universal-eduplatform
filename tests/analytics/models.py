from django.db import models
from tests.models import Test

class StudentAnalyticsTest(models.Model):
    """
    Model representing analytics data for a student.

    Attributes:
        id (AutoField): Primary key for the StudentAnalytics model.
        student_id (IntegerField): Identifier of the student.
        analyticity (IntegerField): Analyticity score of the student, default is 0.
        leadership (IntegerField): Leadership score of the student, default is 0.
    """
    student_id = models.IntegerField(null=False, help_text="Identifier of the student.")
    test = models.ForeignKey(Test, on_delete=models.PROTECT)
    analyticity_test = models.IntegerField(default=0, null=False, help_text="Analyticity score of the student.")

    class Meta:
        app_label = 'analytics'
        verbose_name_plural = "Student Analytics for Test"

    def __str__(self):
        return f"StudentAnalyticsForTest: student_id {self.student_id}"

class StudentAnalyticsTheme(models.Model):
    student_id = models.IntegerField(null=False, help_text="Identifier of the student.")
    theme_id = models.IntegerField(null=False)
    subject_id = models.IntegerField(null=False)
    analyticity_theme = models.IntegerField(default=0, null=False)

    class Meta:
        app_label = 'analytics'
        verbose_name_plural = "Student Analytics for Theme"

    def __str__(self):
        return f"StudentAnalyticsForTheme: student_id {self.student_id}"
    
class StudentAnalyticsCourse(models.Model):
    student_id = models.IntegerField(null=False, help_text="Identifier of the student.")
    subject_id = models.IntegerField(null=False)
    analyticity_course = models.IntegerField(default=0, null=False)

    class Meta:
        app_label = 'analytics'
        verbose_name_plural = "Student Analytics for Course"

    def __str__(self):
        return f"StudentAnalyticsForCourse: student_id {self.student_id}"
    
class StudentLeadershipTest(models.Model):
    student_id = models.IntegerField(null=False, help_text="Identifier of the student.")
    test = models.ForeignKey(Test, on_delete=models.PROTECT)
    leadership_test = models.IntegerField(default=0, null=False)

    class Meta:
        app_label = 'analytics'
        verbose_name_plural = "Student Leadership for Test"

    def __str__(self):
        return f"StudentLeadershipForTest: student_id {self.student_id}"
    

class StudentLeadershipTheme(models.Model):
    student_id = models.IntegerField(null=False, help_text="Identifier of the student.")
    theme_id = models.IntegerField(null=False)
    subject_id = models.IntegerField(null=False)
    leadership_theme = models.IntegerField(default=0, null=False)

    class Meta:
        app_label = 'analytics'
        verbose_name_plural = "Student Leadership for Theme"

    def __str__(self):
        return f"StudentLeadershipForTheme: student_id {self.student_id}"
    
class StudentLeadershipCourse(models.Model):
    student_id = models.IntegerField(null=False, help_text="Identifier of the student.")
    subject_id = models.IntegerField(null=False)
    leadership_course = models.IntegerField(default=0, null=False)

    class Meta:
        app_label = 'analytics'
        verbose_name_plural = "Student Leadership for Course"

    def __str__(self):
        return f"StudentLeadershipForCourse: student_id {self.student_id}"
    