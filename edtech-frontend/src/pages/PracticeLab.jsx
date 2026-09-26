import { useMemo, useState, useEffect } from "react";
import API from "../services/api";

const CATEGORIES = ["All", "Python", "Machine Learning", "MySQL", "Excel"];

function languageFor(category) {
  if (category === "Python") return "Python";
  if (category === "MySQL") return "SQL";
  if (category === "Excel") return "Excel";
  return "Concept";
}

export default function PracticeLab() {
  const [category, setCategory] = useState("All");
  const [problems, setProblems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [message, setMessage] = useState("");
  const [runState, setRunState] = useState("idle");
  const [execution, setExecution] = useState(null);
  const [profile, setProfile] = useState({ xp: 0, solved_count: 0, current_streak: 0 });

  useEffect(() => {
    Promise.all([
      API.get("/practice/problems/"),
      API.get("/practice/profile/"),
    ]).then(([problemsRes, profileRes]) => {
      const items = problemsRes.data || [];
      setProblems(items);
      setProfile(profileRes.data || {});
      if (items.length) setSelectedId(items[0].id);
    }).catch(() => setMessage("Unable to load Practice Lab. Please login again."));
  }, []);

  const filtered = useMemo(
    () => category === "All" ? problems : problems.filter((p) => p.category === category),
    [category, problems]
  );

  const problem = problems.find((p) => p.id === selectedId) || filtered[0];
  const language = problem ? languageFor(problem.category) : "Python";

  useEffect(() => {
    if (!problem) return;
    setAnswer(problem.starter_code || "");
    setShowSolution(false);
    setMessage("");
    setExecution(null);
    setRunState("idle");
  }, [problem?.id]);

  const selectProblem = (id) => setSelectedId(id);

  const selectCategory = (value) => {
    setCategory(value);
    const next = problems.find((p) => value === "All" || p.category === value);
    if (next) setSelectedId(next.id);
  };

  const run = async () => {
    if (!problem || !answer.trim()) {
      setMessage("Write your solution before running.");
      return;
    }
    if (problem.problem_type !== "CODE") {
      setMessage("The Python execution engine is live. SQL and Excel engines are next.");
      return;
    }

    setRunState("running");
    setMessage("");
    setExecution(null);

    try {
      const res = await API.post("/practice/run/", { problem: problem.id, answer });
      setExecution(res.data);
      setRunState(res.data.status === "PASSED" ? "passed" : res.data.status === "UNAVAILABLE" ? "unavailable" : "failed");
      setMessage(
        res.data.status === "PASSED"
          ? "All tests passed. You can submit for XP."
          : res.data.message || "Some tests failed."
      );
    } catch (err) {
      setRunState("error");
      setMessage(err?.response?.data?.detail || err?.response?.data?.message || "Execution failed.");
    }
  };

  const submit = async () => {
    if (!problem || !answer.trim()) {
      setMessage("Write an answer before submitting.");
      return;
    }

    setRunState("submitting");
    try {
      const res = await API.post("/practice/attempts/", { problem: problem.id, answer });
      setProfile(res.data.profile || profile);
      setExecution(res.data.execution || null);
      setRunState(res.data.attempt?.status === "PASSED" ? "passed" : "failed");
      setMessage(res.data.message || "Submission recorded.");
    } catch (err) {
      setRunState("error");
      setMessage(err?.response?.data?.detail || "Unable to submit. Please retry.");
    }
  };

  if (!problem) {
    return (
      <main className="min-h-screen bg-[#0B1020] text-white p-8">
        <div className="max-w-5xl mx-auto">Loading Practice Lab...</div>
      </main>
    );
  }

  const statusLabel =
    runState === "passed" ? "Accepted" :
    runState === "running" ? "Running..." :
    runState === "submitting" ? "Submitting..." :
    runState === "unavailable" ? "Runner unavailable" :
    runState === "failed" || runState === "error" ? "Failed" :
    "Not run";

  return (
    <main className="min-h-screen bg-[#0B1020] text-white font-['Inter',sans-serif]">
      <section className="max-w-[1500px] mx-auto px-3 md:px-5 py-5">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2A93B]">
              Innovation AI Labs • Practice Arena
            </div>
            <h1 className="font-['Sora',sans-serif] text-2xl md:text-3xl font-extrabold mt-2">
              Practice like a developer. Learn by solving.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">⚡ {profile.xp || 0} XP</span>
            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">🔥 {profile.current_streak || 0} day streak</span>
            <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">✓ {profile.solved_count || 0} solved</span>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-3">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => selectCategory(item)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${category === item ? "bg-[#F2A93B] text-[#111827] border-[#F2A93B]" : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-[280px_minmax(0,1fr)] gap-4">
          <aside className="rounded-xl border border-white/10 bg-[#11182B] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold">Problems</span>
              <span className="text-xs text-white/50">{problems.length} total</span>
            </div>
            <div className="p-2 max-h-[650px] overflow-auto">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectProblem(item.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${problem.id === item.id ? "bg-[#F2A93B]/15 ring-1 ring-[#F2A93B]/40" : "hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/35 w-5">{item.id}</span>
                    <span className="text-sm font-semibold flex-1">{item.title}</span>
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
                  <span className="ml-auto text-xs text-white/40">+{problem.xp} XP</span>
                </div>
                <h2 className="font-['Sora',sans-serif] text-xl font-bold">{problem.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/65">{problem.prompt}</p>
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-wider text-white/40 mb-2">Instructions</div>
                <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4 text-sm text-white/70 leading-6">
                  {problem.problem_type === "CODE" && "Write the function in the editor. Run executes the solution against hidden practice tests in the isolated Python runner."}
                  {problem.problem_type === "SQL" && "SQL execution is the next engine phase. The editor is ready, but Run is not enabled for SQL yet."}
                  {problem.problem_type === "CONCEPT" && "Answer the concept question clearly. Concept evaluation is currently handled by the practice submission flow."}
                  {problem.problem_type === "EXCEL" && "Provide the formula or method. Workbook validation will be added in the Excel engine phase."}
                </div>
                <button onClick={() => setShowSolution(!showSolution)} className="mt-4 text-sm font-semibold text-[#F2A93B] hover:underline">
                  {showSolution ? "Hide solution" : "View solution"}
                </button>
                {showSolution && (
                  <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70 whitespace-pre-wrap">
                    {problem.solution}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#11182B] overflow-hidden flex flex-col min-h-[560px]">
              <div className="h-12 px-4 border-b border-white/10 flex items-center gap-3">
                <span className="text-xs font-bold text-white/60">EDITOR</span>
                <span className="text-xs rounded px-2 py-1 bg-white/5 text-white/50">{language}</span>
                <span className="ml-auto text-xs text-emerald-300">
                  {problem.problem_type === "CODE" ? "Python engine enabled" : "Engine coming next"}
                </span>
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-1 min-h-[390px] w-full resize-none bg-[#080C16] text-[#E7EAF1] p-5 font-mono text-sm leading-6 outline-none border-0"
                spellCheck="false"
                placeholder="Write your solution here..."
              />

              <div className="p-3 border-t border-white/10 bg-[#0D1424] flex flex-wrap gap-2 items-center">
                <button
                  onClick={run}
                  disabled={runState === "running" || runState === "submitting"}
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm font-semibold hover:bg-white/5 disabled:opacity-50"
                >
                  {runState === "running" ? "Running..." : "▶ Run"}
                </button>
                <button
                  onClick={submit}
                  disabled={runState === "submitting"}
                  className="px-5 py-2 rounded-lg bg-[#F2A93B] text-[#111827] text-sm font-bold disabled:opacity-50"
                >
                  {runState === "submitting" ? "Submitting..." : "Submit"}
                </button>
                {message && (
                  <span className={`text-xs ${runState === "passed" ? "text-emerald-300" : runState === "error" || runState === "failed" ? "text-red-300" : "text-white/55"}`}>
                    {message}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-xl border border-white/10 bg-[#11182B]">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold">Test Results</h3>
            <span className="text-xs text-white/40">Secure execution result</span>
          </div>
          <div className="p-5 grid md:grid-cols-3 gap-3">
            <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4">
              <div className="text-xs text-white/40">Status</div>
              <div className="mt-1 font-bold">{statusLabel}</div>
            </div>
            <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4">
              <div className="text-xs text-white/40">Tests</div>
              <div className="mt-1 font-bold">
                {execution?.passed != null ? `${execution.passed}/${execution.total} passed` : "—"}
              </div>
            </div>
            <div className="rounded-lg bg-[#0B1020] border border-white/10 p-4">
              <div className="text-xs text-white/40">Runtime</div>
              <div className="mt-1 font-bold">
                {execution?.runtime_ms != null ? `${execution.runtime_ms} ms` : "—"}
              </div>
            </div>
          </div>
          {execution?.results && (
            <div className="px-5 pb-5 space-y-2">
              {execution.results.map((item) => (
                <div key={item.case} className="rounded-lg border border-white/10 bg-[#0B1020] p-3 text-xs">
                  <span className={item.status === "PASSED" ? "text-emerald-300" : "text-red-300"}>{item.status}</span>
                  <span className="ml-3 text-white/50">Test case {item.case}</span>
                  {item.error && <pre className="mt-2 whitespace-pre-wrap text-red-200/80">{item.error}</pre>}
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
