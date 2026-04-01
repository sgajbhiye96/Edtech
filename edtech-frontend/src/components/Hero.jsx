import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const TYPING_WORDS = [
  "Full Stack Developer",
  "Data Scientist",
  "AI Engineer",
  "ML Engineer",
  "Data Analyst",
];

const STATS = [
  { value: "2,500+", label: "Students Enrolled" },
  { value: "95%", label: "Placement Rate" },
  { value: "50+", label: "Industry Projects" },
  { value: "4.9★", label: "Average Rating" },
];

const FLOATING_CARDS = [
  { icon: "🎯", title: "Live Projects", sub: "Real industry work" },
  { icon: "🏆", title: "Certification", sub: "Industry recognized" },
  { icon: "💼", title: "Internship", sub: "Guaranteed exposure" },
  { icon: "🤖", title: "AI-Powered", sub: "Future-ready skills" },
];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const sliderRef = useRef(null);

  // ✅ Typing effect
  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    let timeout;

    if (!deleting && charIndex < word.length) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 80);
    } else if (!deleting && charIndex === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 40);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % TYPING_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex]);

  // ✅ Auto-scroll slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollBy({ left: 300, behavior: "smooth" });

      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0A1628] overflow-hidden flex flex-col justify-center">
      {/* background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full bg-blue-600 opacity-20 blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-60px] right-[-60px] w-[360px] h-[360px] rounded-full bg-purple-600 opacity-20 blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-500 opacity-10 blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* trust bar */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 py-2 px-4 text-center">
        <p className="text-white text-xs md:text-sm font-medium">
          🎓 Join <span className="font-bold">2,500+ students</span> · 🏆{" "}
          <span className="font-bold">95% Placement Rate</span> · ⭐{" "}
          <span className="font-bold">4.9/5 Rating</span>
        </p>
      </div>

      {/* main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* left */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Become a
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                {displayed}
                <span className="animate-pulse text-cyan-400">|</span>
              </span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
              Industry-ready certificate programs with{" "}
              <span className="text-cyan-400 font-semibold">live internships</span>,
              real-world projects, and{" "}
              <span className="text-purple-400 font-semibold">
                guaranteed placement support
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/courses"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-center shadow-md shadow-blue-500/30"
              >
                🚀 Explore Courses
              </Link>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-500 text-xs uppercase tracking-widest">
                Trusted by graduates at
              </span>
              {["Infosys", "TCS", "Accenture", "Wipro", "Capgemini"].map((c) => (
                <span
                  key={c}
                  className="text-gray-400 text-xs font-semibold border border-gray-700 rounded px-2 py-0.5"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* floating cards */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {FLOATING_CARDS.map((card, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition duration-300"
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-white text-sm font-bold mb-1">{card.title}</h3>
                <p className="text-gray-400 text-xs">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center hover:bg-white/10 transition"
            >
              <p className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth mt-10 py-2"
        >
          {["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"].map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-56 md:w-72 h-36 md:h-44 rounded-2xl overflow-hidden border border-white/10 hover:scale-105 transition"
            >
              {img}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}