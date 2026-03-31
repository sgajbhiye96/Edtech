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
     // Save lead to backend
     await API.post("/leads/", form);
     // Download syllabus PDF
     if (course.syllabus) {
       const link = document.createElement("a");
       link.href = course.syllabus;
       link.target = "_blank";
       link.download = `${course.title}-syllabus.pdf`;
       link.click();
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
   // Dark overlay
<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
     {/* Modal box */}
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 relative">
       {/* Close button */}
<button
         onClick={onClose}
         className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
>
         ✕
</button>
<h2 className="text-xl md:text-2xl font-bold mb-2 dark:text-white">
         Download Syllabus
</h2>
<p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
         Fill in your details to download the syllabus for{" "}
<span className="font-semibold text-blue-600">{course.title}</span>
</p>
       {error && (
<p className="text-red-500 text-sm mb-4 text-center">{error}</p>
       )}
<form onSubmit={handleSubmit} className="space-y-4">
<input
           required
           className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
           placeholder="Full Name *"
           value={form.name}
           onChange={(e) => setForm({ ...form, name: e.target.value })}
         />
<input
           required
           type="email"
           className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
           placeholder="Email Address *"
           value={form.email}
           onChange={(e) => setForm({ ...form, email: e.target.value })}
         />
<input
           required
           type="tel"
           maxLength={10}
           className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
           placeholder="Mobile Number *"
           value={form.mobile}
           onChange={(e) => setForm({ ...form, mobile: e.target.value })}
         />
<input
           required
           className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
           placeholder="City *"
           value={form.city}
           onChange={(e) => setForm({ ...form, city: e.target.value })}
         />
<input
           className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white text-sm"
           value={form.course_interested}
           readOnly
         />
<button
           type="submit"
           disabled={loading}
           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50"
>
           {loading ? "Please wait..." : "Download Syllabus →"}
</button>
</form>
</div>
</div>
 );
}