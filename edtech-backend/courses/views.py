from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Course, Batch, LiveClass
from .serializers import CourseSerializer, BatchSerializer, LiveClassSerializer


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


class CourseCreateView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAdminUser]


class BatchListView(generics.ListAPIView):
    serializer_class = BatchSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Batch.objects.select_related("course").filter(
            course__is_active=True,
            registration_open=True,
        )
        course_id = self.request.query_params.get("course")
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset


class BatchDetailView(generics.RetrieveAPIView):
    queryset = Batch.objects.select_related("course").filter(
        course__is_active=True,
    )
    serializer_class = BatchSerializer
    permission_classes = [AllowAny]


class BatchCreateView(generics.CreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [IsAdminUser]


class LiveClassListView(generics.ListAPIView):
    serializer_class = LiveClassSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = LiveClass.objects.select_related("batch", "batch__course")
        batch_id = self.request.query_params.get("batch")
        if batch_id:
            queryset = queryset.filter(batch_id=batch_id)
        return queryset


class LiveClassCreateView(generics.CreateAPIView):
    queryset = LiveClass.objects.all()
    serializer_class = LiveClassSerializer
    permission_classes = [IsAdminUser]
