from django.db import migrations

PROBLEMS = [
("Two Sum","Python","Easy","CODE","Given a list of integers and a target, return the indices of two numbers whose sum equals the target.","def two_sum(nums, target):\n    pass","Use a hash map to store each number's index while scanning once."),
("First Non-Repeating Character","Python","Easy","CODE","Return the first character in a string that occurs exactly once.","def first_unique(s):\n    pass","Count characters first, then scan the string again."),
("Group Anagrams","Python","Medium","CODE","Group words that are anagrams of one another.","def group_anagrams(words):\n    pass","Use a sorted-word or frequency tuple as the dictionary key."),
("Sliding Window Maximum","Python","Medium","CODE","Find the maximum value in every window of size k.","def max_window(nums, k):\n    pass","Use a monotonic deque to maintain candidate indices."),
("Train/Test Split","Machine Learning","Easy","CONCEPT","Why should a model be evaluated on data that was not used during training?","","To estimate how well the trained model generalizes to unseen data."),
("Precision vs Recall","Machine Learning","Easy","CONCEPT","For fraud detection where missing fraud is costly, which metric should receive strong attention and why?","","Recall measures how many actual positive fraud cases were detected."),
("Feature Scaling","Machine Learning","Medium","CONCEPT","When is standardization especially useful for machine learning models?","","For scale-sensitive algorithms such as logistic regression, SVM, KNN and neural networks."),
("Overfitting","Machine Learning","Medium","CONCEPT","Name two practical techniques to reduce overfitting.","","Examples include cross-validation, regularization, dropout, early stopping and reducing model complexity."),
("Second Highest Salary","MySQL","Easy","SQL","Write a query to return the second highest distinct salary from employees.","SELECT ...","SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);"),
("Department Counts","MySQL","Easy","SQL","Return each department and the number of employees in it.","SELECT ...","SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;"),
("Top Earners","MySQL","Medium","SQL","Return employees whose salary is greater than the average salary of all employees.","SELECT ...","SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"),
("Latest Order Per Customer","MySQL","Medium","SQL","Return the latest order for every customer.","SELECT ...","Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) and filter row_number = 1."),
("Conditional Total","Excel","Easy","EXCEL","Calculate total sales in column B only when region in column A is West.","Formula:","=SUMIF(A:A,\"West\",B:B)"),
("Lookup Customer","Excel","Easy","EXCEL","Return a customer's city from a customer table using their customer ID.","Formula:","Use XLOOKUP, for example =XLOOKUP(E2,A:A,C:C,\"Not Found\")"),
("Duplicate Detection","Excel","Medium","EXCEL","Mark A2 as Duplicate when it appears more than once in column A.","Formula:","=IF(COUNTIF(A:A,A2)>1,\"Duplicate\",\"Unique\")"),
("Monthly Sales","Excel","Medium","EXCEL","How would you summarize sales by month from transaction date and amount columns?","Your answer:","Create a PivotTable, group the date field by Months/Years and aggregate Amount using Sum."),
]

def seed(apps, schema_editor):
    Problem = apps.get_model("practice", "PracticeProblem")
    for title, category, difficulty, problem_type, prompt, starter, solution in PROBLEMS:
        Problem.objects.get_or_create(
            title=title,
            defaults={
                "category": category,
                "difficulty": difficulty,
                "problem_type": problem_type,
                "prompt": prompt,
                "starter_code": starter,
                "solution": solution,
                "xp": 10,
            },
        )

def unseed(apps, schema_editor):
    apps.get_model("practice", "PracticeProblem").objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [("practice", "0001_initial")]
    operations = [migrations.RunPython(seed, unseed)]
