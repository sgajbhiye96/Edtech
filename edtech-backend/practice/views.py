from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PracticeProblem, PracticeAttempt, PracticeProfile
from .serializers import PracticeProblemSerializer, PracticeAttemptSerializer, PracticeProfileSerializer

class ProblemListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PracticeProblemSerializer
    def get_queryset(self):
        qs = PracticeProblem.objects.filter(is_active=True)
        category = self.request.query_params.get("category")
        if category and category != "All":
            qs = qs.filter(category=category)
        return qs

class ProblemDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PracticeProblemSerializer
    queryset = PracticeProblem.objects.filter(is_active=True)

class SubmitAttemptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        problem_id = request.data.get("problem")
        answer = str(request.data.get("answer", "")).strip()
        if not answer:
            return Response({"detail": "Answer is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            problem = PracticeProblem.objects.get(id=problem_id, is_active=True)
        except PracticeProblem.DoesNotExist:
            return Response({"detail": "Problem not found."}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = PracticeProfile.objects.get_or_create(user=request.user)
        already_solved = PracticeAttempt.objects.filter(
            user=request.user, problem=problem, status="PASSED"
        ).exists()

        attempt = PracticeAttempt.objects.create(
            user=request.user,
            problem=problem,
            answer=answer,
            status="SUBMITTED",
            xp_awarded=0,
        )

        # Code/SQL execution is deliberately not performed inside Django.
        # This endpoint records the submission; a sandbox runner can later mark it PASSED.
        if problem.problem_type in {"CONCEPT", "EXCEL"}:
            attempt.status = "PASSED"
            attempt.xp_awarded = 0 if already_solved else problem.xp
            attempt.save(update_fields=["status", "xp_awarded"])

            if not already_solved:
                profile.xp += problem.xp
                profile.solved_count += 1
                today = timezone.localdate()
                if profile.last_practice_date == today - timedelta(days=1):
                    profile.current_streak += 1
                elif profile.last_practice_date != today:
                    profile.current_streak = 1
                profile.last_practice_date = today
                profile.save()
        return Response({
            "attempt": PracticeAttemptSerializer(attempt).data,
            "profile": PracticeProfileSerializer(profile).data,
            "message": "Submission recorded. Code/SQL problems are queued for sandbox execution in the next engine phase."
        }, status=status.HTTP_201_CREATED)

class PracticeProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PracticeProfileSerializer
    def get_object(self):
        profile, _ = PracticeProfile.objects.get_or_create(user=self.request.user)
        return profile

class LeaderboardView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PracticeProfileSerializer
    queryset = PracticeProfile.objects.select_related("user").order_by("-xp", "-solved_count")[:50]

    def list(self, request, *args, **kwargs):
        rows = self.get_queryset()
        return Response([
            {
                "rank": index,
                "username": row.user.username,
                "xp": row.xp,
                "solved_count": row.solved_count,
                "current_streak": row.current_streak,
            }
            for index, row in enumerate(rows, start=1)
        ])
