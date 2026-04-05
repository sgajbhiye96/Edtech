import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
const testimonials = [
{
name: "Priya Sharma",
role: "Frontend Developer @ Infosys",
text: "InnovationAILabs changed my career. The project-based approach meant I had a portfolio before I even graduated.",
avatar: "PS",
color: "#6366f1",
},
{
name: "Rahul Desai",
role: "Data Analyst @ TCS",
text: "The mentorship and mock interviews gave me the confidence to crack my first tech interview. Highly recommended!",
avatar: "RD",
color: "#8b5cf6",
},
{
name: "Ananya Iyer",
role: "Full Stack Dev @ Startup",
text: "I went from zero coding knowledge to building full-stack apps in 4 months. The curriculum is genuinely world-class.",
avatar: "AI",
color: "#60a5fa",
},
];
const faqs = [
{
q: "Do I need prior experience to join?",
a: "No! Our courses are designed for all levels — from complete beginners to working professionals looking to upskill.",
},
{
q: "Will I get a certificate after completing a course?",
a: "Yes, every learner who completes a course receives an industry-recognized certificate of completion.",
},
{
q: "Are the courses self-paced or live?",
a: "We offer both. You can learn at your own pace with recorded lessons, or join live cohort batches for guided learning.",
},
{
q: "Is there placement assistance?",
a: "Absolutely. Our career team offers resume reviews, mock interviews, and direct referrals to our hiring partners.",

},
{
q: "What payment options are available?",
a: "We accept UPI, credit/debit cards, net banking, and EMI options. Scholarships are also available for eligible students.",
},
];
const stats = [
{ value: "12,000+", label: "Learners Enrolled" },
{ value: "50+", label: "Courses Available" },
{ value: "94%", label: "Placement Rate" },
{ value: "200+", label: "Hiring Partners" },
];
export default function Home() {
const [courses, setCourses] = useState([]);
const [openFaq, setOpenFaq] = useState(null);
useEffect(() => {
API.get("/courses/")
.then((res) => setCourses(res.data.slice(0, 3)))
.catch(() => {});
}, []);
return (
<div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fafafa", color: "#111" }}>
{/* ── HERO ── */}
<section
style={{
background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #0f0c29 100%)",
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
position: "relative",
overflow: "hidden",
padding: "80px 1.5rem",
}}
>
{/* Decorative blobs */}
<div style={{
position: "absolute", top: "-80px", left: "-80px",
width: "400px", height: "400px",
borderRadius: "50%",
background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
pointerEvents: "none",

}} />
<div style={{
position: "absolute", bottom: "-100px", right: "-100px",
width: "500px", height: "500px",
borderRadius: "50%",
background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
pointerEvents: "none",
}} />
<div style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 1 }}>
<div style={{
display: "inline-block",
background: "rgba(167,139,250,0.15)",
border: "1px solid rgba(167,139,250,0.35)",
color: "#c4b5fd",
padding: "6px 18px",
borderRadius: "999px",
fontSize: "0.82rem",
fontWeight: 600,
letterSpacing: "0.08em",
textTransform: "uppercase",
marginBottom: "24px",
}}>
India's #1 AI & Coding Platform
</div>
<h1 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
fontWeight: 800,
color: "#fff",
lineHeight: 1.1,
marginBottom: "24px",
letterSpacing: "-0.03em",
}}>
Build Real Skills.{" "}
<span style={{
background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
}}>
Land Real Jobs.
</span>
</h1>
<p style={{
color: "rgba(255,255,255,0.65)",

fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
lineHeight: 1.7,
marginBottom: "40px",
maxWidth: "580px",
margin: "0 auto 40px",
}}>
Project-based courses in AI, Full-Stack Development, and Data Science —
designed to make you job-ready in months, not years.
</p>
<div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
<Link
to="/courses"
style={{
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",
textDecoration: "none",
padding: "14px 32px",
borderRadius: "10px",
fontWeight: 700,
fontSize: "1rem",
boxShadow: "0 8px 30px rgba(99,102,241,0.45)",
transition: "transform 0.2s",
fontFamily: "'Syne', sans-serif",
}}
>
Explore Courses →
</Link>
<Link
to="/register"
style={{
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.2)",
color: "#fff",
textDecoration: "none",
padding: "14px 32px",
borderRadius: "10px",
fontWeight: 500,
fontSize: "1rem",
transition: "all 0.2s",
}}
>
Start Free Today
</Link>
</div>
</div>
</section>

{/* ── STATS ── */}
<section style={{
background: "#fff",
borderBottom: "1px solid #f0f0f0",
padding: "48px 1.5rem",
}}>
<div style={{
maxWidth: "1100px", margin: "0 auto",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
gap: "32px",
textAlign: "center",
}}>
{stats.map((s) => (
<div key={s.label}>
<div style={{
fontFamily: "'Syne', sans-serif",
fontSize: "2.4rem",
fontWeight: 800,
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
lineHeight: 1.1,
}}>
{s.value}
</div>
<div style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "6px", fontWeight: 500 }}>
{s.label}
</div>
</div>
))}
</div>
</section>
{/* ── FEATURED COURSES ── */}
<section style={{ padding: "80px 1.5rem", background: "#fafafa" }}>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: "48px" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
fontWeight: 800,
color: "#0f0c29",
marginBottom: "12px",
}}>
Featured Courses

</h2>
<p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
Handpicked courses built around real-world projects and industry demand.
</p>
</div>
{courses.length > 0 ? (
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
gap: "24px",
}}>
{courses.map((c) => (
<div
key={c.id}
style={{
background: "#fff",
borderRadius: "16px",
overflow: "hidden",
boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
border: "1px solid #f0f0f0",
transition: "transform 0.2s, box-shadow 0.2s",
}}
onMouseOver={(e) => {
e.currentTarget.style.transform = "translateY(-4px)";
e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.15)";
}}
onMouseOut={(e) => {
e.currentTarget.style.transform = "translateY(0)";
e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)";
}}
>
<img
src={c.thumbnail}
alt={c.title}
style={{ width: "100%", height: "180px", objectFit: "cover" }}
/>
<div style={{ padding: "20px" }}>
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,
fontSize: "1.05rem",
color: "#111",
marginBottom: "8px",
}}>
{c.title}
</h3>

<p style={{ color: "#6b7280", fontSize: "0.88rem", marginBottom: "16px", lineHeight: 1.5 }}>
{c.description?.slice(0, 80)}...
</p>
<Link
to={`/courses/${c.id}`}
style={{
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",
textDecoration: "none",
padding: "8px 18px",
borderRadius: "8px",
fontSize: "0.88rem",
fontWeight: 600,
display: "inline-block",
}}
>
View Course →
</Link>
</div>
</div>
))}
</div>
) : (
<div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
Loading courses...
</div>
)}
<div style={{ textAlign: "center", marginTop: "40px" }}>
<Link
to="/courses"
style={{
border: "2px solid #6366f1",
color: "#6366f1",
textDecoration: "none",
padding: "12px 32px",
borderRadius: "10px",
fontWeight: 600,
fontSize: "0.95rem",
transition: "all 0.2s",
fontFamily: "'Syne', sans-serif",
}}
>
Browse All Courses
</Link>
</div>
</div>

</section>
{/* ── WHY CHOOSE US ── */}
<section style={{
background: "linear-gradient(135deg, #0f0c29, #1a1a4e)",
padding: "80px 1.5rem",
color: "#fff",
}}>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: "56px" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
fontWeight: 800,
marginBottom: "12px",
}}>
Why InnovationAILabs?
</h2>
<p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "440px", margin: "0 auto" }}>
We don't just teach — we prepare you to build, ship, and grow.
</p>
</div>
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
gap: "24px",
}}>
{[
{ icon: " ", title: "Project-Based", desc: "Every course ends with a real deployable project for your portfolio." },
{ icon: " ", title: "Career-Focused", desc: "Resume reviews, LinkedIn optimization, and mock interviews included." },
{ icon: " ", title: "1-on-1 Mentorship", desc: "Get personalized guidance from industry mentors throughout your journey." },
{ icon: " ", title: "Certified Learning", desc: "Industry-recognized certificates that employers actually respect." },
{ icon: " ", title: "Internship Access", desc: "Exclusive internship opportunities with our partner companies." },
{ icon: " ", title: "Lifetime Access", desc: "Pay once, learn forever. All updates and new content included free." },
].map((f) => (
<div
key={f.title}
style={{
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: "14px",
padding: "28px 24px",
transition: "background 0.2s, border 0.2s",
}}
onMouseOver={(e) => {
e.currentTarget.style.background = "rgba(167,139,250,0.1)";

e.currentTarget.style.border = "1px solid rgba(167,139,250,0.3)";
}}
onMouseOut={(e) => {
e.currentTarget.style.background = "rgba(255,255,255,0.04)";
e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
}}
>
<div style={{ fontSize: "2rem", marginBottom: "14px" }}>{f.icon}</div>
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,
fontSize: "1.05rem",
marginBottom: "8px",
}}>
{f.title}
</h3>
<p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.6 }}>
{f.desc}
</p>
</div>
))}
</div>
</div>
</section>
{/* ── TESTIMONIALS ── */}
<section style={{ padding: "80px 1.5rem", background: "#fff" }}>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: "48px" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
fontWeight: 800,
color: "#0f0c29",
marginBottom: "12px",
}}>
What Our Learners Say
</h2>
<p style={{ color: "#6b7280", maxWidth: "400px", margin: "0 auto" }}>
Real outcomes from real students across India.
</p>
</div>
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: "24px",

}}>
{testimonials.map((t) => (
<div
key={t.name}
style={{
background: "#fafafa",
border: "1px solid #f0f0f0",
borderRadius: "16px",
padding: "28px 24px",
position: "relative",
}}
>
<div style={{
fontSize: "3rem",
color: "#e5e7eb",
position: "absolute",
top: "16px",
right: "20px",
fontFamily: "Georgia, serif",
lineHeight: 1,
}}>
"
</div>
<p style={{
color: "#374151",
fontSize: "0.95rem",
lineHeight: 1.7,
marginBottom: "20px",
fontStyle: "italic",
}}>
{t.text}
</p>
<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
<div style={{
width: "42px", height: "42px",
borderRadius: "50%",
background: `linear-gradient(135deg, ${t.color}, #0f0c29)`,
display: "flex", alignItems: "center", justifyContent: "center",
color: "#fff",
fontWeight: 700,
fontSize: "0.85rem",
fontFamily: "'Syne', sans-serif",
}}>
{t.avatar}
</div>
<div>
<div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#111", fontFamily: "'Syne', sans-serif" }}>

{t.name}
</div>
<div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{t.role}</div>
</div>
</div>
</div>
))}
</div>
</div>
</section>
{/* ── FAQ ── */}
<section style={{ padding: "80px 1.5rem", background: "#fafafa" }}>
<div style={{ maxWidth: "720px", margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: "48px" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
fontWeight: 800,
color: "#0f0c29",
marginBottom: "12px",
}}>
Frequently Asked Questions
</h2>
<p style={{ color: "#6b7280" }}>
Everything you need to know before getting started.
</p>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
{faqs.map((faq, i) => (
<div
key={i}
style={{
background: "#fff",
border: openFaq === i ? "1px solid #a78bfa" : "1px solid #e5e7eb",
borderRadius: "12px",
overflow: "hidden",
transition: "border 0.2s",
}}
>
<button
onClick={() => setOpenFaq(openFaq === i ? null : i)}
style={{
width: "100%",
background: "none",
border: "none",

cursor: "pointer",
padding: "18px 20px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
textAlign: "left",
}}
>
<span style={{
fontWeight: 600,
fontSize: "0.95rem",
color: "#111",
fontFamily: "'Syne', sans-serif",
}}>
{faq.q}
</span>
<span style={{
color: "#6366f1",
fontSize: "1.3rem",
fontWeight: 300,
flexShrink: 0,
marginLeft: "12px",
transition: "transform 0.2s",
transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
}}>
+
</span>
</button>
{openFaq === i && (
<div style={{
padding: "0 20px 18px",
color: "#6b7280",
fontSize: "0.9rem",
lineHeight: 1.7,
borderTop: "1px solid #f3f4f6",
paddingTop: "14px",
}}>
{faq.a}
</div>
)}
</div>
))}
</div>
</div>
</section>
{/* ── CTA BANNER ── */}

<section style={{
background: "linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)",
padding: "72px 1.5rem",
textAlign: "center",
}}>
<div style={{ maxWidth: "600px", margin: "0 auto" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
fontWeight: 800,
color: "#fff",
marginBottom: "16px",
}}>
Ready to transform your career?
</h2>
<p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.05rem", marginBottom: "36px" }}>
Join 12,000+ learners who chose InnovationAILabs to build their future.
</p>
<div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
<Link
to="/register"
style={{
background: "#fff",
color: "#6366f1",
textDecoration: "none",
padding: "14px 32px",
borderRadius: "10px",
fontWeight: 700,
fontSize: "1rem",
fontFamily: "'Syne', sans-serif",
boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
}}
>
Enroll Now — It's Free
</Link>
<Link
to="/courses"
style={{
background: "rgba(255,255,255,0.15)",
border: "1px solid rgba(255,255,255,0.4)",
color: "#fff",
textDecoration: "none",
padding: "14px 32px",
borderRadius: "10px",
fontWeight: 500,
fontSize: "1rem",
}}

>
Browse Courses
</Link>
</div>
</div>
</section>
{/* ── FOOTER ── */}
<footer style={{
background: "#0f0c29",
color: "rgba(255,255,255,0.5)",
padding: "40px 1.5rem",
textAlign: "center",
fontSize: "0.88rem",
}}>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div style={{
display: "flex",
justifyContent: "center",
gap: "32px",
flexWrap: "wrap",
marginBottom: "24px",
}}>
{[
{ to: "/", label: "Home" },
{ to: "/courses", label: "Courses" },
{ to: "/about", label: "About" },
{ to: "/login", label: "Login" },
{ to: "/register", label: "Register" },
].map((l) => (
<Link
key={l.to}
to={l.to}
style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
onMouseOver={(e) => (e.target.style.color = "#a78bfa")}
onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
>
{l.label}
</Link>
))}
</div>
<p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem" }}>
© {new Date().getFullYear()} InnovationAILabs. All rights reserved. | Empowering India's next generation of tech talent.
</p>
</div>
</footer>
</div>

);
}