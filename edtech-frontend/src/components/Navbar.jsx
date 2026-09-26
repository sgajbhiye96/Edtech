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
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const linkClass = (path) =>
    `px-3.5 py-1.5 rounded-[3px] text-[0.92rem] transition-all duration-300 ${isActive(path)
      ? "text-[#12172B] font-semibold bg-[#F2A93B]/15 border-b-2 border-[#F2A93B]"
      : "text-[#2B3252] hover:text-[#12172B] border-b-2 border-transparent hover:-translate-y-0.5"}`;

  return (
    <nav className="bg-[#F6F4ED]/95 backdrop-blur-md border-b border-[#E4E0D2] sticky top-0 z-50 font-['Inter',sans-serif] transition-shadow duration-300 hover:shadow-[0_8px_24px_-18px_rgba(18,23,43,0.35)]">
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-[68px]">
        <Link to="/" className="flex items-center gap-2.5 no-underline transition-transform duration-300 hover:-translate-y-0.5">
          <img src="/logo.jpg" alt="InnovationAILabs" className="h-9 w-auto rounded" />
          <span className="font-['Sora',sans-serif] font-extrabold text-[1.1rem] tracking-tight text-[#12172B]">
            Innovation<span className="text-[#C9821B]">AI</span>Labs
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => <Link key={link.to} to={link.to} className={linkClass(link.to)}>{link.label}</Link>)}
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
              <button onClick={logout} className="bg-[#F3D8D5] border border-[#E3A9A3] text-[#B14A42] px-4 py-[7px] rounded-[3px] text-[0.9rem] font-medium hover:bg-[#EEC4BE] hover:-translate-y-0.5 transition-all duration-300">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 ml-2">
              <Link to="/login" className="text-[#12172B] px-4 py-[7px] rounded-[3px] text-[0.9rem] border border-[#12172B]/25 hover:bg-[#12172B]/5 hover:-translate-y-0.5 transition-all duration-300">Login</Link>
              <Link to="/register" className="bg-[#F2A93B] text-[#12172B] px-4 py-[7px] rounded-[3px] text-[0.9rem] font-bold hover:bg-[#F5BC63] hover:-translate-y-0.5 transition-all duration-300">Get Started</Link>
            </div>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#12172B] text-2xl bg-none border-none cursor-pointer p-1 transition-transform duration-300 hover:scale-105">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="bg-[#F6F4ED] border-t border-[#E4E0D2] px-6 py-4 flex flex-col gap-1 md:hidden animate-page-in">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={`px-3.5 py-2.5 rounded-[3px] text-[1rem] transition-all duration-300 ${isActive(link.to) ? "text-[#12172B] font-semibold bg-[#F2A93B]/15" : "text-[#2B3252] hover:bg-white hover:translate-x-1"}`}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-[#2B3252] px-3.5 py-2.5 rounded-[3px] text-[1rem] transition-all duration-300 hover:bg-white hover:translate-x-1">Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="bg-[#F3D8D5] border border-[#E3A9A3] text-[#B14A42] px-3.5 py-2.5 rounded-[3px] text-[1rem] text-left mt-1 transition-all duration-300 hover:-translate-y-0.5">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-[#12172B] px-3.5 py-2.5 rounded-[3px] border border-[#12172B]/25 text-center mt-2 transition-all duration-300 hover:-translate-y-0.5">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-[#F2A93B] text-[#12172B] px-3.5 py-2.5 rounded-[3px] text-center font-bold mt-1.5 transition-all duration-300 hover:-translate-y-0.5">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
