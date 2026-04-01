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
    <footer className="bg-[#050B16] text-gray-200 border-t border-white/10">

      {/* ✅ Top CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 py-10 px-6 shadow-lg rounded-t-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h2 className="text-white text-3xl font-extrabold">
              Ready to Transform Your Career? 🚀
            </h2>
            <p className="text-blue-50 text-sm mt-2">
              Join 2,500+ students already building their future with InnovationAILabs.
            </p>
          </div>

          <Link
            to="/courses"
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-200 transition shadow-lg"
          >
            Explore Courses →
          </Link>
        </div>
      </div>

      {/* ✅ Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* ✅ Brand Section */}
        <div>
          <img src="/logo.png" alt="InnovationAILabs" className="h-10 w-auto mb-4" />

          <p className="text-gray-200 text-sm leading-relaxed">
            India's most trusted EdTech platform for AI, Data Science & Full-Stack Development.
            Real-world projects + live internships + job-oriented programs.
          </p>

          {/* ✅ Social Icons */}
          <div className="flex gap-3 mt-5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ✅ Our Programs */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
            Our Programs
          </h3>
          <ul className="space-y-3">
            {COURSES.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className="flex items-center gap-2 text-gray-200 hover:text-cyan-400 transition group"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-cyan-300" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Company */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
            Company
          </h3>
          <ul className="space-y-3">
            {COMPANY.map((c) => (
              <li key={c.name}>
                <Link
                  to={c.path}
                  className="flex items-center gap-2 text-gray-200 hover:text-cyan-400 transition group"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-cyan-300" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Contact Us */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
            Contact Us
          </h3>
          <ul className="space-y-4">
            {CONTACT.map((c) => (
              <li key={c.text} className="flex items-start gap-3">
                <span className="text-lg">{c.icon}</span>
                <span className="text-gray-200 text-sm">{c.text}</span>
              </li>
            ))}
          </ul>

          {/* ✅ Newsletter */}
          <div className="mt-6">
            <p className="text-white text-xs uppercase font-bold tracking-widest mb-3">
              Get Free Career Tips
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 outline-none"
              />
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition text-white font-bold">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Section */}
      <div className="border-t border-white/10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-center gap-3">
          <p className="text-gray-300 text-xs">
            © {new Date().getFullYear()} InnovationAILabs. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-gray-300">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}