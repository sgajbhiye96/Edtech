import os
import requests

RUNNER_URL = os.environ.get("PRACTICE_RUNNER_URL", "").rstrip("/")
RUNNER_TIMEOUT = float(os.environ.get("PRACTICE_RUNNER_TIMEOUT", "15"))
RUNNER_TOKEN = os.environ.get("PRACTICE_RUNNER_TOKEN", "")


class RunnerUnavailable(Exception):
    pass


def run_python(*, code, function_name, test_cases):
    if not RUNNER_URL or not RUNNER_TOKEN:
        raise RunnerUnavailable("Practice runner is not configured.")

    try:
        response = requests.post(
            f"{RUNNER_URL}/run",
            headers={"X-Practice-Runner-Token": RUNNER_TOKEN},
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
