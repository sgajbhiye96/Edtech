import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const CATEGORIES = ["All", "AI & Machine Learning", "Full Stack", "Data Science", "Python", "React"];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-md overflow-hidden border border-[#E4E0D2] animate-pulse">
      <div className="h-[180px] bg-[#EDEAE0]" />
      <div className="p-5">
        <div className="h-4 bg-[#EDEAE0] rounded mb-2.5" />
        <div className="h-3 bg-[#EDEAE0] rounded w-[70%] mb-5" />
        <div className="h-9 bg-[#EDEAE0] rounded w-[40%]" />
      </div>
    </div>
  );
}

function getCourseList(data) {
  // Support both a plain DRF list and a paginated DRF response.
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return null;
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await API.get("/courses/");
      const list = getCourseList(response.data);
      if (!list) {
        throw new Error("The course API returned an unexpected response format.");
      }
      setCourses(list);
    } catch (err) {
      console.error("Failed to load courses", {
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        status: err?.response?.status,
        message: err?.message,
      });
      setError(
        err?.response?.status
          ? `We couldn't load courses (HTTP ${err.response.status}). Please try again.`
          : err?.message || "Unable to connect to the course service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filtered = courses.filter((course) => {
    const title = String(course.title || "");
    const description = String(course.description || "");
    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());
    // The current Course model has no category field; only filter by category
    // when the API actually provides one for a course.
    const matchCat =
      activeCategory === "All" ||
      String(course.category || "").toLowerCase().includes(activeCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div className="font-['Inter',sans-serif] bg-[#F6F4ED] min-h-screen">
      {/* HEADER */}
      <section className="bg-[#12172B] px-6 pt-16 pb-12 text-center animate-page-in">
        <h1 className="font-['Sora',sans-serif] text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Explore our <span className="text-[#F2A93B]">courses</span>
        </h1>
        <p className="text-[#9AA3CC] mb-8">Project-based learning for real-world careers.</p>
        <div className="max-w-[520px] mx-auto">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 rounded-[3px] border border-white/15 bg-white/8 text-white placeholder-white/50 text-[0.95rem] outline-none focus:border-[#F2A93B]/60"
          />
        </div>
      </section>

      <div className="bg-white border-b border-[#E4E0D2] px-6 overflow-x-auto">
        <div className="max-w-[1100px] mx-auto flex gap-1.5 py-3 whitespace-nowrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-1.5 rounded-full text-[0.88rem] transition-colors ${
                activeCategory === cat
                  ? "bg-[#12172B] text-white font-semibold"
                  : "text-[#2B3252] hover:bg-[#F6F4ED] font-normal"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="px-6 py-12 max-w-[1100px] mx-auto">
        {error && (
          <div role="alert" className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>{error}</p>
            <button
              type="button"
              onClick={loadCourses}
              className="mt-3 rounded bg-[#12172B] px-4 py-2 font-semibold text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <p className="text-[#9AA3CC] text-[0.88rem] mb-6">
            Showing <strong className="text-[#2B3252]">{filtered.length}</strong> course
            {filtered.length !== 1 ? "s" : ""}
            {search && ` for "${search}"`}
          </p>
        )}

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : !error && filtered.length > 0 ? (
            filtered.map((course) => (
              <div
                key={c.id}
                className="bg-white rounded-md overflow-hidden border border-[#E4E0D2] flex flex-col transition-all duration-500 hover:shadow-[0_18px_45px_-12px_rgba(18,23,43,0.18)] hover:-translate-y-1 hover:border-[#D7CDAF] animate-card-in"
              >
                <div className="relative">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-[180px] object-cover block"
                  />
                  {c.category && (
                    <span className="premium-badge absolute top-3 left-3 bg-[#12172B]/90 text-white text-[0.72rem] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {c.category}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="font-['Sora',sans-serif] font-bold text-[1.05rem] text-[#12172B] mb-2 leading-snug">
                    {course.title || "Untitled course"}
                  </h2>
                  <p className="text-[#2B3252] text-[0.88rem] leading-relaxed mb-auto pb-4">
                    {String(course.description || "").slice(0, 90)}
                    {String(course.description || "").length > 90 ? "…" : ""}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#EDEAE0]">
                    <div className="flex gap-3 text-[0.78rem] text-[#9AA3CC]">
                      {course.duration && <span>{course.duration}</span>}
                      {course.lessons_count && <span>{course.lessons_count} lessons</span>}
                    </div>
                    <Link
                      to={`/courses/${c.id}`}
                      className="premium-button bg-[#F2A93B] text-[#12172B] px-4 py-2 rounded-[3px] text-[0.85rem] font-bold whitespace-nowrap hover:bg-[#F5BC63] transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : !error ? (
            <div className="col-span-full text-center py-20 px-5 text-[#9AA3CC]">
              <h3 className="font-['Sora',sans-serif] text-[#2B3252] mb-2 text-lg font-semibold">
                No courses found
              </h3>
              <p className="text-[0.9rem]">Try a different search term or category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-4 bg-[#12172B] text-white border-none px-6 py-2.5 rounded-[3px] font-semibold text-[0.9rem] hover:bg-[#232A4A] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
