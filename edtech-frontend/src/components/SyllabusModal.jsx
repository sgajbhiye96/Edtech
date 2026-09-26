// src/components/SyllabusModal.jsx
import { useState } from "react";
import API from "../services/api";

export default function SyllabusModal({ course, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    course_interested: course.title,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/leads/", form);
      if (course.syllabus) {
        try {
          const response = await fetch(course.syllabus);
          if (!response.ok) throw new Error("Unable to fetch syllabus");
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = course.title + "-syllabus.pdf";
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } catch (downloadError) {
          console.warn("Direct syllabus download failed:", downloadError);
          window.open(course.syllabus, "_blank", "noopener,noreferrer");
        }
      } else {
        alert("Syllabus not available yet!");
      }
      onClose();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#12172B]/60 flex items-center justify-center z-50 px-4 font-['Inter',sans-serif]">
      <div className="bg-white rounded-md w-full max-w-md p-6 md:p-8 relative border border-[#E4E0D2]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9AA3CC] hover:text-[#12172B] text-2xl leading-none"
        >
          ✕
        </button>

        <h2 className="font-['Sora',sans-serif] text-xl md:text-2xl font-bold mb-2 text-[#12172B]">
          Download syllabus
        </h2>
        <p className="text-[#2B3252] text-sm mb-6">
          Fill in your details to download the syllabus for{" "}
          <span className="font-semibold text-[#C9821B]">{course.title}</span>
        </p>

        {error && (
          <p className="text-[#B14A42] text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            required
            className="w-full px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] text-sm text-[#12172B] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
            placeholder="Full name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            className="w-full px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] text-sm text-[#12172B] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
            placeholder="Email address *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            type="tel"
            maxLength={10}
            className="w-full px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] text-sm text-[#12172B] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
            placeholder="Mobile number *"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          <input
            required
            className="w-full px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] text-sm text-[#12172B] focus:outline-none focus:ring-2 focus:ring-[#F2A93B]"
            placeholder="City *"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            className="w-full px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] bg-[#F6F4ED] text-sm text-[#2B3252]"
            value={form.course_interested}
            readOnly
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-[3px] font-bold transition-colors ${
              loading
                ? "bg-[#C9CBD6] text-white cursor-not-allowed"
                : "bg-[#12172B] text-white hover:bg-[#232A4A]"
            }`}
          >
            {loading ? "Please wait..." : "Download syllabus"}
          </button>
        </form>
      </div>
    </div>
  );
}