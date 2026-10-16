from django.urls import path
from .views import ProblemListView, ProblemDetailView, RunProblemView, SubmitAttemptView, PracticeProfileView, LeaderboardView

urlpatterns = [
    path("problems/", ProblemListView.as_view()),
    path("problems/<int:pk>/", ProblemDetailView.as_view()),
    path("run/", RunProblemView.as_view()),
    path("attempts/", SubmitAttemptView.as_view()),
    path("profile/", PracticeProfileView.as_view()),
    path("leaderboard/", LeaderboardView.as_view()),
]
