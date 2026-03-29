import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export function FeaturedCourses({ courses }) {
  const sliderRef = useRef(null);

  // ✅ Auto-scroll slider
  useEffect(() => {
    const slider = sliderRef.current;

    const interval = setInterval(() => {
      if (!slider) return;

      slider.scrollBy({ left: 330, behavior: "smooth" });

      // loop to start
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-14 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Featured Courses
        </h2>

        {/* ✅ Horizontal slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-4"
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-4 flex-shrink-0"
              style={{
                minWidth: "380px", // ✅ Adjust width like screenshot
                maxWidth: "380px",
              }}
            >
              {/* ✅ BIG RECTANGLE IMAGE LIKE YOUR SCREENSHOT */}
              <div className="w-full h-48 rounded-xl overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt="course thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ✅ TITLE */}
              <h3 className="font-bold text-lg dark:text-white mt-4">
                {course.title}
              </h3>

              {/* ✅ SHORT DESCRIPTION */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">
                {course.description}
              </p>

              {/* ✅ VIEW BUTTON */}
              <Link
                to={`/courses/${course.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Course
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}