import { useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const emptyData = {
  name: "", role: "", email: "", phone: "", location: "", linkedin: "", github: "",
  summary: "", skills: "", experience: "", education: "", projects: "", certifications: "",
};

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

function Section({ title, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#12172B]">{title}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#E4E0D2] bg-white px-4 py-3 text-sm text-[#12172B] outline-none transition-all focus:border-[#F2A93B] focus:ring-2 focus:ring-[#F2A93B]/15" />
    </label>
  );
}

async function downloadPDF() {
  const element = document.getElementById("cv-preview");
  if (!element) return;

  if (!window.html2pdf) {
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-html2pdf="true"]');
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.async = true;
      script.dataset.html2pdf = "true";
      script.onload = resolve;
      script.onerror = () => reject(new Error("PDF library could not be loaded."));
      document.body.appendChild(script);
    });
  }

  await window.html2pdf().set({
    margin: [0.35, 0.35, 0.35, 0.35],
    filename: "ATS-Resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  }).from(element).save();
}
export default function CVMaker() {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([API.get("/cv/subscription/"), API.get("/cv/resume/").catch(() => null)])
      .then(([sub, resume]) => {
        setSubscription(sub.data);
        if (resume?.data?.data) setData({ ...emptyData, ...resume.data.data });
      })
      .catch((err) => setError(err?.response?.data?.error || "Unable to load CV Maker."))
      .finally(() => setLoading(false));
  }, [user]);

  const startSubscription = async () => {
    setError(""); setMessage("");
    try {
      const order = await API.post("/cv/subscription/");
      await loadRazorpay();
      const options = {
        key: order.data.key_id,
        subscription_id: order.data.subscription_id,
        name: "Innovation AI Labs",
        description: "ATS CV Maker — ₹9/month",
        prefill: { email: user?.email || "" },
        theme: { color: "#12172B" },
        handler: async (response) => {
          try {
            await API.post("/cv/subscription/verify/", response);
            setSubscription({ active: true, status: "ACTIVE" });
            setMessage("Subscription activated. Your ATS CV Maker is unlocked.");
          } catch (err) {
            setError(err?.response?.data?.error || "Subscription verification failed.");
          }
        },
        modal: { ondismiss: () => {} },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setError(response?.error?.description || "Subscription payment failed.");
      });
      razorpay.open();
    } catch (err) {
      console.error("CV subscription error:", err?.response?.data || err);
      const serverError = err?.response?.data?.error;
      const detail = err?.response?.data?.detail;
      setError(serverError || detail || `CV subscription request failed (HTTP ${err?.response?.status || "unknown"}).`);
    }
  };

  const saveResume = async () => {
    setSaving(true); setError(""); setMessage("");
    try {
      await API.put("/cv/resume/", { title: "My ATS Resume", data });
      setMessage("CV saved.");
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to save your CV.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-[#F6F4ED] px-6 py-20 text-center animate-page-in">
      <h1 className="font-['Sora',sans-serif] text-3xl font-bold text-[#12172B]">ATS CV Maker</h1>
      <p className="mx-auto mt-3 max-w-xl text-[#2B3252]">Create a clean, ATS-friendly resume and export it as PDF from your browser.</p>
      <a href="/login" className="mt-7 inline-block rounded-md bg-[#F2A93B] px-6 py-3 font-bold text-[#12172B]">Login to continue</a>
    </div>;
  }

  if (loading) return <div className="min-h-screen bg-[#F6F4ED] p-12 text-center text-[#6B7280]">Loading CV Maker...</div>;

  if (!subscription?.active) {
    return <div className="min-h-screen bg-[#F6F4ED] px-6 py-16 animate-page-in">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#E4E0D2] bg-white p-8 md:p-12 text-center shadow-[0_18px_45px_-28px_rgba(18,23,43,0.3)]">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9821B]">Career Tool</div>
        <h1 className="mt-3 font-['Sora',sans-serif] text-3xl md:text-4xl font-bold text-[#12172B]">ATS CV Maker</h1>
        <p className="mx-auto mt-4 max-w-lg text-[#2B3252]">Build a recruiter-friendly, ATS-readable CV with a clean structure, keyword-focused sections and a print-ready layout.</p>
        <div className="my-8 rounded-xl bg-[#F6F4ED] p-6">
          <div className="text-4xl font-extrabold text-[#12172B]">₹9 <span className="text-base font-medium text-[#6B7280]">/ month</span></div>
          <p className="mt-2 text-sm text-[#6B7280]">Recurring subscription. Manage or cancel from your Razorpay subscription controls.</p>
        </div>
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button onClick={startSubscription} className="w-full rounded-md bg-[#F2A93B] px-6 py-3 font-bold text-[#12172B] transition-all hover:-translate-y-0.5 hover:bg-[#F5BC63]">Unlock ATS CV Maker — ₹9/month</button>
      </div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F6F4ED] px-4 md:px-8 py-8 animate-page-in print:bg-white">
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between print:hidden">
        <div>
          <p className="text-sm text-[#6B7280]">Career tools</p>
          <h1 className="mt-1 font-['Sora',sans-serif] text-3xl font-bold text-[#12172B]">ATS CV Maker</h1>
          <p className="mt-2 text-sm text-[#2B3252]">Keep formatting simple. Use job-description keywords naturally in your skills and experience.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={saveResume} disabled={saving} className="rounded-md border border-[#12172B] px-4 py-2 text-sm font-semibold text-[#12172B]">{saving ? "Saving..." : "Save CV"}</button>
          <button onClick={async () => {
            setError("");
            try {
              await downloadPDF();
              setMessage("PDF downloaded successfully.");
            } catch (err) {
              console.error("PDF download error:", err);
              setError("Direct PDF download could not start. Please use Print → Save as PDF instead.");
            }
          }} className="rounded-md bg-[#F2A93B] px-4 py-2 text-sm font-bold text-[#12172B]">Download PDF</button>
          <button onClick={() => window.print()} className="rounded-md border border-[#12172B] px-4 py-2 text-sm font-semibold text-[#12172B]">Print</button>
        </div>
      </div>

      {message && <div className="mb-4 rounded-md bg-[#E4F1E3] p-3 text-sm text-[#3D7A38] print:hidden">{message}</div>}
      {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 print:hidden">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] print:block">
        <div className="space-y-5 print:hidden">
          <div className="rounded-xl border border-[#E4E0D2] bg-white p-6">
            <h2 className="mb-5 font-['Sora',sans-serif] text-lg font-bold text-[#12172B]">Personal details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["name","Full name","Rahul Sharma"],["role","Target role","Data Scientist"],
                ["email","Email","rahul@example.com"],["phone","Phone","+91 98765 43210"],
                ["location","Location","Nagpur, India"],["linkedin","LinkedIn","linkedin.com/in/rahul"],
                ["github","GitHub","github.com/rahul"],
              ].map(([key,label,placeholder]) => <label key={key} className="block"><span className="mb-2 block text-sm font-semibold text-[#12172B]">{label}</span><input value={data[key]} onChange={(e)=>update(key,e.target.value)} placeholder={placeholder} className="w-full rounded-md border border-[#E4E0D2] px-4 py-3 text-sm outline-none focus:border-[#F2A93B] focus:ring-2 focus:ring-[#F2A93B]/15" /></label>)}
            </div>
          </div>
          <div className="rounded-xl border border-[#E4E0D2] bg-white p-6 space-y-5">
            <Section title="Professional summary" value={data.summary} onChange={(v)=>update("summary",v)} placeholder="2–4 lines focused on experience, domain, measurable impact and target role." rows={5}/>
            <Section title="Skills" value={data.skills} onChange={(v)=>update("skills",v)} placeholder="Python, SQL, Machine Learning, Power BI, AWS..." rows={3}/>
            <Section title="Experience" value={data.experience} onChange={(v)=>update("experience",v)} placeholder={"Senior Data Analyst | Company | 2024–Present\n• Built ...\n• Improved ...\n• Automated ..."} rows={8}/>
            <Section title="Education" value={data.education} onChange={(v)=>update("education",v)} placeholder="B.Tech in Computer Science | University | 2020–2024" rows={4}/>
            <Section title="Projects" value={data.projects} onChange={(v)=>update("projects",v)} placeholder={"Project Name | Tech stack\n• What you built and the measurable result"} rows={6}/>
            <Section title="Certifications" value={data.certifications} onChange={(v)=>update("certifications",v)} placeholder="AWS Certified..., Google..., Microsoft..." rows={4}/>
          </div>
        </div>

        <article className="mx-auto w-full max-w-[850px] bg-white p-8 md:p-12 text-[#171717] shadow-[0_12px_35px_-25px_rgba(0,0,0,0.4)] print:max-w-none print:p-0 print:shadow-none" id="cv-preview">
          <header className="border-b-2 border-[#171717] pb-4">
            <h2 className="text-3xl font-bold tracking-tight">{data.name || "Your Name"}</h2>
            <p className="mt-1 text-base font-semibold">{data.role || "Target Role"}</p>
            <p className="mt-2 text-sm">{[data.email,data.phone,data.location,data.linkedin,data.github].filter(Boolean).join(" | ")}</p>
          </header>
          {[
            ["SUMMARY", data.summary], ["SKILLS", data.skills], ["EXPERIENCE", data.experience],
            ["EDUCATION", data.education], ["PROJECTS", data.projects], ["CERTIFICATIONS", data.certifications]
          ].map(([title,value]) => value ? <section key={title} className="mt-5"><h3 className="border-b border-[#999] pb-1 text-sm font-bold tracking-widest">{title}</h3><div className="mt-2 whitespace-pre-line text-sm leading-6">{value}</div></section> : null)}
        </article>
      </div>
    </div>
  </div>;
}
