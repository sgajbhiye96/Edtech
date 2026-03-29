from django.db import models

from django.db import models

from django.db import models
from PIL import Image
import os

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # ✅ Store original image
    thumbnail = models.ImageField(upload_to="thumbnails/", blank=True, null=True)

    def __str__(self):
        return self.title

    # ✅ Auto resize after saving
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.thumbnail:
            thumbnail_path = self.thumbnail.path

            img = Image.open(thumbnail_path)

            # ✅ Set max dimensions (1280×720 recommended)
            max_width = 1280
            max_height = 720

            # ✅ Resize only if image is too big
            if img.height > max_height or img.width > max_width:
                img.thumbnail((max_width, max_height))

                # ✅ Save optimized image
                img.save(thumbnail_path, optimize=True, quality=80)


class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name="lessons", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    video_url = models.CharField(max_length=255)
    position = models.IntegerField()

    def __str__(self):
        return self.title