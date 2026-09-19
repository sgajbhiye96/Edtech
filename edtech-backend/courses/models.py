from django.db import models
from cloudinary_storage.storage import RawMediaCloudinaryStorage


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail = models.ImageField(upload_to="thumbnails/", blank=True, null=True)
    syllabus = models.FileField(
        upload_to="syllabus/",
        blank=True,
        null=True,
        storage=RawMediaCloudinaryStorage(),
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Batch(models.Model):
    STATUS_CHOICES = [
        ("UPCOMING", "Upcoming"),
        ("ONGOING", "Ongoing"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    course = models.ForeignKey(Course, related_name="batches", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    max_students = models.PositiveIntegerField(default=30)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    early_bird_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    registration_open = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="UPCOMING")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date", "name"]

    def __str__(self):
        return f"{self.course.title} - {self.name}"


class LiveClass(models.Model):
    batch = models.ForeignKey(Batch, related_name="live_classes", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=120)
    meeting_url = models.URLField(blank=True)
    recording_url = models.URLField(blank=True)
    recording_available = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.batch.name} - {self.title}"


class LearningResource(models.Model):
    RESOURCE_TYPES = [
        ("LINK", "Link"),
        ("FILE", "File"),
        ("NOTE", "Note"),
    ]

    batch = models.ForeignKey(Batch, related_name="resources", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES, default="LINK")
    url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.batch.name} - {self.title}"


class Assignment(models.Model):
    batch = models.ForeignKey(Batch, related_name="assignments", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    submission_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["due_at", "-created_at"]

    def __str__(self):
        return f"{self.batch.name} - {self.title}"


class Project(models.Model):
    batch = models.ForeignKey(Batch, related_name="projects", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    repository_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.batch.name} - {self.title}"


class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name="lessons", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    video_url = models.CharField(max_length=255)
    position = models.IntegerField()

    def __str__(self):
        return self.title
