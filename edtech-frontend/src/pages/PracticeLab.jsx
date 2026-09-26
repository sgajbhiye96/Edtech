import { useMemo, useState } from "react";
import API from "../services/api";

const PROBLEMS = [
  { id: 1, category: "Python", difficulty: "Easy", title: "Two Sum", prompt: "Given a list of integers and a target, return the indices of two numbers whose sum equals the target.", starter: "def two_sum(nums, target):\n    # write your solution\n    pass", solution: "Use a hash map to store each number's index while scanning the list once." },
  { id: 2, category: "Python", difficulty: "Easy", title: "First Non-Repeating Character", prompt: "Return the first character in a string that occurs exactly once.", starter: "def first_unique(s):\n    pass", solution: "Count characters first, then scan the string again and return the first character with count 1." },
  { id: 3, category: "Python", difficulty: "Medium", title: "Group Anagrams", prompt: "Group words that are anagrams of one another.", starter: "def group_anagrams(words):\n    pass", solution: "Use a sorted-word or 26-character frequency tuple as the dictionary key." },
  { id: 4, category: "Python", difficulty: "Medium", title: "Sliding Window Maximum", prompt: "Find the maximum value in every window of size k.", starter: "from collections import deque\n\ndef max_window(nums, k):\n    pass", solution: "Use a monotonic deque to maintain candidate indices in decreasing value order." },
  { id: 5, category: "Machine Learning", difficulty: "Easy", title: "Train/Test Split", prompt: "Why should a model be evaluated on data that was not used during training?", starter: "Your answer:\n", solution: "To estimate how well the trained model generalizes to unseen data." },
  { id: 6, category: "Machine Learning", difficulty: "Easy", title: "Precision vs Recall", prompt: "For a fraud detection system where missing fraud is very costly, which metric should receive strong attention and why?", starter: "Your answer:\n", solution: "Recall, because it measures how many of the actual positive fraud cases were detected." },
  { id: 7, category: "Machine Learning", difficulty: "Medium", title: "Feature Scaling", prompt: "When is standardization especially useful for machine learning models?", starter: "Your answer:\n", solution: "It is useful for scale-sensitive algorithms such as logistic regression, SVM, k-nearest neighbors and neural networks." },
  { id: 8, category: "Machine Learning", difficulty: "Medium", title: "Overfitting", prompt: "Name two practical techniques to reduce overfitting.", starter: "Your answer:\n", solution: "Examples include cross-validation, regularization, dropout, early stopping, reducing model complexity and collecting more data." },
  { id: 9, category: "MySQL", difficulty: "Easy", title: "Second Highest Salary", prompt: "Write a query to return the second highest distinct salary from employees.", starter: "SELECT ...", solution: "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);" },
  { id: 10, category: "MySQL", difficulty: "Easy", title: "Department Counts", prompt: "Return each department and the number of employees in it.", starter: "SELECT ...", solution: "SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;" },
  { id: 11, category: "MySQL", difficulty: "Medium", title: "Top Earners", prompt: "Return employees whose salary is greater than the average salary of all employees.", starter: "SELECT ...", solution: "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);" },
  { id: 12, category: "MySQL", difficulty: "Medium", title: "Latest Order Per Customer", prompt: "Return the latest order for every customer.", starter: "SELECT ...", solution: "Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) and filter row_number = 1." },
  { id: 13, category: "Excel", difficulty: "Easy", title: "Conditional Total", prompt: "Calculate total sales in column B only when region in column A is 'West'.", starter: "Formula:", solution: "=SUMIF(A:A,"West",B:B)" },
  { id: 14, category: "Excel", difficulty: "Easy", title: "Lookup Customer", prompt: "Return a customer's city from a customer table using their customer ID.", starter: "Formula:", solution: "Use XLOOKUP, for example: =XLOOKUP(E2,A:A,C:C,"Not Found")" },
  { id: 15, category: "Excel", difficulty: "Medium", title: "Duplicate Detection", prompt: "Write a formula that marks a value in A2 as Duplicate when it appears more than once in column A.", starter: "Formula:", solution: '=IF(COUNTIF(A:A,A2)>1,"Duplicate","Unique")' },
  { id: 16, category: "Excel", difficulty: "Medium", title: "Monthly Sales", prompt: "How would you summarize sales by month from a transaction date and amount column?", starter: "Your answer:", solution: "Create a PivotTable, group the date field by Months/Years, and aggregate Amount using Sum." },
];

const CATEGORIES = ["All", "Python", "Machine Learning", "MySQL", "Excel"];

export default function PracticeLab() {
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(1);
  const [answer, setAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("practice_completed") || "[]"));
  const [profile, setProfile] = useState({ xp: 0, solved_count: 0, current_streak: 0 });

  const filtered = useMemo(
    () => category === "All" ? PROBLEMS : PROBLEMS.filter((p) => p.category === category),
    [category]
  );
  const problem = PROBLEMS.find((p) => p.id === selectedId) || filtered[0];

  const selectProblem = (id) => {
    setSelectedId(id);
    setAnswer("");
    setMessage("");
    setShowSolution(false);
  };

  const submit = async () => {
    if (!answer.trim()) {
      setMessage("Write an answer before submitting.");
      return;
    }
    try {
      const res = await API.post("/practice/attempts/", { problem: problem.id, answer });
      setProfile(res.data.profile || profile);
      if (res.data.attempt?.status === "PASSED") {
        const next = [...new Set([...completed, problem.id])];
        setCompleted(next);
        localStorage.setItem("practice_completed", JSON.stringify(next));
      }
      setMessage(res.data.message || "Submission recorded.");
    } catch (err) {
      setMessage(err?.response?.data?.detail || "Unable to submit. Please login again and retry.");
    }
  };

  const selectCategory = (value) => {
    setCategory(value);
    const next = PROBLEMS.find((p) => value === "All" || p.category === value);
    if (next) selectProblem(next.id);
  };

  return (
    <main className="min-h-screen bg-[#F6F4ED] text-[#12172B] font-['Inter',sans-serif]">
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2A93B]/15 text-[#8A5B12] text-xs font-bold uppercase tracking-wider">Practice Lab</div>
          <h1 className="font-['Sora',sans-serif] text-3xl md:text-4xl font-extrabold mt-3">Practice. Build. Get job-ready.</h1>
          <p className="text-[#5C6380] mt-2 max-w-2xl">LeetCode-style practice for Python, Machine Learning, MySQL and Excel — built for Innovation AI Labs learners.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="px-4 py-2 rounded-full bg-white border border-[#E4E0D2] text-sm font-semibold">XP: {profile.xp}</div>
          <div className="px-4 py-2 rounded-full bg-white border border-[#E4E0D2] text-sm font-semibold">Streak: {profile.current_streak} 🔥</div>
          <div className="px-4 py-2 rounded-full bg-white border border-[#E4E0D2] text-sm font-semibold">Solved: {profile.solved_count}</div>
          {CATEGORIES.map((item) => (
            <button key={item} onClick={() => selectCategory(item)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${category === item ? "bg-[#12172B] text-white border-[#12172B]" : "bg-white border-[#E4E0D2] hover:-translate-y-0.5"}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-5">
          <aside className="bg-white border border-[#E4E0D2] rounded-xl p-3 h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between px-2 pb-3 border-b border-[#E4E0D2]">
              <span className="font-bold">Problems</span>
              <span className="text-xs text-[#5C6380]">{completed.length}/{PROBLEMS.length} solved</span>
            </div>
            <div className="mt-2 space-y-1 max-h-[520px] overflow-auto">
              {filtered.map((item) => (
                <button key={item.id} onClick={() => selectProblem(item.id)} className={`w-full text-left p-3 rounded-lg transition-all ${problem.id === item.id ? "bg-[#F2A93B]/15 border border-[#F2A93B]/40" : "hover:bg-[#F6F4ED]"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#7A8098]">{item.id}.</span>
                    <span className="font-semibold text-sm flex-1">{item.title}</span>
                    {completed.includes(item.id) && <span className="text-green-600 text-sm">✓</span>}
                  </div>
                  <div className="mt-1 ml-5 text-[11px] text-[#7A8098]">{item.difficulty}</div>
                </button>
              ))}
            </div>
          </aside>

          <section className="bg-white border border-[#E4E0D2] rounded-xl overflow-hidden">
            <div className="p-5 md:p-7 border-b border-[#E4E0D2]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#12172B] text-white">{problem.category}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F6F4ED]">{problem.difficulty}</span>
              </div>
              <h2 className="font-['Sora',sans-serif] text-2xl font-bold">{problem.title}</h2>
              <p className="mt-3 text-[#4E5572] leading-7">{problem.prompt}</p>
            </div>

            <div className="p-5 md:p-7">
              <label className="block text-sm font-bold mb-2">Your solution</label>
              <textarea value={answer || problem.starter} onChange={(e) => setAnswer(e.target.value)} className="w-full min-h-[260px] rounded-lg border border-[#D8D5CA] bg-[#101522] text-[#F6F4ED] p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#F2A93B]" spellCheck="false" />
              <div className="flex flex-wrap gap-3 mt-4">
                <button onClick={submit} className="px-5 py-2.5 rounded-lg bg-[#F2A93B] text-[#12172B] font-bold hover:-translate-y-0.5 transition-all">Submit</button>
                <button onClick={() => setShowSolution(!showSolution)} className="px-5 py-2.5 rounded-lg border border-[#12172B]/20 font-semibold hover:bg-[#F6F4ED] transition-all">{showSolution ? "Hide solution" : "View solution"}</button>
              </div>
              {message && <p className="mt-4 text-sm font-semibold text-[#49634D]">{message}</p>}
              {showSolution && (
                <div className="mt-5 p-4 rounded-lg bg-[#F6F4ED] border border-[#E4E0D2]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#8A5B12] mb-2">Solution approach</div>
                  <p className="text-sm text-[#3F4662] whitespace-pre-wrap">{problem.solution}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
