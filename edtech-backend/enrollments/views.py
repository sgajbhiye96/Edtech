from django.db.models import Prefetch
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
        return Enrollment.objects.select_related(
            "batch",
            "batch__course",
        ).filter(user=self.request.user)


class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = list(
            Enrollment.objects.select_related("batch", "batch__course")
            .filter(user=request.user, status="ACTIVE")
        )
        batch_ids = [enrollment.batch_id for enrollment in enrollments]

        live_classes = list(
            LiveClass.objects.select_related("batch", "batch__course")
            .filter(batch_id__in=batch_ids)
            .order_by("scheduled_at")
        )
        now = timezone.now()
        upcoming = next((item for item in live_classes if item.scheduled_at >= now), None)

        lesson_counts = {}
        completed_counts = {}
        for enrollment in enrollments:
            course_id = enrollment.batch.course_id
            lesson_counts[course_id] = enrollment.batch.course.lessons.count()
            completed_counts[course_id] = Progress.objects.filter(
                user=request.user,
                lesson__course_id=course_id,
                completed=True,
            ).count()

        def course_progress(course_id):
            total = lesson_counts.get(course_id, 0)
            completed = min(completed_counts.get(course_id, 0), total)
            return {
                "completed": completed,
                "total": total,
                "percent": round((completed / total) * 100) if total else 0,
            }

        def serialize_enrollment(enrollment):
            batch = enrollment.batch
            course = batch.course
            return {
                "id": enrollment.id,
                "status": enrollment.status,
                "enrolled_at": enrollment.enrolled_at,
                "batch": {
                    "id": batch.id,
                    "name": batch.name,
                    "start_date": batch.start_date,
                    "end_date": batch.end_date,
                    "status": batch.status,
                },
                "course": {
                    "id": course.id,
                    "title": course.title,
                    "description": course.description,
                    "thumbnail": course.thumbnail.url if course.thumbnail else None,
                },
                "progress": course_progress(course.id),
            }

        def serialize_live_class(item):
            return {
                "id": item.id,
                "batch_id": item.batch_id,
                "batch_name": item.batch.name,
                "course_title": item.batch.course.title,
                "title": item.title,
                "description": item.description,
                "scheduled_at": item.scheduled_at,
                "duration_minutes": item.duration_minutes,
                "meeting_url": item.meeting_url,
                "recording_url": item.recording_url if item.recording_available else "",
                "recording_available": item.recording_available,
            }

        def serialize_resource(item):
            return {
                "id": item.id,
                "batch_id": item.batch_id,
                "title": item.title,
                "description": item.description,
                "resource_type": item.resource_type,
                "url": item.url,
                "created_at": item.created_at,
            }

        def serialize_assignment(item):
            return {
                "id": item.id,
                "batch_id": item.batch_id,
                "title": item.title,
                "description": item.description,
                "due_at": item.due_at,
                "submission_url": item.submission_url,
                "created_at": item.created_at,
            }

        def serialize_project(item):
            return {
                "id": item.id,
                "batch_id": item.batch_id,
                "title": item.title,
                "description": item.description,
                "repository_url": item.repository_url,
                "created_at": item.created_at,
            }

        resources = LearningResource.objects.filter(batch_id__in=batch_ids).order_by("-created_at")
        assignments = Assignment.objects.filter(batch_id__in=batch_ids).order_by("due_at", "-created_at")
        projects = Project.objects.filter(batch_id__in=batch_ids).order_by("-created_at")

        return Response({
            "profile": {
                "username": request.user.username,
                "email": request.user.email,
            },
            "enrollments": [serialize_enrollment(item) for item in enrollments],
            "next_live_class": serialize_live_class(upcoming) if upcoming else None,
            "live_classes": [serialize_live_class(item) for item in live_classes],
            "recordings": [
                serialize_live_class(item)
                for item in live_classes
                if item.recording_available and item.recording_url
            ],
            "resources": [serialize_resource(item) for item in resources],
            "assignments": [serialize_assignment(item) for item in assignments],
            "projects": [serialize_project(item) for item in projects],
        })


class ProgressUpdateView(generics.UpdateAPIView):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user)
