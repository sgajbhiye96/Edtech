import { useMemo, useState, useEffect } from "react";
import API from "../services/api";

const PROBLEMS = [
  { id: 1, category: "Python", difficulty: "Easy", title: "Two Sum", prompt: "Given a list of integers and a target, return the indices of two numbers whose sum equals the target.", starter: "def two_sum(nums, target):\n    # write your solution\n    pass", solution: "Use a hash map to store each number's index while scanning the list once." },
  { id: 2, category: "Python", difficulty: "Easy", title: "First Non-Repeating Character", prompt: "Return the first character in a string that occurs exactly once.", starter: "def first_unique(s):\n    pass", solution: "Count characters first, then scan the string again and return the first character with count 1." },
  { id: 3, category: "Python", difficulty: "Medium", title: "Group Anagrams", prompt: "Group words that are anagrams of one another.", starter: "def group_anagrams(words):\n    pass", solution: "Use a sorted-word or frequency tuple as the dictionary key." },
  { id: 4, category: "Python", difficulty: "Medium", title: "Sliding Window Maximum", prompt: "Find the maximum value in every window of size k.", starter: "from collections import deque\n\ndef max_window(nums, k):\n    pass", solution: "Use a monotonic deque to maintain candidate indices in decreasing value order." },
  { id: 5, category: "Machine Learning", difficulty: "Easy", title: "Train/Test Split", prompt: "Why should a model be evaluated on data that was not used during training?", starter: "Your answer:\n", solution: "To estimate how well the trained model generalizes to unseen data." },
  { id: 6, category: "Machine Learning", difficulty: "Easy", title: "Precision vs Recall", prompt: "For a fraud detection system where missing fraud is very costly, which metric should receive strong attention and why?", starter: "Your answer:\n", solution: "Recall measures how many actual positive fraud cases were detected." },
  { id: 7, category: "Machine Learning", difficulty: "Medium", title: "Feature Scaling", prompt: "When is standardization especially useful for machine learning models?", starter: "Your answer:\n", solution: "It is useful for scale-sensitive algorithms such as logistic regression, SVM, k-nearest neighbors and neural networks." },
  { id: 8, category: "Machine Learning", difficulty: "Medium", title: "Overfitting", prompt: "Name two practical techniques to reduce overfitting.", starter: "Your answer:\n", solution: "Examples include cross-validation, regularization, dropout, early stopping and reducing model complexity." },
  { id: 9, category: "MySQL", difficulty: "Easy", title: "Second Highest Salary", prompt: "Write a query to return the second highest distinct salary from employees.", starter: "SELECT ...", solution: "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);" },
  { id: 10, category: "MySQL", difficulty: "Easy", title: "Department Counts", prompt: "Return each department and the number of employees in it.", starter: "SELECT ...", solution: "SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;" },
  { id: 11, category: "MySQL", difficulty: "Medium", title: "Top Earners", prompt: "Return employees whose salary is greater than the average salary of all employees.", starter: "SELECT ...", solution: "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);" },
  { id: 12, category: "MySQL", difficulty: "Medium", title: "Latest Order Per Customer", prompt: "Return the latest order for every customer.", starter: "SELECT ...", solution: "Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) and filter row_number = 1." },
  { id: 13, category: "Excel", difficulty: "Easy", title: "Conditional Total", prompt: "Calculate total sales in column B only when region in column A is 'West'.", starter: "Formula:", solution: '=SUMIF(A:A,"West",B:B)' },
  { id: 14, category: "Excel", difficulty: "Easy", title: "Lookup Customer", prompt: "Return a customer's city from a customer table using their customer ID.", starter: "Formula:", solution: 'Use XLOOKUP, for example: =XLOOKUP(E2,A:A,C:C,"Not Found")' },
  { id: 15, category: "Excel", difficulty: "Medium", title: "Duplicate Detection", prompt: "Write a formula that marks a value in A2 as Duplicate when it appears more than once in column A.", starter: "Formula:", solution: '=IF(COUNTIF(A:A,A2)>1,"Duplicate","Unique")' },
  { id: 16, category: "Excel", difficulty: "Medium", title: "Monthly Sales", prompt: "How would you summarize sales by month from a transaction date and amount column?", starter: "Your answer:", solution: "Create a PivotTable, group the date field by Months/Years, and aggregate Amount using Sum." },
];

const CATEGORIES = ["All", "Python", "Machine Learning", "MySQL", "Excel"];

function languageFor(category) {
  if (category === "Python" || category === "Machine Learning") return "Python";
  if (category === "MySQL") return "SQL";
  if (category === "Excel") return "Excel";
  return "Text";
}

export default function PracticeLab() {
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(1);
  const [answer, setAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [message, setMessage] = useState("");
  const [runState, setRunState] = useState("idle");
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("practice_completed") || "[]"));
  const [profile, setProfile] = useState({ xp: 0, solved_count: 0, current_streak: 0 });

  useEffect(() => {
    API.get("/practice/profile/").then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const filtered = useMemo(
    () => category === "All" ? PROBLEMS : PROBLEMS.filter((p) => p.category === category),
    [category]
  );
  const problem = PROBLEMS.find((p) => p.id === selectedId) || filtered[0];
  const language = languageFor(problem.category);

  const selectProblem = (id) => {
    setSelectedId(id);
    setAnswer("");
    setMessage("");
    setShowSolution(false);
    setRunState("idle");
  };

  const submit = async () => {
    if (!answer.trim()) {
      setMessage("Write an answer before submitting.");
      return;
    }
    setRunState("submitting");
    try {
      const res = await API.post("/practice/attempts/", { problem: problem.id, answer });
      setProfile(res.data.profile || profile);
      if (res.data.attempt?.status === "PASSED") {
        const next = [...new Set([...completed, problem.id])];
        setCompleted(next);
        localStorage.setItem("practice_completed", JSON.stringify(next));
        setRunState("passed");
      } else {
        setRunState("submitted");
      }
      setMessage(res.data.message || "Submission recorded.");
    } catch (err) {
      setRunState("error");
      setMessage(err?.response?.data?.detail || "Unable to submit. Please login again and retry.");
    }
  };

  const selectCategory = (value) => {
    setCategory(value);
    const next = PROBLEMS.find((p) => value === "All" || p.category === value);
    if (next) selectProblem(next.id);
  };

  return (
    <main className="min-h-screen bg-[#0B1020] text-white font-['Inter',sans-serif]">
      <section className="max-w-[1500px] mx-auto px-3 md:px-5 py-5">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2A93B]">Innovation AI Labs • Practice Arena</div>
            <h1 className="font-['Sora',sans-serif] text-2xl md:text-3xl font-extrabold mt-2">Practice like a developer. Learn by solving.</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">⚡ {profile.xp} XP</span>
            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">🔥 {profile.current_streak} day streak</span>
            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">✓ {profile.solved_count} solved</span>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-3">
          {CATEGORIES.map((item) => (
            <button key={item} onClick={() => selectCategory(item)} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${category === item ? "bg-[#F2A93B] text-[#111827] border-[#F2A93B]" : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-[280px_minmax(0,1fr)] gap-4">
          <aside className="rounded-xl border border-white/10 bg-[#11182B] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold">Problems</span>
              <span className="text-xs text-white/50">{completed.length}/{PROBLEMS.length}</span>
            </div>
            <div className="p-2 max-h-[650px] overflow-auto">
              {filtered.map((item) => (
                <button key={item.id} onClick={() => selectProblem(item.id)} className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${problem.id === item.id ? "bg-[#F2A93B]/15 ring-1 ring-[#F2A93B]/40" : "hover:bg-white/5"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/35 w-5">{item.id}</span>
                    <span className="text-sm font-semibold flex-1">{item.title}</span>
                    {completed.includes(item.id) && <span className="text-emerald-400">✓</span>}
                  </div>
                  <div className="ml-7 mt-1 text-[11px] text-white/40">{item.category} • {item.difficulty}</div>
                </button>
              ))}
            </div>
          </aside>

          <section className="grid lg:grid-cols-2 gap-4 min-w-0">
            <div className="rounded-xl border border-white/10 bg-[#11182B] overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-white/10">{problem.category}</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-[#F2A93B]/15 text-[#F2A93B]">{problem.difficulty}</span>
                  <span className="ml-auto text-xs text-white/40">{problem.id}/16</span>
                </div>
                <h2 className="font-['Sora',sans-serif] text-xl font-bold">{problem.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/65">{problem.prompt}</p>
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-wider text-white/40 mb-2">Instructions</div>
                <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4 text-sm text-white/70 leading-6">
                  {problem.category === "Python" && "Implement the function using Python. Your submission will be evaluated by the practice engine when execution is enabled."}
                  {problem.category === "Machine Learning" && "Explain your reasoning clearly. ML execution and dataset-based evaluation will be added in the sandbox phase."}
                  {problem.category === "MySQL" && "Write a valid SQL query. It will run against an isolated practice schema in the SQL engine phase."}
                  {problem.category === "Excel" && "Provide the formula or method. Workbook-based validation will be added in the Excel phase."}
                </div>
                <button onClick={() => setShowSolution(!showSolution)} className="mt-4 text-sm font-semibold text-[#F2A93B] hover:underline">
                  {showSolution ? "Hide solution" : "View solution"}
                </button>
                {showSolution && <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70 whitespace-pre-wrap">{problem.solution}</div>}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#11182B] overflow-hidden flex flex-col min-h-[560px]">
              <div className="h-12 px-4 border-b border-white/10 flex items-center gap-3">
                <span className="text-xs font-bold text-white/60">EDITOR</span>
                <span className="text-xs rounded px-2 py-1 bg-white/5 text-white/50">{language}</span>
                <span className="ml-auto text-xs text-white/35">Sandbox execution coming next</span>
              </div>
              <textarea
                value={answer || problem.starter}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-1 min-h-[390px] w-full resize-none bg-[#080C16] text-[#E7EAF1] p-5 font-mono text-sm leading-6 outline-none border-0"
                spellCheck="false"
                placeholder="Write your solution here..."
              />
              <div className="p-3 border-t border-white/10 bg-[#0D1424] flex flex-wrap gap-2 items-center">
                <button onClick={() => { setRunState("queued"); setMessage("Execution is not enabled yet. Your code is kept locally until the secure sandbox is connected."); }} className="px-4 py-2 rounded-lg border border-white/10 text-sm font-semibold hover:bg-white/5">
                  ▶ Run
                </button>
                <button onClick={submit} disabled={runState === "submitting"} className="px-5 py-2 rounded-lg bg-[#F2A93B] text-[#111827] text-sm font-bold disabled:opacity-50">
                  {runState === "submitting" ? "Submitting..." : "Submit"}
                </button>
                {message && <span className={`text-xs ${runState === "error" ? "text-red-300" : runState === "passed" ? "text-emerald-300" : "text-white/55"}`}>{message}</span>}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-xl border border-white/10 bg-[#11182B]">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold">Test Results</h3>
            <span className="text-xs text-white/40">Execution result</span>
          </div>
          <div className="p-5 grid md:grid-cols-3 gap-3">
            <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4">
              <div className="text-xs text-white/40">Status</div>
              <div className="mt-1 font-bold">{runState === "passed" ? "Accepted" : runState === "error" ? "Error" : "Not run"}</div>
            </div>
            <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4">
              <div className="text-xs text-white/40">Tests</div>
              <div className="mt-1 font-bold">{runState === "passed" ? "All tests passed" : "—"}</div>
            </div>
            <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4">
              <div className="text-xs text-white/40">Runtime</div>
              <div className="mt-1 font-bold">—</div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
