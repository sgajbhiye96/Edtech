import { Link } from "react-router-dom";
const team = [
{
name: "Snehal Gajbhiye",
role: "Founder & Lead Instructor",
bio: "Full-stack developer and educator with 8+ years of industry experience. Passionate about making tech education accessible.",
avatar: "SG",
color: "#6366f1",
},
{
name: "AI Curriculum Team",
role: "Course Designers",
bio: "Industry professionals from top tech companies who design and continuously update our hands-on project curriculum.",
avatar: "AC",
color: "#8b5cf6",
},
{
name: "Career Support Team",
role: "Placement Mentors",
bio: "Ex-recruiters and HR professionals who guide students through resumes, interviews, and job search strategies.",
avatar: "CS",
color: "#3b82f6",
},
];
export default function About() {
return (
<div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fafafa", color: "#111" }}>
{/* ── HERO ── */}
<section style={{
background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 60%, #0f0c29 100%)",
padding: "80px 1.5rem",
textAlign: "center",
position: "relative",
overflow: "hidden",
}}>
<div style={{
position: "absolute", top: "-60px", right: "-60px",
width: "300px", height: "300px", borderRadius: "50%",
background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
pointerEvents: "none",
}} />

<div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
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
Our Story
</div>
<h1 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(2rem, 5vw, 3.4rem)",
fontWeight: 800,
color: "#fff",
lineHeight: 1.15,
marginBottom: "20px",
letterSpacing: "-0.03em",
}}>
About{" "}
<span style={{
background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
}}>
InnovationAILabs
</span>
</h1>
<p style={{
color: "rgba(255,255,255,0.6)",
fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
lineHeight: 1.7,
}}>
We empower learners with practical, industry-ready skills through
hands-on coding and AI education — built for the real world.
</p>
</div>
</section>
{/* ── VISION + MISSION ── */}
<section style={{ padding: "72px 1.5rem", background: "#fff" }}>

<div style={{
maxWidth: "1100px", margin: "0 auto",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
gap: "28px",
}}>
{[
{
icon: " ",
title: "Our Vision",
text: "To become India's most trusted platform for AI, coding, and full-stack education — helping students grow into job-ready professionals who build real-world products.",
accent: "#6366f1",
},
{
icon: " ",
title: "Our Mission",
text: "To provide affordable, high-quality, project-driven courses that bridge the gap between academics and industry expectations, unlocking career opportunities for every learner.",
accent: "#8b5cf6",
},
].map((card) => (
<div
key={card.title}
style={{
background: "#fafafa",
border: "1px solid #f0f0f0",
borderTop: `4px solid ${card.accent}`,
borderRadius: "16px",
padding: "36px 32px",
}}
>
<div style={{ fontSize: "2.4rem", marginBottom: "16px" }}>{card.icon}</div>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "1.4rem",
fontWeight: 800,
color: "#0f0c29",
marginBottom: "12px",
}}>
{card.title}
</h2>
<p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: "0.95rem" }}>
{card.text}
</p>
</div>
))}
</div>
</section>

{/* ── WHAT WE OFFER ── */}
<section style={{ padding: "72px 1.5rem", background: "#fafafa" }}>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: "48px" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
fontWeight: 800,
color: "#0f0c29",
marginBottom: "12px",
}}>
What We Offer
</h2>
<p style={{ color: "#6b7280", maxWidth: "440px", margin: "0 auto" }}>
Everything you need to go from learner to professional.
</p>
</div>
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
gap: "24px",
}}>
{[
{ icon: " ", title: "Project-Based Learning", desc: "Build real apps using React, Python, Flask, MySQL, and more — ready for your portfolio." },
{ icon: " ", title: "Internship Experience", desc: "Gain real-time experience through practical internship opportunities with our partners." },
{ icon: " ", title: "Career Mentorship", desc: "Resume building, mock interviews, LinkedIn optimization, and placement assistance." },
{ icon: " ", title: "Certified Courses", desc: "Earn industry-recognized certificates that validate your skills to employers." },
{ icon: " ", title: "Community Access", desc: "Join a network of 12,000+ learners, alumni, and mentors supporting each other." },
{ icon: " ", title: "Lifetime Updates", desc: "Curriculum is constantly updated to reflect the latest tools and industry practices." },
].map((f) => (
<div
key={f.title}
style={{
background: "#fff",
border: "1px solid #f0f0f0",
borderRadius: "14px",
padding: "28px 24px",
transition: "transform 0.2s, box-shadow 0.2s",
}}
onMouseOver={(e) => {
e.currentTarget.style.transform = "translateY(-4px)";
e.currentTarget.style.boxShadow = "0 12px 36px rgba(99,102,241,0.12)";
}}
onMouseOut={(e) => {
e.currentTarget.style.transform = "translateY(0)";

e.currentTarget.style.boxShadow = "none";
}}
>
<div style={{ fontSize: "2rem", marginBottom: "14px" }}>{f.icon}</div>
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,
fontSize: "1rem",
color: "#0f0c29",
marginBottom: "8px",
}}>
{f.title}
</h3>
<p style={{ color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6 }}>
{f.desc}
</p>
</div>
))}
</div>
</div>
</section>
{/* ── CORE VALUES ── */}
<section style={{
background: "linear-gradient(135deg, #0f0c29, #1a1a4e)",
padding: "72px 1.5rem",
color: "#fff",
}}>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: "48px" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
fontWeight: 800,
marginBottom: "12px",
}}>
Our Core Values
</h2>
<p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "400px", margin: "0 auto" }}>
The principles that guide everything we build and teach.
</p>
</div>
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
gap: "24px",

}}>
{[
{ icon: " ", title: "Quality Education", desc: "Deep understanding with strong fundamentals — no shortcuts, no fluff." },
{ icon: " ", title: "Student-First", desc: "Your growth is our priority. Personalized guidance at every step." },
{ icon: " ", title: "Innovation & Growth", desc: "Constantly evolving curriculum that keeps pace with industry trends." },
{ icon: " ", title: "Transparency", desc: "Honest pricing, clear outcomes, and no hidden agendas. Ever." },
].map((v) => (
<div
key={v.title}
style={{
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(255,255,255,0.1)",
borderRadius: "14px",
padding: "28px 24px",
transition: "background 0.2s",
}}
onMouseOver={(e) => (e.currentTarget.style.background = "rgba(167,139,250,0.1)")}
onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
>
<div style={{ fontSize: "2rem", marginBottom: "14px" }}>{v.icon}</div>
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,
fontSize: "1.05rem",
marginBottom: "8px",
}}>
{v.title}
</h3>
<p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.6 }}>
{v.desc}
</p>
</div>
))}
</div>
</div>
</section>
{/* ── TEAM ── */}
<section style={{ padding: "72px 1.5rem", background: "#fff" }}>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: "48px" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
fontWeight: 800,
color: "#0f0c29",
marginBottom: "12px",

}}>
Meet the Team
</h2>
<p style={{ color: "#6b7280", maxWidth: "400px", margin: "0 auto" }}>
Real people who are deeply invested in your success.
</p>
</div>
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: "24px",
}}>
{team.map((member) => (
<div
key={member.name}
style={{
background: "#fafafa",
border: "1px solid #f0f0f0",
borderRadius: "16px",
padding: "32px 24px",
textAlign: "center",
transition: "transform 0.2s, box-shadow 0.2s",
}}
onMouseOver={(e) => {
e.currentTarget.style.transform = "translateY(-4px)";
e.currentTarget.style.boxShadow = "0 12px 36px rgba(99,102,241,0.1)";
}}
onMouseOut={(e) => {
e.currentTarget.style.transform = "translateY(0)";
e.currentTarget.style.boxShadow = "none";
}}
>
<div style={{
width: "64px", height: "64px",
borderRadius: "50%",
background: `linear-gradient(135deg, ${member.color}, #0f0c29)`,
display: "flex", alignItems: "center", justifyContent: "center",
margin: "0 auto 16px",
color: "#fff", fontWeight: 800, fontSize: "1.1rem",
fontFamily: "'Syne', sans-serif",
}}>
{member.avatar}
</div>
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,

fontSize: "1.05rem",
color: "#0f0c29",
marginBottom: "4px",
}}>
{member.name}
</h3>
<div style={{
color: member.color,
fontSize: "0.82rem",
fontWeight: 600,
marginBottom: "12px",
textTransform: "uppercase",
letterSpacing: "0.05em",
}}>
{member.role}
</div>
<p style={{ color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6 }}>
{member.bio}
</p>
</div>
))}
</div>
</div>
</section>
{/* ── CONTACT ── */}
<section style={{ padding: "72px 1.5rem", background: "#fafafa" }}>
<div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
fontWeight: 800,
color: "#0f0c29",
marginBottom: "12px",
}}>
Get In Touch
</h2>
<p style={{ color: "#6b7280", marginBottom: "40px" }}>
Have questions? We're here to help you choose the right course.
</p>
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
gap: "16px",
marginBottom: "36px",
}}>

{[
{ icon: " ", label: "Email Us", value: "info@innovationailabs.in" },
{ icon: " ", label: "WhatsApp", value: "+91 98765 43210" },
{ icon: " ", label: "Website", value: "innovationailabs.in" },
].map((c) => (
<div key={c.label} style={{
background: "#fff",
border: "1px solid #f0f0f0",
borderRadius: "12px",
padding: "20px 16px",
}}>
<div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{c.icon}</div>
<div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f0c29", marginBottom: "4px", fontFamily: "'Syne', sans-serif" }}>
{c.label}
</div>
<div style={{ color: "#6b7280", fontSize: "0.82rem" }}>{c.value}</div>
</div>
))}
</div>
<Link
to="/courses"
style={{
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",
textDecoration: "none",
padding: "14px 36px",
borderRadius: "10px",
fontWeight: 700,
fontSize: "1rem",
fontFamily: "'Syne', sans-serif",
boxShadow: "0 8px 28px rgba(99,102,241,0.35)",
display: "inline-block",
}}
>
Start Learning Today →
</Link>
</div>
</section>
</div>
);
}