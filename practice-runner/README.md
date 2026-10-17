# Practice Python Runner

This service is intentionally separate from Django. It accepts Python submissions and runs each submission inside a short-lived hardened Docker container.

## Required host setup

The runner host must have Docker installed and the Python image pre-pulled:

`docker pull python:3.12-alpine`

The runner service needs access to the Docker socket because it launches one isolated child container per execution. Do not expose this service directly to the public internet.

## Hardening applied to child containers

- no network
- read-only root filesystem
- small writable /tmp
- 128 MB memory
- 0.5 CPU
- 64 process limit
- all Linux capabilities dropped
- no-new-privileges
- non-root UID
- short execution timeout

For higher-assurance production isolation, move execution to a dedicated sandbox host using gVisor or another hardened runtime.

## API

POST /run

```json
{
  "language": "python",
  "code": "def two_sum(nums, target): ...",
  "function_name": "two_sum",
  "test_cases": [
    {"args": [[2, 7, 11, 15], 9], "expected": [0, 1]}
  ]
}
```
