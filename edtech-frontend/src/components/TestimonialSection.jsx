import { useEffect, useRef } from "react";

export function TestimonialSection() {
  const testimonials = [
    {
      name: "Rahul Sharma – Software Developer at Infosys",
      feedback:
        "The React Bootcamp helped me get my first developer job with real-world projects!",
    },
    {
      name: "Sneha Patil – Data Analyst at Accenture",
      feedback:
        "The Data Science program gave me Python, SQL, and BI confidence. Internship was great!",
    },
    {
      name: "Aditya Verma – Freelance Full‑Stack Developer",
      feedback:
        "Very practical training. I built 4 client projects after this course.",
    },
    {
      name: "Priya Menon – Frontend Engineer at TCS",
      feedback:
        "The assignments were industry-level. Helped me clear frontend interviews easily.",
    },
    {
      name: "Rohan Kulkarni – B.Tech Student",
      feedback:
        "Before this course, coding was tough. Now I have multiple projects and internship offers.",
    }
  ];

  const sliderRef = useRef(null);

  // ✅ Auto-scroll effect
  useEffect(() => {
    const slider = sliderRef.current;

    const interval = setInterval(() => {
      if (slider) {
        // Scroll right slightly every interval
        slider.scrollBy({ left: 320, behavior: "smooth" });

        // If reached end → jump back to start for infinite loop
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
          slider.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 2500); // Scroll every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-14 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          What Our Students Say
        </h2>

        {/* ✅ Auto-scrolling horizontal slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[300px] bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex-shrink-0"
            >
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                “{t.feedback}”
              </p>
              <h4 className="font-bold text-lg dark:text-white">
                {t.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}