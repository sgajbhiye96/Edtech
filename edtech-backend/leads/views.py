from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.core.mail import EmailMessage
from django.conf import settings
import requests

from .models import Lead
from .serializers import LeadSerializer
from courses.models import Course


class LeadCreateView(generics.CreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        lead = serializer.save()

        # Find the course syllabus from the course selected in the form.
        course = Course.objects.filter(title=lead.course_interested).first()
        syllabus_url = getattr(course, "syllabus", None) if course else None

        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None)
        admin_email = getattr(settings, "ADMIN_EMAIL", None)

        if not from_email:
            return

        attachment = None
        if syllabus_url:
            try:
                response = requests.get(syllabus_url, timeout=(5, 15))
                response.raise_for_status()
                attachment = response.content
            except requests.RequestException:
                attachment = None

        # Send the syllabus to the student.
        try:
            student_email = EmailMessage(
                subject=f"{lead.course_interested} - Course Syllabus",
                body=(
                    f"Hi {lead.name},\n\n"
                    f"Thank you for your interest in {lead.course_interested} at Innovation AI Labs.\n\n"
                    "Please find the course syllabus attached. "
                    "We will contact you shortly with the next-batch details.\n\n"
                    "Regards,\nInnovation AI Labs"
                ),
                from_email=from_email,
                to=[lead.email],
            )
            if attachment is not None:
                student_email.attach(
                    f"{lead.course_interested}-syllabus.pdf",
                    attachment,
                    "application/pdf",
                )
            elif syllabus_url:
                student_email.body += f"\n\nYou can also view the syllabus here:\n{syllabus_url}"
            student_email.send(fail_silently=True)
        except Exception:
            pass

        # Send the captured lead details to the business/admin email.
        if admin_email:
            try:
                admin_message = EmailMessage(
                    subject=f"New Lead: {lead.name} - {lead.course_interested}",
                    body=(
                        "New lead received!\n\n"
                        f"Name: {lead.name}\n"
                        f"Email: {lead.email}\n"
                        f"Mobile: {lead.mobile}\n"
                        f"City: {lead.city}\n"
                        f"Course Interested: {lead.course_interested}\n"
                    ),
                    from_email=from_email,
                    to=[admin_email],
                )
                admin_message.send(fail_silently=True)
            except Exception:
                pass
