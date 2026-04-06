from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.apps import apps
from courses.serializers import CourseSerializer

User = get_user_model()

# ✅ Register (PUBLIC)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# ✅ Login (PUBLIC) — YOU MUST ADD THIS FIX
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    # your login logic here
    ...
    

# ✅ Profile (PROTECTED)
Enrollment = apps.get_model('enrollments', 'Enrollment')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user

    enrollments = Enrollment.objects.filter(user=user)
    enrolled_courses = [e.course for e in enrollments]

    return Response({
        "username": user.username,
        "email": user.email,
        "courses": CourseSerializer(enrolled_courses, many=True).data
    })