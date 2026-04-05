import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
const CATEGORIES = ["All", "AI & Machine Learning", "Full Stack", "Data Science", "Python", "React"];
function SkeletonCard() {
return (
<div style={{
background: "#fff",
borderRadius: "16px",
overflow: "hidden",
border: "1px solid #f0f0f0",
animation: "pulse 1.5s ease-in-out infinite",
}}>
<div style={{ height: "180px", background: "#f3f4f6" }} />
<div style={{ padding: "20px" }}>
<div style={{ height: "16px", background: "#f3f4f6", borderRadius: "8px", marginBottom: "10px" }} />
<div style={{ height: "12px", background: "#f3f4f6", borderRadius: "8px", width: "70%", marginBottom: "20px" }} />
<div style={{ height: "36px", background: "#f3f4f6", borderRadius: "8px", width: "40%" }} />
</div>
<style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
</div>
);
}
export default function Courses() {
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [activeCategory, setActiveCategory] = useState("All");
useEffect(() => {
API.get("/courses/")
.then((res) => {
setCourses(res.data);
setLoading(false);
})
.catch(() => setLoading(false));
}, []);
const filtered = courses.filter((c) => {
const matchSearch =
c.title.toLowerCase().includes(search.toLowerCase()) ||

c.description?.toLowerCase().includes(search.toLowerCase());
const matchCat =
activeCategory === "All" ||
c.category?.toLowerCase().includes(activeCategory.toLowerCase());
return matchSearch && matchCat;
});
return (
<div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fafafa", minHeight: "100vh" }}>
{/* ── HEADER ── */}
<section style={{
background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 60%, #0f0c29 100%)",
padding: "60px 1.5rem 48px",
textAlign: "center",
}}>
<h1 style={{
fontFamily: "'Syne', sans-serif",
fontSize: "clamp(1.8rem, 4vw, 3rem)",
fontWeight: 800,
color: "#fff",
marginBottom: "12px",
letterSpacing: "-0.02em",
}}>
Explore Our{" "}
<span style={{
background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
}}>
Courses
</span>
</h1>
<p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "32px", fontSize: "1rem" }}>
Project-based learning for real-world careers.
</p>
{/* Search Bar */}
<div style={{ maxWidth: "520px", margin: "0 auto", position: "relative" }}>
<span style={{
position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
fontSize: "1.1rem", pointerEvents: "none",
}}>
</span>
<input
type="text"

placeholder="Search courses..."
value={search}
onChange={(e) => setSearch(e.target.value)}
style={{
width: "100%",
padding: "14px 18px 14px 46px",
borderRadius: "12px",
border: "1px solid rgba(255,255,255,0.15)",
background: "rgba(255,255,255,0.08)",
color: "#fff",
fontSize: "0.95rem",
outline: "none",
boxSizing: "border-box",
backdropFilter: "blur(8px)",
}}
/>
</div>
</section>
{/* ── CATEGORY FILTER ── */}
<div style={{
background: "#fff",
borderBottom: "1px solid #f0f0f0",
padding: "0 1.5rem",
overflowX: "auto",
}}>
<div style={{
maxWidth: "1100px",
margin: "0 auto",
display: "flex",
gap: "4px",
padding: "12px 0",
whiteSpace: "nowrap",
}}>
{CATEGORIES.map((cat) => (
<button
key={cat}
onClick={() => setActiveCategory(cat)}
style={{
padding: "7px 18px",
borderRadius: "999px",
border: "none",
cursor: "pointer",
fontSize: "0.88rem",
fontWeight: activeCategory === cat ? 700 : 400,
background: activeCategory === cat
? "linear-gradient(135deg, #6366f1, #8b5cf6)"

: "transparent",
color: activeCategory === cat ? "#fff" : "#6b7280",
transition: "all 0.2s",
fontFamily: "'DM Sans', sans-serif",
}}
>
{cat}
</button>
))}
</div>
</div>
{/* ── COURSES GRID ── */}
<section style={{ padding: "48px 1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
{/* Result count */}
{!loading && (
<p style={{ color: "#9ca3af", fontSize: "0.88rem", marginBottom: "24px" }}>
Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> course{filtered.length !== 1 ? "s" : ""}
{search && ` for "${search}"`}
</p>
)}
<div style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
gap: "24px",
}}>
{loading
? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
: filtered.length > 0
? filtered.map((c) => (
<div
key={c.id}
style={{
background: "#fff",
borderRadius: "16px",
overflow: "hidden",
border: "1px solid #f0f0f0",
boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
transition: "transform 0.2s, box-shadow 0.2s",
display: "flex",
flexDirection: "column",
}}
onMouseOver={(e) => {
e.currentTarget.style.transform = "translateY(-4px)";
e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.15)";

}}
onMouseOut={(e) => {
e.currentTarget.style.transform = "translateY(0)";
e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
}}
>
<div style={{ position: "relative" }}>
<img
src={c.thumbnail}
alt={c.title}
style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
/>
{c.category && (
<span style={{
position: "absolute", top: "12px", left: "12px",
background: "rgba(99,102,241,0.9)",
color: "#fff",
fontSize: "0.72rem",
fontWeight: 600,
padding: "4px 10px",
borderRadius: "999px",
textTransform: "uppercase",
letterSpacing: "0.05em",
}}>
{c.category}
</span>
)}
</div>
<div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
<h2 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,
fontSize: "1.05rem",
color: "#0f0c29",
marginBottom: "8px",
lineHeight: 1.3,
}}>
{c.title}
</h2>
<p style={{
color: "#6b7280",
fontSize: "0.88rem",
lineHeight: 1.6,
marginBottom: "auto",
paddingBottom: "16px",
}}>

{c.description?.slice(0, 90)}...
</p>
{/* Meta row */}
<div style={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
paddingTop: "16px",
borderTop: "1px solid #f3f4f6",
}}>
<div style={{ display: "flex", gap: "12px", fontSize: "0.78rem", color: "#9ca3af" }}>
{c.duration && <span> {c.duration}</span>}
{c.lessons_count && <span> {c.lessons_count} lessons</span>}
</div>
<Link
to={`/courses/${c.id}`}
style={{
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",
textDecoration: "none",
padding: "8px 16px",
borderRadius: "8px",
fontSize: "0.85rem",
fontWeight: 600,
whiteSpace: "nowrap",
}}
>
View →
</Link>
</div>
</div>
</div>
))
: (
<div style={{
gridColumn: "1 / -1",
textAlign: "center",
padding: "80px 20px",
color: "#9ca3af",
}}>
<div style={{ fontSize: "3rem", marginBottom: "16px" }}> </div>
<h3 style={{ fontFamily: "'Syne', sans-serif", color: "#374151", marginBottom: "8px" }}>
No courses found
</h3>
<p style={{ fontSize: "0.9rem" }}>
Try a different search term or category.

</p>
<button
onClick={() => { setSearch(""); setActiveCategory("All"); }}
style={{
marginTop: "16px",
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",
border: "none",
padding: "10px 24px",
borderRadius: "8px",
cursor: "pointer",
fontWeight: 600,
fontSize: "0.9rem",
}}
>
Clear Filters
</button>
</div>
)
}
</div>
</section>
</div>
);
}