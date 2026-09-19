import { Link } from "react-router-dom";

const team = [
  {
    name: "Siddharth Gajbhiye",
    role: "Founder & Lead Instructor",
    bio: "Full-stack developer and educator with 8+ years of industry experience. Passionate about making tech education accessible.",
    avatar: "SG",
  },
  {
    name: "Experienced Curriculum Team",
    role: "Course Designers",
    bio: "Industry professionals from top tech companies who design and continuously update our hands-on project curriculum.",
    avatar: "AC",
  },
  {
    name: "Career Support Team",
    role: "Placement Mentors",
    bio: "Ex-recruiters and HR professionals who guide students through resumes, interviews, and job search strategies.",
    avatar: "CS",
  },
];

const offerings = [
  { title: "Project-Based Learning", desc: "Build real apps using React, Python, Flask, MySQL, and more — ready for your portfolio." },
  { title: "Internship Experience", desc: "Gain real-time experience through practical internship opportunities with our partners." },
  { title: "Career Mentorship", desc: "Resume building, mock interviews, LinkedIn optimization, and placement assistance." },
  { title: "Certified Courses", desc: "Earn industry-recognized certificates that validate your skills to employers." },
  { title: "Community Access", desc: "Join a network of learners, alumni, and mentors supporting each other." },
  { title: "Lifetime Updates", desc: "Curriculum is constantly updated to reflect the latest tools and industry practices." },
];

const values = [
  { title: "Quality Education", desc: "Deep understanding with strong fundamentals — no shortcuts, no fluff." },
  { title: "Student-First", desc: "Your growth is our priority. Personalized guidance at every step." },
  { title: "Innovation & Growth", desc: "Constantly evolving curriculum that keeps pace with industry trends." },
  { title: "Transparency", desc: "Honest pricing, clear outcomes, and no hidden agendas. Ever." },
];

const contacts = [
  { label: "Email us", value: "care@innovationailabs.in" },
  { label: "WhatsApp", value: "+91 8482821174" },
  { label: "Website", value: "innovationailabs.in" },
];

export default function About() {
  return (
    <div className="font-['Inter',sans-serif] bg-[#F6F4ED] text-[#12172B]">
      {/* HERO */}
      <section className="bg-[#12172B] px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#F2A93B] mb-6">
            <span className="w-[7px] h-[7px] rounded-full bg-[#F2A93B]" />
            Our story
          </div>
          <h1 className="font-['Sora',sans-serif] text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5 tracking-tight">
            About InnovationAILabs
          </h1>
          <p className="text-[#9AA3CC] text-base md:text-lg leading-relaxed">
            We empower learners with practical, industry-ready skills through
            hands-on coding and AI education — built for the real world.
          </p>
        </div>
      </section>

      {/* VISION + MISSION */}
      <section className="px-6 py-16 md:py-20 bg-white">
        <div className="max-w-[1100px] mx-auto grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {[
            {
              title: "Our vision",
              text: "To become India's most trusted platform for AI, coding, and full-stack education — helping students grow into job-ready professionals who build real-world products.",
            },
            {
              title: "Our mission",
              text: "To provide affordable, high-quality, project-driven courses that bridge the gap between academics and industry expectations, unlocking career opportunities for every learner.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#F6F4ED] border border-[#E4E0D2] border-t-4 border-t-[#F2A93B] p-9"
            >
              <h2 className="font-['Sora',sans-serif] text-xl md:text-2xl font-bold mb-3">
                {card.title}
              </h2>
              <p className="text-[#2B3252] leading-relaxed text-[0.95rem]">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="px-6 py-16 md:py-20 bg-[#F6F4ED]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Sora',sans-serif] text-3xl md:text-[2.6rem] font-extrabold mb-3">
              What we offer
            </h2>
            <p className="text-[#2B3252] max-w-md mx-auto">
              Everything you need to go from learner to professional.
            </p>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {offerings.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-[#E4E0D2] p-7 hover:border-[#F2A93B] transition-colors"
              >
                <h3 className="font-['Sora',sans-serif] font-bold text-base mb-2.5">
                  {f.title}
                </h3>
                <p className="text-[#2B3252] text-[0.88rem] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-[#12172B] px-6 py-16 md:py-20 text-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Sora',sans-serif] text-3xl md:text-[2.6rem] font-extrabold mb-3">
              Our core values
            </h2>
            <p className="text-[#9AA3CC] max-w-md mx-auto">
              The principles that guide everything we build and teach.
            </p>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white/5 border border-white/10 p-7 hover:bg-[#F2A93B]/10 transition-colors"
              >
                <h3 className="font-['Sora',sans-serif] font-bold text-[1.05rem] mb-2.5">
                  {v.title}
                </h3>
                <p className="text-[#9AA3CC] text-[0.88rem] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="px-6 py-16 md:py-20 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Sora',sans-serif] text-3xl md:text-[2.6rem] font-extrabold mb-3">
              Meet the team
            </h2>
            <p className="text-[#2B3252] max-w-md mx-auto">
              Real people who are deeply invested in your success.
            </p>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-[#F6F4ED] border border-[#E4E0D2] p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#12172B] flex items-center justify-center mx-auto mb-4 text-[#F2A93B] font-extrabold text-lg font-['Sora',sans-serif]">
                  {member.avatar}
                </div>
                <h3 className="font-['Sora',sans-serif] font-bold text-[1.05rem] mb-1">
                  {member.name}
                </h3>
                <div className="text-[#C9821B] text-[0.82rem] font-semibold mb-3 uppercase tracking-wide">
                  {member.role}
                </div>
                <p className="text-[#2B3252] text-[0.88rem] leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-6 py-16 md:py-20 bg-[#F6F4ED]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-['Sora',sans-serif] text-3xl md:text-[2.4rem] font-extrabold mb-3">
            Get in touch
          </h2>
          <p className="text-[#2B3252] mb-10">
            Have questions? We're here to help you choose the right course.
          </p>
          <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {contacts.map((c) => (
              <div key={c.label} className="bg-white border border-[#E4E0D2] p-5">
                <div className="font-['Sora',sans-serif] font-semibold text-[0.85rem] mb-1">
                  {c.label}
                </div>
                <div className="text-[#2B3252] text-[0.82rem]">{c.value}</div>
              </div>
            ))}
          </div>
          <Link
            to="/courses"
            className="inline-block bg-[#F2A93B] text-[#12172B] px-9 py-3.5 rounded-[3px] font-bold text-base hover:bg-[#F5BC63] transition-colors"
          >
            Start learning today
          </Link>
        </div>
      </section>
    </div>
  );
}