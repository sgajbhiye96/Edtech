import { Link } from "react-router-dom";

const COURSES = [
  { name: "Python Full Stack", path: "/courses/1" },
  { name: "Data Analytics", path: "/courses/2" },
  { name: "Agentic AI", path: "/courses/3" },
  { name: "AI & Machine Learning", path: "/courses/4" },
  { name: "Data Science", path: "/courses/5" },
];

const COMPANY = [
  { name: "About Us", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

const CONTACT = [
  { icon: "📍", text: "Vidya Nagar, Nagpur, Maharashtra" },
  { icon: "📧", text: "care@innovationailabs.in" },
  { icon: "📞", text: "+91 8482821174" },
  { icon: "🌐", text: "www.innovationailabs.in" },
];

const SOCIAL = [
  { icon: "in", label: "LinkedIn", href: "#" },
  { icon: "yt", label: "YouTube", href: "#" },
  { icon: "ig", label: "Instagram", href: "https://www.instagram.com/innovaailab" },
  { icon: "tw", label: "Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[#050B16] text-gray-200 pt-16 border-t border-white/10">

      {/* ✅ TOP CTA BANNER */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-blue-700 px-6 py-10 rounded-t-3xl shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
          
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              Ready to Transform Your Career? 🚀
            </h2>
            <p className="text-blue-100 text-sm mt-2">
              Join 2,500+ students already building their future with InnovationAILabs.
            </p>
          </div>

          <Link
            to="/courses"
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
          >
            Explore Courses →
          </Link>

        </div>
      </div>

      {/* ✅ MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-14">

        {/* ✅ Brand */}
        <div>
          <img src="/logo.png" alt="InnovationAILabs" className="h-12 mb-5 opacity-90" />

          <p className="text-gray-300 leading-relaxed text-sm">
            India’s most trusted platform for AI, Data Science & Full‑Stack Development.
            Learn through real‑world projects, live internships & job‑oriented programs.
          </p>

          {/* ✅ Social Icons */}
          <div className="flex gap-3 mt-5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-200 hover:bg-blue-600 hover:border-blue-600 transition-all font-bold"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ✅ Courses */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Our Programs</h3>

          <ul className="space-y-3">
            {COURSES.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className="group flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-cyan-400" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Company Links */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Company</h3>

          <ul className="space-y-3">
            {COMPANY.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className="group flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-cyan-400" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Contact */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact Us</h3>

          <ul className="space-y-4">
            {CONTACT.map((c) => (
              <li key={c.text} className="flex items-start gap-3">
                <span className="text-lg">{c.icon}</span>
                <span className="text-gray-300 text-sm">{c.text}</span>
              </li>
            ))}
          </ul>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-white text-xs uppercase tracking-widest mb-2">
              Get Free Career Tips
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold">
                →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ✅ Bottom */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center gap-3">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} InnovationAILabs. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-200 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-200 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-200 transition">Refund Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
}