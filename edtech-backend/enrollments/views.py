from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from courses.models import Assignment, Batch, LearningResource, LiveClass, Project
from .models import Enrollment, Progress
from .serializers import EnrollmentSerializer, ProgressSerializer


class EnrollView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.select_related("batch", "batch__course").filter(user=self.request.user)


class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = list(Enrollment.objects.select_related("batch", "batch__course").filter(user=request.user, status="ACTIVE"))
        batch_ids = [e.batch_id for e in enrollments]
        live_classes = list(LiveClass.objects.select_related("batch", "batch__course").filter(batch_id__in=batch_ids))
        live_classes.sort(key=lambda item: item.scheduled_at)
        now = timezone.now()
        upcoming = next((item for item in live_classes if item.scheduled_at >= now), None)

        course_ids = {e.batch.course_id for e in enrollments}
        lesson_counts = {course_id: Batch.objects.get(pk=next(e.batch_id for e in enrollments if e.batch.course_id == course_id)).course.lessons.count() for course_id in course_ids}
        completed_counts = {course_id: Progress.objects.filter(user=request.user, lesson__course_id=course_id, completed=True).count() for course_id in course_ids}

        def progress(course_id):
            total = lesson_counts.get(course_id, 0)
            completed = min(completed_counts.get(course_id, 0), total)
            return {"completed": completed, "total": total, "percent": round(completed * 100 / total) if total else 0}

        def enrollment_data(e):
            batch, course = e.batch, e.batch.course
            return {
                "id": e.id, "status": e.status, "enrolled_at": e.enrolled_at,
                "batch": {"id": batch.id, "name": batch.name, "start_date": batch.start_date, "end_date": batch.end_date, "status": batch.status},
                "course": {"id": course.id, "title": course.title, "description": course.description, "thumbnail": course.thumbnail.url if course.thumbnail else None},
                "progress": progress(course.id),
            }

        def live_data(item):
            return {
                "id": item.id, "batch_id": item.batch_id, "batch_name": item.batch.name, "course_title": item.batch.course.title,
                "title": item.title, "description": item.description, "scheduled_at": item.scheduled_at,
                "duration_minutes": item.duration_minutes, "meeting_url": item.meeting_url,
                "recording_url": item.recording_url if item.recording_available else "",
                "recording_available": item.recording_available,
            }

        resources = LearningResource.objects.filter(batch_id__in=batch_ids)
        assignments = Assignment.objects.filter(batch_id__in=batch_ids)
        projects = Project.objects.filter(batch_id__in=batch_ids)

        return Response({
            "profile": {"username": request.user.username, "email": request.user.email},
            "enrollments": [enrollment_data(e) for e in enrollments],
            "next_live_class": live_data(upcoming) if upcoming else None,
            "live_classes": [live_data(x) for x in live_classes],
            "recordings": [live_data(x) for x in live_classes if x.recording_available and x.recording_url],
            "resources": [{"id": x.id, "batch_id": x.batch_id, "title": x.title, "description": x.description, "resource_type": x.resource_type, "url": x.url, "created_at": x.created_at} for x in resources],
            "assignments": [{"id": x.id, "batch_id": x.batch_id, "title": x.title, "description": x.description, "due_at": x.due_at, "submission_url": x.submission_url, "created_at": x.created_at} for x in assignments],
            "projects": [{"id": x.id, "batch_id": x.batch_id, "title": x.title, "description": x.description, "repository_url": x.repository_url, "created_at": x.created_at} for x in projects],
        })


class ProgressUpdateView(generics.UpdateAPIView):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user)
