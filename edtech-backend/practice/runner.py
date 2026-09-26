import os
import requests

RUNNER_URL = os.environ.get("PRACTICE_RUNNER_URL", "").rstrip("/")
RUNNER_TIMEOUT = float(os.environ.get("PRACTICE_RUNNER_TIMEOUT", "15"))


class RunnerUnavailable(Exception):
    pass


def run_python(*, code, function_name, test_cases):
    if not RUNNER_URL:
        raise RunnerUnavailable("Practice runner is not configured.")

    try:
        response = requests.post(
            f"{RUNNER_URL}/run",
            json={
                "language": "python",
                "code": code,
                "function_name": function_name,
                "test_cases": test_cases,
            },
            timeout=RUNNER_TIMEOUT,
        )
    except requests.RequestException as exc:
        raise RunnerUnavailable("Practice runner is unavailable.") from exc

    if response.status_code != 200:
        raise RunnerUnavailable("Practice runner returned an invalid response.")

    data = response.json()
    if not isinstance(data, dict):
        raise RunnerUnavailable("Practice runner returned an invalid payload.")
    return data
