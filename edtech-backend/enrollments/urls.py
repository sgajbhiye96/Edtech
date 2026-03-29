from django.urls import path
from .views import EnrollView, UserEnrollmentsView

urlpatterns = [
    path('enroll/', EnrollView.as_view()),
    path('my-courses/', UserEnrollmentsView.as_view()),
]