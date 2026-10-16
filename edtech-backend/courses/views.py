from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser

from enrollments.models import Enrollment
from rest_framework.response import Response

from .models import Course, Batch, LiveClass, LearningResource, Assignment, Project
from .serializers import CourseSerializer, BatchSerializer, LiveClassSerializer, LearningResourceSerializer, AssignmentSerializer, ProjectSerializer


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseCreateView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]


class BatchListView(generics.ListAPIView):
    serializer_class = BatchSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Batch.objects.select_related("course").filter(course__is_active=True, registration_open=True)
        course_id = self.request.query_params.get("course")
        return queryset.filter(course_id=course_id) if course_id else queryset


class BatchDetailView(generics.RetrieveAPIView):
    queryset = Batch.objects.select_related("course").filter(course__is_active=True)
    serializer_class = BatchSerializer
    permission_classes = [permissions.AllowAny]


class BatchCreateView(generics.CreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [permissions.IsAdminUser]


def _enrolled_batch_ids(user):
    return Enrollment.objects.filter(user=user, status="ACTIVE").values_list("batch_id", flat=True)


class LiveClassListView(generics.ListAPIView):
    serializer_class = LiveClassSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LiveClass.objects.select_related("batch", "batch__course").filter(batch_id__in=_enrolled_batch_ids(self.request.user))
        batch_id = self.request.query_params.get("batch")
        return queryset.filter(batch_id=batch_id) if batch_id else queryset


class LiveClassCreateView(generics.CreateAPIView):
    queryset = LiveClass.objects.all()
    serializer_class = LiveClassSerializer
    permission_classes = [permissions.IsAdminUser]


class LearningResourceListView(generics.ListAPIView):
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LearningResource.objects.filter(batch_id__in=_enrolled_batch_ids(self.request.user))
        batch_id = self.request.query_params.get("batch")
        return queryset.filter(batch_id=batch_id) if batch_id else queryset


class LearningResourceCreateView(generics.CreateAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAdminUser]


class AssignmentListView(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Assignment.objects.filter(batch_id__in=_enrolled_batch_ids(self.request.user))
        batch_id = self.request.query_params.get("batch")
        return queryset.filter(batch_id=batch_id) if batch_id else queryset


class AssignmentCreateView(generics.CreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAdminUser]


class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Project.objects.filter(batch_id__in=_enrolled_batch_ids(self.request.user))
        batch_id = self.request.query_params.get("batch")
        return queryset.filter(batch_id=batch_id) if batch_id else queryset


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminBatchListView(generics.ListAPIView):
    queryset = Batch.objects.select_related("course").all()
    serializer_class = BatchSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminBatchStudentsView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        batch = Batch.objects.get(pk=pk)
        enrollments = Enrollment.objects.select_related("user").filter(batch=batch)
        return Response([
            {
                "id": enrollment.id,
                "username": enrollment.user.username,
                "email": enrollment.user.email,
                "status": enrollment.status,
                "enrolled_at": enrollment.enrolled_at,
            }
            for enrollment in enrollments
        ])


class AdminBatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminLiveClassListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = LiveClassSerializer

    def get_queryset(self):
        return LiveClass.objects.select_related("batch").filter(batch_id=self.request.query_params.get("batch"))


class AdminLiveClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LiveClass.objects.all()
    serializer_class = LiveClassSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminLearningResourceListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = LearningResourceSerializer

    def get_queryset(self):
        return LearningResource.objects.filter(batch_id=self.request.query_params.get("batch"))


class AdminLearningResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminAssignmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AssignmentSerializer

    def get_queryset(self):
        return Assignment.objects.filter(batch_id=self.request.query_params.get("batch"))


class AdminAssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminProjectListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(batch_id=self.request.query_params.get("batch"))


class AdminProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]
