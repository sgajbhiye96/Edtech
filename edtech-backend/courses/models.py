from django.db import models
class Course(models.Model):
   title = models.CharField(max_length=255)
   description = models.TextField()
   price = models.DecimalField(max_digits=10, decimal_places=2)
   created_at = models.DateTimeField(auto_now_add=True)
   thumbnail = models.ImageField(upload_to="thumbnails/", blank=True, null=True)
   syllabus = models.FileField(upload_to="syllabus/", blank=True, null=True, storage=RawMediaCloudinaryStorage())
   def __str__(self):
       return self.title

class Lesson(models.Model):
   course = models.ForeignKey(Course, related_name="lessons", on_delete=models.CASCADE)
   title = models.CharField(max_length=255)
   video_url = models.CharField(max_length=255)
   position = models.IntegerField()
   def __str__(self):
       return self.title