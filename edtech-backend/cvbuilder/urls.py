from django.urls import path
from .views import CVSubscriptionView, VerifyCVSubscriptionView, CVSubscriptionWebhookView, ResumeView

urlpatterns = [
    path("subscription/", CVSubscriptionView.as_view()),
    path("subscription/verify/", VerifyCVSubscriptionView.as_view()),
    path("subscription/webhook/", CVSubscriptionWebhookView.as_view()),
    path("resume/", ResumeView.as_view()),
]
