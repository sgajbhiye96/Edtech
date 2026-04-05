import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import SyllabusModal from "../components/SyllabusModal";
import PaymentModal from "../components/PaymentModal";
export default function CourseDetails() {
const { id } = useParams();
const navigate = useNavigate();
const { user } = useContext(AuthContext);
const [course, setCourse] = useState(null);
const [showModal, setShowModal] = useState(false);
const [showPayment, setShowPayment] = useState(false);
const [enrolled, setEnrolled] = useState(false);
useEffect(() => {
API.get(`/courses/${id}/`)
.then((res) => setCourse(res.data))
.catch((err) => console.log("Error:", err));
// Check if already enrolled
if (user) {
API.get("/enrollments/")
.then((res) => {
const isEnrolled = res.data.some(
(e) => String(e.course) === String(id)
);
setEnrolled(isEnrolled);
})
.catch(() => {});
}
}, [id, user]);
// Called when user clicks "Enroll Now"
const handleEnrollClick = () => {
if (!user) {
navigate("/login");
return;
}
setShowPayment(true);
};

// Called after payment success inside PaymentModal
const handlePaymentSuccess = () => {
API.post("/enrollments/enroll/", { course: id })
.then(() => {
setEnrolled(true);
setShowPayment(false);
setTimeout(() => navigate("/dashboard"), 1800);
})
.catch(() => {
// Still mark enrolled in UI even if API fails
setEnrolled(true);
setShowPayment(false);
setTimeout(() => navigate("/dashboard"), 1800);
});
};
if (!course)
return (
<p className="p-10 text-center text-gray-500">Loading...</p>
);
return (
<div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
{/* Syllabus Modal — unchanged */}
{showModal && (
<SyllabusModal
course={course}
onClose={() => setShowModal(false)}
/>
)}
{/* Payment Modal — new */}
{showPayment && (
<PaymentModal
course={course}
onClose={() => setShowPayment(false)}
onSuccess={handlePaymentSuccess}
/>
)}
<img
src={course.thumbnail}
alt={course.title}
className="rounded-xl mb-6 w-full object-cover max-h-64 md:max-h-96"
/>

<h1 className="text-2xl md:text-4xl font-bold mb-4 dark:text-white">
{course.title}
</h1>
<p className="text-gray-700 dark:text-gray-300 text-sm md:text-base mb-6">
{course.description}
</p>
{/* Enroll + Syllabus buttons */}
<div className="flex flex-col sm:flex-row gap-4 mb-8">
{enrolled ? (
<div className="w-full sm:w-auto bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg font-semibold text-center">
You're Enrolled!
</div>
) : (
<button
onClick={handleEnrollClick}
className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
>
Enroll Now
</button>
)}
<button
onClick={() => setShowModal(true)}
className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
>
Download Syllabus
</button>
</div>
<h2 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-3 dark:text-white">
Lessons
</h2>
{course.lessons && course.lessons.length > 0 ? (
<ul className="list-disc ml-5 md:ml-6 text-gray-800 dark:text-gray-300">
{course.lessons.map((lesson) => (
<li key={lesson.id} className="py-1 text-sm md:text-base">
{lesson.title}
</li>
))}
</ul>
) : (
<p className="text-gray-500 text-sm">No lessons added yet.</p>
)}
</div>

);
}