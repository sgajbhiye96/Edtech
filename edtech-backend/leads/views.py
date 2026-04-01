from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from .models import Lead
from .serializers import LeadSerializer
class LeadCreateView(generics.CreateAPIView):
   queryset = Lead.objects.all()
   serializer_class = LeadSerializer
   permission_classes = [AllowAny]
   def perform_create(self, serializer):
       lead = serializer.save()
       # Only send email if admin email is configured
       admin_email = getattr(settings, 'ADMIN_EMAIL', None)
       if admin_email:
           try:
               send_mail(
                   subject=f"New Lead: {lead.name} - {lead.course_interested}",
                   message=f"""
New lead received!
Name: {lead.name}
Email: {lead.email}
Mobile: {lead.mobile}
City: {lead.city}
Course Interested: {lead.course_interested}
                   """,
                   from_email=settings.DEFAULT_FROM_EMAIL,
                   recipient_list=[admin_email],
                   fail_silently=True,
               )
           except Exception:
               pass  # Never crash because of email failure