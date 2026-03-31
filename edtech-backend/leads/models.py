from django.db import models
class Lead(models.Model):
   name = models.CharField(max_length=255)
   email = models.EmailField()
   mobile = models.CharField(max_length=(15))
   city = models.CharField(max_length=(100))
   course_interested = models.CharField(max_length=255)
   created_at = models.DateTimeField(auto_now_add=True)
   def __str__(self):
       return f"{self.name} - {self.course_interested}"