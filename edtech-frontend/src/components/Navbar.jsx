import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Navbar() {
const { user, logout } = useContext(AuthContext);
const [menuOpen, setMenuOpen] = useState(false);
const location = useLocation();
const navLinks = [
{ to: "/", label: "Home" },
{ to: "/courses", label: "Courses" },
{ to: "/about", label: "About Us" },
];
const isActive = (path) =>
path === "/"
? location.pathname === "/"
: location.pathname.startsWith(path);
return (
<nav
style={{
background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #0f0c29 100%)",
borderBottom: "1px solid rgba(99,102,241,0.2)",
position: "sticky",
top: 0,
zIndex: 50,
fontFamily: "'DM Sans', sans-serif",
}}
>
<div
style={{
maxWidth: "1280px",
margin: "0 auto",
padding: "0 1.5rem",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
height: "68px",
}}
>
{/* Logo */}
<Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>

<img src="/logo.jpg" alt="InnovationAILabs" style={{ height: "42px", width: "auto", borderRadius: "8px" }} />
<span
style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 800,
fontSize: "1.1rem",
background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
letterSpacing: "-0.02em",
}}
>
InnovationAILabs
</span>
</Link>
{/* Desktop Nav */}
<div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-nav">
{navLinks.map((link) => (
<Link
key={link.to}
to={link.to}
style={{
color: isActive(link.to) ? "#a78bfa" : "rgba(255,255,255,0.75)",
textDecoration: "none",
padding: "6px 14px",
borderRadius: "8px",
fontSize: "0.92rem",
fontWeight: isActive(link.to) ? 600 : 400,
background: isActive(link.to) ? "rgba(167,139,250,0.1)" : "transparent",
borderBottom: isActive(link.to) ? "2px solid #a78bfa" : "2px solid transparent",
transition: "all 0.2s",
}}
>
{link.label}
</Link>
))}
{user ? (
<div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
<Link
to="/dashboard"
style={{
color: isActive("/dashboard") ? "#a78bfa" : "rgba(255,255,255,0.75)",
textDecoration: "none",
padding: "6px 14px",
borderRadius: "8px",

fontSize: "0.92rem",
background: isActive("/dashboard") ? "rgba(167,139,250,0.1)" : "transparent",
borderBottom: isActive("/dashboard") ? "2px solid #a78bfa" : "2px solid transparent",
}}
>
Dashboard
</Link>
<button
onClick={logout}
style={{
background: "rgba(239,68,68,0.15)",
border: "1px solid rgba(239,68,68,0.4)",
color: "#f87171",
padding: "7px 18px",
borderRadius: "8px",
cursor: "pointer",
fontSize: "0.9rem",
fontWeight: 500,
transition: "all 0.2s",
}}
onMouseOver={(e) => (e.target.style.background = "rgba(239,68,68,0.3)")}
onMouseOut={(e) => (e.target.style.background = "rgba(239,68,68,0.15)")}
>
Logout
</button>
</div>
) : (
<div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "8px" }}>
<Link
to="/login"
style={{
color: "rgba(255,255,255,0.85)",
textDecoration: "none",
padding: "7px 18px",
borderRadius: "8px",
fontSize: "0.9rem",
border: "1px solid rgba(255,255,255,0.2)",
transition: "all 0.2s",
}}
>
Login
</Link>
<Link
to="/register"
style={{
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",

textDecoration: "none",
padding: "7px 18px",
borderRadius: "8px",
fontSize: "0.9rem",
fontWeight: 600,
boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
transition: "all 0.2s",
}}
>
Get Started
</Link>
</div>
)}
</div>
{/* Hamburger */}
<button
onClick={() => setMenuOpen(!menuOpen)}
style={{
display: "none",
background: "none",
border: "none",
color: "white",
fontSize: "1.5rem",
cursor: "pointer",
padding: "4px",
}}
className="hamburger-btn"
>
{menuOpen ? "✕" : "☰"}
</button>
</div>
{/* Mobile Menu */}
{menuOpen && (
<div
style={{
background: "rgba(15,12,41,0.98)",
borderTop: "1px solid rgba(99,102,241,0.2)",
padding: "1rem 1.5rem 1.5rem",
display: "flex",
flexDirection: "column",
gap: "4px",
}}
>
{navLinks.map((link) => (
<Link

key={link.to}
to={link.to}
onClick={() => setMenuOpen(false)}
style={{
color: isActive(link.to) ? "#a78bfa" : "rgba(255,255,255,0.8)",
textDecoration: "none",
padding: "10px 14px",
borderRadius: "8px",
fontSize: "1rem",
fontWeight: isActive(link.to) ? 600 : 400,
background: isActive(link.to) ? "rgba(167,139,250,0.1)" : "transparent",
}}
>
{link.label}
</Link>
))}
{user ? (
<>
<Link
to="/dashboard"
onClick={() => setMenuOpen(false)}
style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "10px 14px", borderRadius: "8px" }}
>
Dashboard
</Link>
<button
onClick={() => { logout(); setMenuOpen(false); }}
style={{
background: "rgba(239,68,68,0.15)",
border: "1px solid rgba(239,68,68,0.4)",
color: "#f87171",
padding: "10px 14px",
borderRadius: "8px",
cursor: "pointer",
fontSize: "1rem",
textAlign: "left",
marginTop: "4px",
}}
>
Logout
</button>
</>
) : (
<>
<Link
to="/login"
onClick={() => setMenuOpen(false)}

style={{
color: "rgba(255,255,255,0.85)",
textDecoration: "none",
padding: "10px 14px",
borderRadius: "8px",
border: "1px solid rgba(255,255,255,0.2)",
textAlign: "center",
marginTop: "8px",
}}
>
Login
</Link>
<Link
to="/register"
onClick={() => setMenuOpen(false)}
style={{
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",
textDecoration: "none",
padding: "10px 14px",
borderRadius: "8px",
textAlign: "center",
fontWeight: 600,
marginTop: "6px",
}}
>
Get Started
</Link>
</>
)}
</div>
)}
<style>{`
@media (max-width: 768px) {
.desktop-nav { display: none !important; }
.hamburger-btn { display: block !important; }
}
`}</style>
</nav>
);
}