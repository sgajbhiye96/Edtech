from django.test import TestCase
from rest_framework.test import APIClient

from .models import Course


class CourseListApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_course_list_is_public_and_returns_active_courses(self):
        active_course = Course.objects.create(
            title="Public AI Course",
            description="A test course",
            price="4999.00",
            is_active=True,
        )
        Course.objects.create(
            title="Hidden Course",
            description="An inactive course",
            price="1000.00",
            is_active=False,
        )

        response = self.client.get("/api/courses/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], active_course.id)
        self.assertEqual(response.data[0]["title"], "Public AI Course")
        self.assertEqual(str(response.data[0]["price"]), "4999.00")
