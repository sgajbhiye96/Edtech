from django.urls import path
from .views import EnrollView, UserEnrollmentsView, StudentDashboardView, ProgressUpdateView

urlpatterns = [
    path("enroll/", EnrollView.as_view()),
    path("my-courses/", UserEnrollmentsView.as_view()),
    path("dashboard/", StudentDashboardView.as_view()),
    path("progress/<int:pk>/", ProgressUpdateView.as_view()),
]
