import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-[#F6F4ED] text-[#12172B]">
      {/* HERO */}
      <section className="max-w-[1280px] mx-auto grid md:grid-cols-[1.05fr_0.95fr] gap-14 px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-28 items-center animate-page-in">
        <div>
          <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#C9821B] mb-5">
            <span className="w-[7px] h-[7px] rounded-full bg-[#F2A93B]" />
            Project-based learning
          </div>
          <h1 className="font-['Sora',sans-serif] font-extrabold tracking-tight text-4xl md:text-[52px] leading-[1.08] max-w-xl">
            Learn to build the AI systems companies are hiring for.
          </h1>
          <p className="mt-6 text-lg text-[#2B3252] max-w-md">
            Hands-on courses in AI &amp; ML, Deep Learning, GenAI, and
            full-stack development — every module ends with something real
            in your portfolio, not just a certificate.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="premium-button bg-[#12172B] text-white font-bold text-[15.5px] px-7 py-[15px] rounded-[3px] hover:bg-[#232A4A] transition-colors"
            >
              Explore courses
            </Link>
            <Link
              to="/about"
              className="premium-button border-[1.5px] border-[#12172B] font-bold text-[15.5px] px-7 py-[15px] rounded-[3px] hover:bg-[#12172B] hover:text-white transition-colors"
            >
              Talk to a mentor
            </Link>
          </div>
        </div>

        {/* code panel */}
        <div className="bg-[#12172B] rounded-md overflow-hidden shadow-[0_24px_60px_-20px_rgba(18,23,43,0.35)] animate-premium-float">
          <div className="flex gap-[7px] px-4 py-3.5 bg-[#0C0F1E]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3A4266]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3A4266]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3A4266]" />
          </div>
          <div className="px-6 py-8 font-mono text-[13.5px] leading-relaxed text-[#B8C0E8]">
            <p className="text-[#6D77A8]">// week 6 — genai track</p>
            <p>
              <span className="text-[#F2A93B]">def</span>{" "}
              <span className="text-[#7FE0B8]">build_rag_pipeline</span>
              (docs):
            </p>
            <p>&nbsp;&nbsp;chunks = split(docs)</p>
            <p>&nbsp;&nbsp;index = embed_and_store(chunks)</p>
            <p>
              &nbsp;&nbsp;<span className="text-[#F2A93B]">return</span>{" "}
              QueryEngine(index)
            </p>
            <p className="text-[#6D77A8]">// deployed to your own project ✓</p>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24 md:pb-28">
        <div className="max-w-xl mb-12">
          <h2 className="font-['Sora',sans-serif] font-bold text-3xl md:text-[34px] tracking-tight">
            Three ways to go deep, not just wide.
          </h2>
          <p className="mt-3.5 text-[#2B3252]">
            Pick a track based on where you want to work, not just what
            sounds interesting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {[
            {
              num: "TRACK 01",
              title: "AI & Machine Learning",
              desc: "From data pipelines to deployed models — the foundations recruiters actually screen for.",
              items: ["Python for ML", "Model training & evaluation", "Capstone project"],
            },
            {
              num: "TRACK 02",
              title: "Deep Learning & GenAI",
              desc: "Build with transformers, fine-tuning, and retrieval — ship an LLM-backed app of your own.",
              items: ["Neural networks from scratch", "LLM fine-tuning & RAG", "Capstone project"],
            },
            {
              num: "TRACK 03",
              title: "Full-Stack Development",
              desc: "Ship production apps end to end — React, APIs, databases, and real deployment.",
              items: ["React & modern JS", "APIs & databases", "Capstone project"],
            },
          ].map((track) => (
            <div
              key={track.num}
              className="group relative bg-white border border-[#E4E0D2] p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_-18px_rgba(18,23,43,0.22)]"
            >
              <span className="absolute -top-px -left-px w-3.5 h-3.5 border-t-2 border-l-2 border-[#F2A93B]" />
              <span className="absolute -bottom-px -right-px w-3.5 h-3.5 border-b-2 border-r-2 border-[#F2A93B]" />
              <div className="font-['Sora',sans-serif] text-[13px] font-bold text-[#C9821B]">
                {track.num}
              </div>
              <h3 className="mt-3.5 text-xl font-bold">{track.title}</h3>
              <p className="mt-3 text-[14.5px] text-[#2B3252]">{track.desc}</p>
              <ul className="mt-5 text-[13.5px] text-[#2B3252]">
                {track.items.map((item, i) => (
                  <li
                    key={item}
                    className={`py-1.5 ${i !== 0 ? "border-t border-[#E4E0D2]" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* STRIP */}
      <section className="bg-[#12172B] text-white text-center px-6 py-16 md:py-[70px]">
        <h2 className="font-['Sora',sans-serif] font-bold text-2xl md:text-[30px] max-w-2xl mx-auto">
          Every course ends with something you built, not just something you
          watched.
        </h2>
        <p className="mt-4 text-[#9AA3CC] max-w-lg mx-auto">
          Get a mentor-reviewed portfolio project, not just a completion
          badge.
        </p>
        <Link
          to="/courses"
          className="premium-button inline-block mt-7 bg-[#F2A93B] text-[#12172B] font-bold text-[15px] px-6 py-[11px] rounded-[3px] hover:bg-[#F5BC63] transition-colors"
        >
          See how it works
        </Link>
      </section>
    </div>
  );
}