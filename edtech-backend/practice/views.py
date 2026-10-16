from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PracticeProblem, PracticeAttempt, PracticeProfile
from .serializers import PracticeProblemSerializer, PracticeAttemptSerializer, PracticeProfileSerializer
from .runner import run_python, RunnerUnavailable


def _function_name(problem):
    names = {
        "Two Sum": "two_sum",
        "First Non-Repeating Character": "first_unique",
        "Group Anagrams": "group_anagrams",
        "Sliding Window Maximum": "max_window",
    }
    return names.get(problem.title)


def _run_problem(problem, answer):
    if problem.problem_type != "CODE":
        return {"status": "PASSED", "passed": 1, "total": 1, "results": [{"status": "PASSED"}], "runtime_ms": 0}

    function_name = _function_name(problem)
    if not function_name:
        return {"status": "ERROR", "message": "Python function is not configured for this problem."}

    return run_python(code=answer, function_name=function_name, test_cases=problem.test_cases or [])


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


class RunProblemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        problem_id = request.data.get("problem")
        answer = str(request.data.get("answer", "")).strip()
        if not answer:
            return Response({"detail": "Code is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            problem = PracticeProblem.objects.get(id=problem_id, is_active=True)
        except PracticeProblem.DoesNotExist:
            return Response({"detail": "Problem not found."}, status=status.HTTP_404_NOT_FOUND)

        if problem.category != "Python":
            return Response(
                {"detail": "Python execution is enabled first. SQL and Excel engines will be added separately."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = _run_problem(problem, answer)
        except RunnerUnavailable as exc:
            return Response({"status": "UNAVAILABLE", "message": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(result, status=status.HTTP_200_OK)


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
        already_solved = PracticeAttempt.objects.filter(user=request.user, problem=problem, status="PASSED").exists()

        attempt_status = "SUBMITTED"
        xp_awarded = 0
        execution = None

        if problem.problem_type == "CODE":
            try:
                execution = _run_problem(problem, answer)
            except RunnerUnavailable as exc:
                return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            if execution.get("status") == "PASSED":
                attempt_status = "PASSED"
                xp_awarded = 0 if already_solved else problem.xp
        elif problem.problem_type in {"CONCEPT", "EXCEL"}:
            attempt_status = "PASSED"
            xp_awarded = 0 if already_solved else problem.xp

        attempt = PracticeAttempt.objects.create(
            user=request.user,
            problem=problem,
            answer=answer,
            status=attempt_status,
            xp_awarded=xp_awarded,
        )

        if attempt_status == "PASSED" and not already_solved:
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
            "execution": execution,
            "message": "Accepted. XP awarded." if attempt_status == "PASSED" else "Submission recorded. Fix the failing tests and submit again.",
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
