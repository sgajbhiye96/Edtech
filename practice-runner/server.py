import json
import os
import subprocess
import tempfile
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


MAX_CODE = 20000
MAX_TESTS = 20
CASE_TIMEOUT = 3
TOTAL_TIMEOUT = 10
PYTHON_IMAGE = os.environ.get("PRACTICE_PYTHON_IMAGE", "python:3.12-alpine")


def normalize(value):
    if isinstance(value, tuple):
        return [normalize(v) for v in value]
    if isinstance(value, list):
        return [normalize(v) for v in value]
    if isinstance(value, dict):
        return {str(k): normalize(v) for k, v in value.items()}
    return value


def canonicalize(value, mode):
    value = normalize(value)
    if mode == "anagrams" and isinstance(value, list):
        return sorted([sorted(item) if isinstance(item, list) else item for item in value], key=lambda x: json.dumps(x, sort_keys=True))
    return value


def build_harness(function_name, test_cases):
    return f"""
import json
import time
import traceback

SOURCE = open('/workspace/submission.py', 'r', encoding='utf-8').read()
namespace = {{}}
exec(compile(SOURCE, '<submission>', 'exec'), namespace)
fn = namespace.get({function_name!r})
if not callable(fn):
    raise RuntimeError('Expected function {function_name} was not defined')

cases = {json.dumps(test_cases)}
results = []
started = time.perf_counter()

for index, case in enumerate(cases, start=1):
    case_started = time.perf_counter()
    try:
        args = case.get('args', [])
        kwargs = case.get('kwargs', {{}})
        actual = fn(*args, **kwargs)
        expected = case.get('expected')
        mode = case.get('sort_result')
        actual_cmp = {__import__("builtins").__name__ and "canonicalize(actual, mode)"}
        expected_cmp = {__import__("builtins").__name__ and "canonicalize(expected, mode)"}
        passed = actual_cmp == expected_cmp
        results.append({{
            'case': index,
            'status': 'PASSED' if passed else 'FAILED',
            'expected': expected,
            'actual': actual,
            'runtime_ms': round((time.perf_counter() - case_started) * 1000, 2),
        }})
    except Exception as exc:
        results.append({{
            'case': index,
            'status': 'ERROR',
            'error': str(exc),
            'traceback': traceback.format_exc(limit=3),
            'runtime_ms': round((time.perf_counter() - case_started) * 1000, 2),
        }})

passed = sum(1 for item in results if item['status'] == 'PASSED')
print(json.dumps({{
    'status': 'PASSED' if passed == len(results) else 'FAILED',
    'passed': passed,
    'total': len(results),
    'results': results,
    'runtime_ms': round((time.perf_counter() - started) * 1000, 2),
}}))
"""


def execute(payload):
    if payload.get("language") != "python":
        return {"status": "ERROR", "message": "Only Python is supported by this runner."}

    code = str(payload.get("code", ""))
    function_name = str(payload.get("function_name", ""))
    test_cases = payload.get("test_cases", [])

    if not code.strip():
        return {"status": "ERROR", "message": "Code is required."}
    if len(code) > MAX_CODE:
        return {"status": "ERROR", "message": "Code is too large."}
    if not function_name or not function_name.replace("_", "").isalnum():
        return {"status": "ERROR", "message": "Invalid function name."}
    if not isinstance(test_cases, list) or not test_cases or len(test_cases) > MAX_TESTS:
        return {"status": "ERROR", "message": "Invalid test cases."}

    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / "submission.py").write_text(code, encoding="utf-8")
        (root / "harness.py").write_text(build_harness(function_name, test_cases), encoding="utf-8")

        command = [
            "docker", "run", "--rm", "--pull=never",
            "--network", "none",
            "--read-only",
            "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
            "--memory", "128m",
            "--memory-swap", "128m",
            "--cpus", "0.50",
            "--pids-limit", "64",
            "--cap-drop", "ALL",
            "--security-opt", "no-new-privileges",
            "--user", "65534:65534",
            "-v", f"{root}:/workspace:ro",
            "-e", "PYTHONDONTWRITEBYTECODE=1",
            PYTHON_IMAGE,
            "python", "-I", "/workspace/harness.py",
        ]

        started = time.perf_counter()
        try:
            completed = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=TOTAL_TIMEOUT,
                check=False,
            )
        except subprocess.TimeoutExpired:
            return {"status": "TIMEOUT", "message": "Execution timed out."}
        except OSError as exc:
            return {"status": "UNAVAILABLE", "message": f"Runner host error: {exc}"}

    if completed.returncode != 0:
        stderr = completed.stderr.strip()
        return {"status": "ERROR", "message": stderr[-4000:] or "Execution failed."}

    try:
        result = json.loads(completed.stdout.strip().splitlines()[-1])
    except (ValueError, IndexError):
        return {"status": "ERROR", "message": "Runner returned invalid output."}

    result["runner_ms"] = round((time.perf_counter() - started) * 1000, 2)
    return result


class Handler(BaseHTTPRequestHandler):
    def _send(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != "/run":
            self._send(404, {"status": "ERROR", "message": "Not found."})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 50000:
                self._send(413, {"status": "ERROR", "message": "Request too large."})
                return
            payload = json.loads(self.rfile.read(length))
            self._send(200, execute(payload))
        except Exception as exc:
            self._send(400, {"status": "ERROR", "message": str(exc)})

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", int(os.environ.get("PORT", "8080"))), Handler)
    server.serve_forever()
