import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import PaymentModal from "../components/PaymentModal";
import upiQr from "../assets/siddharth-upi-qr.svg";

const modules = [
  ["01", "Python for GenAI", "Python foundations, APIs, JSON, Git and the tooling used to build AI applications."],
  ["02", "LLMs & Prompt Engineering", "LLM fundamentals, prompting patterns, context windows, tokenization and embeddings."],
  ["03", "RAG & Vector Databases", "Document ingestion, chunking, retrieval, vector search, evaluation and production RAG."],
  ["04", "AI Agents", "LangChain, LangGraph, tool calling, memory and multi-agent workflows."],
  ["05", "Deployment & MLOps", "FastAPI, Docker, cloud deployment, monitoring and production considerations."],
  ["06", "Real-World AI Products", "Build, integrate and present end-to-end AI solutions with business use cases."],
];

const projects = [
  "RAG chatbot",
  "Document Intelligence",
  "Multi-Agent Workflow with LangGraph",
  "AI Agent for Business Use Cases",
  "Deploy an AI application on Azure/AWS",
  "End-to-End AI Product",
];

const benefits = [
  "Live interactive classes",
  "Hands-on projects",
  "Doubt support & community",
  "Certificate of completion",
  "Lifetime access to recordings",
  "Project templates",
  "Resume & interview preparation",
  "Lifetime community access",
];

export default function GenAIAgenticLanding() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCourse = async () => {
      try {
        const requestedId = searchParams.get("courseId");

        if (requestedId) {
          const res = await API.get(`/courses/${requestedId}/`);
          if (mounted) setCourse(res.data);
          return;
        }

        const res = await API.get("/courses/");
        const courses = Array.isArray(res.data) ? res.data : [];

        const normalized = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

        const target =
          courses.find((item) => {
            const title = normalized(item.title);
            return title.includes("generative") && title.includes("agentic");
          }) ||
          courses.find((item) => normalized(item.title).includes("generative ai")) ||
          courses.find((item) => normalized(item.title).includes("agentic ai"));

        if (!target) {
          throw new Error("The Generative AI + Agentic AI course is not published yet.");
        }

        if (mounted) setCourse(target);
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Unable to load the course.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCourse();
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  const price = useMemo(() => 4999, []);
  const batches = Array.isArray(course?.batches) ? course.batches : [];
  const selectedBatch = batches.find((batch) => batch.registration_open && ["UPCOMING", "ONGOING"].includes(batch.status)) || batches[0];

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedBatch) return;
    setShowPayment(true);
  };

  const handleSuccess = () => {
    setShowPayment(false);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4ED] flex items-center justify-center text-[#2B3252]">
        Loading course...
      </div>
    );
  }

  if (error || !course || !selectedBatch) {
    return (
      <div className="min-h-screen bg-[#F6F4ED] flex items-center justify-center px-6">
        <div className="max-w-lg text-center bg-white border border-[#E4E0D2] rounded-xl p-8">
          <h1 className="text-2xl font-bold text-[#12172B] mb-3">Course unavailable</h1>
          <p className="text-[#2B3252] mb-6">{error || "No active batch is currently available for enrollment."}</p>
          <button onClick={() => navigate("/courses")} className="bg-[#12172B] text-white px-6 py-3 rounded-lg font-bold">
            Browse courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4ED] text-[#12172B] font-['Inter',sans-serif]">
      {showPayment && selectedBatch && (
        <PaymentModal
          batch={{ ...selectedBatch, course_title: course.title, price }}
          onClose={() => setShowPayment(false)}
          onSuccess={handleSuccess}
        />
      )}

      <section className="relative overflow-hidden bg-[#12172B] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(242,169,59,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(110,231,183,0.14),transparent_30%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#F2A93B]/40 bg-[#F2A93B]/10 text-[#F7C878] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
                InnovationAI Labs · 1-Month Live Online Course
              </div>
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Generative AI
                <span className="text-[#F2A93B]"> + </span>
                Agentic AI
              </h1>
              <p className="mt-5 text-lg md:text-xl text-[#C9CDE0] max-w-2xl leading-relaxed">
                From basics to real-world projects. Learn how modern AI systems are built,
                connected, evaluated and deployed.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Python", "LLMs", "RAG", "LangChain", "LangGraph", "Vector DBs", "Azure/AWS"].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-sm text-[#E7E9F3]">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEnroll}
                  className="bg-[#F2A93B] hover:bg-[#F5BC63] text-[#12172B] px-7 py-4 rounded-lg font-extrabold text-base shadow-lg shadow-black/20"
                >
                  Pay ₹4,999 & Enroll
                </button>
                <a href="#curriculum" className="border border-white/20 hover:bg-white/10 px-7 py-4 rounded-lg font-bold text-center">
                  View curriculum
                </a>
              </div>

              <p className="mt-4 text-sm text-[#9AA3CC]">
                Secure online checkout · UPI · Cards · Net Banking
              </p>
            </div>

            <div className="bg-white text-[#12172B] rounded-2xl p-6 md:p-8 shadow-2xl">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-52 object-cover rounded-xl mb-6"
                />
              )}
              <p className="text-sm uppercase tracking-wider font-bold text-[#6C728A]">Course investment</p>
              <div className="flex items-end gap-3 mt-2">
                <span className="text-4xl md:text-5xl font-black">₹4,999</span>
                <span className="text-sm text-[#7A8097] mb-2">one-time</span>
              </div>
              <p className="mt-2 text-sm text-[#6C728A]">1 month · Live online · Certificate</p>
              <div className="mt-6 border-t border-[#E4E0D2] pt-5 space-y-3">
                {benefits.slice(0, 6).map((item) => (
                  <div key={item} className="flex gap-3 text-sm">
                    <span className="text-[#168A55] font-black">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 border-t border-[#E4E0D2] pt-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-lg">Pay directly via UPI</p>
                    <p className="mt-1 text-xs text-[#6C728A]">
                      Scan the QR and pay ₹4,999
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EAF7F0] px-3 py-1 text-xs font-bold text-[#168A55]">
                    UPI
                  </span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center gap-5 rounded-xl bg-[#F6F4ED] p-4">
                  <div className="shrink-0 rounded-xl border border-[#E4E0D2] bg-white p-2">
                    <img
                      src={upiQr}
                      alt="UPI payment QR code for InnovationAI Labs"
                      className="h-40 w-40"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-bold text-[#12172B]">7507730786@ptaxis</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#6C728A]">
                      After payment, enter your UTR / transaction ID so we can verify the payment.
                    </p>
                    <button
                      onClick={handleEnroll}
                      className="mt-4 bg-[#F2A93B] hover:bg-[#F5BC63] text-[#12172B] px-5 py-2.5 rounded-lg font-extrabold text-sm"
                    >
                      I Have Paid — Submit UTR
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-[#7A8097]">
                  UPI QR payments are manually verified before course access is activated.
                </p>
              </div>

              <button onClick={handleEnroll} className="mt-6 w-full bg-[#12172B] hover:bg-[#232A4A] text-white py-3.5 rounded-lg font-bold">
                Start My Enrollment
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-[#E4E0D2]">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-3 gap-6 text-center">
          {[
            ["1 Month", "Focused learning"],
            ["6 Projects", "Portfolio-ready builds"],
            ["₹4,999", "One-time fee"],
          ].map(([value, label]) => (
            <div key={value} className="p-5">
              <div className="text-3xl font-black text-[#12172B]">{value}</div>
              <div className="text-sm text-[#6C728A] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="curriculum" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-[#C98215] font-bold uppercase tracking-widest text-xs">What you will learn</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">A practical 1-month roadmap</h2>
            <p className="mt-3 text-[#5F657B]">
              Short theory blocks, live implementation and projects that map to real AI engineering work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {modules.map(([number, title, description]) => (
              <div key={number} className="bg-white border border-[#E4E0D2] rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <span className="text-sm font-black text-[#F2A93B]">{number}</span>
                  <div>
                    <h3 className="font-black text-lg">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5F657B]">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#12172B] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-[#F2A93B] font-bold uppercase tracking-widest text-xs">Build real projects</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Your portfolio gets stronger as you learn</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <div key={project} className="border border-white/10 bg-white/5 rounded-xl p-5">
                <div className="text-[#F2A93B] font-black text-sm">PROJECT {index + 1}</div>
                <div className="mt-2 font-bold">{project}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-[#C98215] font-bold uppercase tracking-widest text-xs">Who is it for?</p>
            <h2 className="text-3xl font-black mt-2">Built for people who want to build with AI</h2>
            <div className="mt-6 space-y-3">
              {[
                "Students & freshers",
                "Software developers",
                "Data / ML engineers",
                "Working professionals",
                "Business professionals",
                "Anyone who wants to build real AI applications",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-[#F6F4ED] rounded-lg px-4 py-3 text-sm font-semibold">
                  <span className="text-[#168A55]">✓</span>{item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F6F4ED] rounded-2xl p-7">
            <p className="text-[#C98215] font-bold uppercase tracking-widest text-xs">Included</p>
            <h2 className="text-3xl font-black mt-2">Everything you need to start</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {benefits.map((item) => (
                <div key={item} className="bg-white rounded-lg px-4 py-3 text-sm font-semibold border border-[#E4E0D2]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F2A93B]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="uppercase tracking-[0.2em] text-xs font-black text-[#12172B]/70">Next batch</p>
          <h2 className="text-4xl md:text-5xl font-black mt-2">Starts October 5, 2026</h2>
          <p className="mt-3 text-[#12172B]/75">Weekend / evening live sessions · ₹4,999 one-time</p>
          <button onClick={handleEnroll} className="mt-7 bg-[#12172B] hover:bg-[#232A4A] text-white px-8 py-4 rounded-lg font-black">
            Secure My Seat
          </button>
        </div>
      </section>

      <footer className="bg-[#12172B] text-[#9AA3CC] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-3 justify-between text-sm">
          <span>© {new Date().getFullYear()} InnovationAI Labs</span>
          <span>Generative AI + Agentic AI · ₹4,999</span>
        </div>
      </footer>

      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#12172B] border-t border-white/10 p-3 md:hidden">
        <button onClick={handleEnroll} className="w-full bg-[#F2A93B] text-[#12172B] py-3 rounded-lg font-black">
          Pay ₹4,999 & Enroll
        </button>
      </div>
    </div>
  );
}
