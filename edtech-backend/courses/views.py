from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Course
from .serializers import CourseSerializer


# ✅ PUBLIC ENDPOINT (Frontend can access without login)
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


# ✅ PUBLIC ENDPOINT (Course details are also public)
class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


# ✅ PROTECTED (Only admins should create courses)
class CourseCreateView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    parser_classes = [MultiPartParser, FormParser]
    # By default this requires JWT → correct for admin only