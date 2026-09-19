from django.urls import path

from .views import (
    AdminPaymentListView,
    CreateOrderView,
    PaymentHistoryView,
    VerifyPaymentView,
    WebhookView,
)

urlpatterns = [
    path("create-order/", CreateOrderView.as_view(), name="create-order"),
    path("verify/", VerifyPaymentView.as_view(), name="verify-payment"),
    path("webhook/", WebhookView.as_view(), name="payment-webhook"),
    path("history/", PaymentHistoryView.as_view(), name="payment-history"),
    path("admin/all/", AdminPaymentListView.as_view(), name="admin-payments"),
]
