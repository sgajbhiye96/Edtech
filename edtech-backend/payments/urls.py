from django.urls import path
from .views import (
    CreateOrderView,
    VerifyPaymentView,
    WebhookView,
    PaymentHistoryView,
    AdminPaymentListView,
)

urlpatterns = [
    path("create-order/",    CreateOrderView.as_view(),      name="create-order"),
    path("verify/<str:order_id>/", VerifyPaymentView.as_view(), name="verify-payment"),
    path("webhook/",         WebhookView.as_view(),           name="payment-webhook"),
    path("history/",         PaymentHistoryView.as_view(),    name="payment-history"),
    path("admin/all/",       AdminPaymentListView.as_view(),  name="admin-payments"),
]