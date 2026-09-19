from django.urls import path

from .views import (
    CourseListView,
    CourseDetailView,
    CourseCreateView,
    BatchListView,
    BatchDetailView,
    BatchCreateView,
    LiveClassListView,
    LiveClassCreateView,
    LearningResourceListView,
    LearningResourceCreateView,
    AssignmentListView,
    AssignmentCreateView,
    ProjectListView,
    ProjectCreateView,
)

urlpatterns = [
    path("", CourseListView.as_view(), name="course-list"),
    path("<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    path("admin/create/", CourseCreateView.as_view(), name="course-create"),
    path("batches/", BatchListView.as_view(), name="batch-list"),
    path("batches/<int:pk>/", BatchDetailView.as_view(), name="batch-detail"),
    path("batches/admin/create/", BatchCreateView.as_view(), name="batch-create"),
    path("live-classes/", LiveClassListView.as_view(), name="live-class-list"),
    path("live-classes/admin/create/", LiveClassCreateView.as_view(), name="live-class-create"),
    path("resources/", LearningResourceListView.as_view(), name="resource-list"),
    path("resources/admin/create/", LearningResourceCreateView.as_view(), name="resource-create"),
    path("assignments/", AssignmentListView.as_view(), name="assignment-list"),
    path("assignments/admin/create/", AssignmentCreateView.as_view(), name="assignment-create"),
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/admin/create/", ProjectCreateView.as_view(), name="project-create"),
]
