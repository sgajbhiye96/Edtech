from django.db import migrations


def seed_python_tests(apps, schema_editor):
    PracticeProblem = apps.get_model("practice", "PracticeProblem")

    cases = {
        "Two Sum": [
            {"args": [[2, 7, 11, 15], 9], "expected": [0, 1]},
            {"args": [[3, 2, 4], 6], "expected": [1, 2]},
            {"args": [[3, 3], 6], "expected": [0, 1]},
        ],
        "First Non-Repeating Character": [
            {"args": ["leetcode"], "expected": "l"},
            {"args": ["loveleetcode"], "expected": "v"},
            {"args": ["aabb"], "expected": None},
        ],
        "Group Anagrams": [
            {
                "args": [["eat", "tea", "tan", "ate", "nat", "bat"]],
                "expected": [["ate", "eat", "tea"], ["nat", "tan"], ["bat"]],
                "sort_result": "anagrams",
            },
            {
                "args": [[""]],
                "expected": [[""]],
                "sort_result": "anagrams",
            },
        ],
        "Sliding Window Maximum": [
            {"args": [[1, 3, -1, -3, 5, 3, 6, 7], 3], "expected": [3, 3, 5, 5, 6, 7]},
            {"args": [[1], 1], "expected": [1]},
        ],
    }

    for title, test_cases in cases.items():
        PracticeProblem.objects.filter(title=title, problem_type="CODE").update(test_cases=test_cases)


def reverse_seed(apps, schema_editor):
    PracticeProblem = apps.get_model("practice", "PracticeProblem")
    PracticeProblem.objects.filter(problem_type="CODE").update(test_cases=[])


class Migration(migrations.Migration):
    dependencies = [
        ("practice", "0002_seed_problems"),
    ]

    operations = [
        migrations.RunPython(seed_python_tests, reverse_seed),
    ]
