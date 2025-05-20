from django.db import models


class Subject(models.Model):  # Таблица с данными предметов
    name_subject = models.CharField(max_length=100)

    def __str__(self):
        """
        Returns a string representation of the Theme object.

          Args:
            None

          Returns:
            str: The name_subject attribute of the Theme object.
        """
        return self.name_subject


class Theme(models.Model):  # Таблица с темами тестов
    name_theme = models.CharField(max_length=100)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        """
        Returns a string representation of the Course object.

            Args:
                None

            Returns:
                str: The name of the course.
        """
        return self.name_theme


class Course(models.Model):
    """
    Represents a course with its details."""

    name_course = models.CharField(max_length=100)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    id_expert = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        """
        Returns a string representation of the Student_Course_Subject object.

            Args:
                None

            Returns:
                str: A string representing the Student_Course_Subject object,
                     likely its name or identifying information.
        """
        return self.name_course


class Student_Course_Subject(models.Model):
    """
    Represents the relationship between a student, course, and subject.

        This class stores information linking students to specific courses and subjects,
        potentially managed by an expert/instructor.

        Attributes:
            id_student: The unique identifier of the student.
            id_subject: The unique identifier of the subject.
            id_expert: The unique identifier of the expert or instructor associated with this relationship.
    """

    id_student = models.IntegerField(null=True, blank=True)
    id_subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="course_id_subject"
    )
    id_expert = models.IntegerField(null=True, blank=True)

    # def __str__(self):
    #     return self.id_expert
