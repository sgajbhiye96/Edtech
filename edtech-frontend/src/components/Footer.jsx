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
  { icon: "📍", text: "Nagpur, Maharashtra, India" },
  { icon: "📧", text: "info@innovationailabs.in" },
  { icon: "📞", text: "+91 XXXXX XXXXX" },
  { icon: "🌐", text: "www.innovationailabs.in" },
];

const SOCIAL = [
  { icon: "in", label: "LinkedIn", href: "#" },
  { icon: "yt", label: "YouTube", href: "#" },
  { icon: "ig", label: "Instagram", href: "#" },
  { icon: "tw", label: "Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[#0A1628] text-gray-300 border-t border-white/10">

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-1">
              Ready to Launch Your Tech Career? 🚀
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              Join 2,500+ students who got placed after completing our programs.
            </p>
          </div>
          <Link
            to="/courses"
            className="shrink-0 px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
          >
            Explore Courses →
          </Link>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="InnovationAILabs" className="h-10 w-auto" />
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            India's most trusted EdTech platform for AI, Data Science, and Full Stack development.
            Project-based learning with live internships.
          </p>

          <div className="flex gap-3">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Courses Column */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
            Our Programs
          </h3>
          <ul className="space-y-3">
            {COURSES.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className="text-gray-400 text-sm hover:text-cyan-400 transition flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-500 group-hover:bg-cyan-400 transition" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
            Company
          </h3>
          <ul className="space-y-3">
            {COMPANY.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className="text-gray-400 text-sm hover:text-cyan-400 transition flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-500 group-hover:bg-cyan-400 transition" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
            Contact Us
          </h3>
          <ul className="space-y-4">
            {CONTACT.map((c) => (
              <li key={c.text} className="flex items-start gap-3">
                <span className="text-base">{c.icon}</span>
                <span className="text-gray-400 text-sm leading-relaxed">{c.text}</span>
              </li>
            ))}
          </ul>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-white text-xs font-bold uppercase tracking-wider mb-2">
              Get Free Career Tips
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition font-bold">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Band */}
      <div className="border-t border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-6 text-center">
          {[
            ["2,500+", "Students Enrolled"],
            ["95%", "Placement Rate"],
            ["5", "Programs Offered"],
            ["4.9★", "Average Rating"],
            ["50+", "Industry Projects"],
          ].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {val}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} InnovationAILabs. All rights reserved. Made with ❤️ in Nagpur, India.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
``