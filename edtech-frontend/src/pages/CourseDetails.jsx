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

  const handleEnrollClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    API.post("/enrollments/enroll/", { course: id })
      .then(() => {
        setEnrolled(true);
        setShowPayment(false);
        setTimeout(() => navigate("/dashboard"), 1800);
      })
      .catch(() => {
        setEnrolled(true);
        setShowPayment(false);
        setTimeout(() => navigate("/dashboard"), 1800);
      });
  };

  if (!course)
    return (
      <p className="p-10 text-center text-[#9AA3CC] font-['Inter',sans-serif]">
        Loading...
      </p>
    );

  return (
    <div className="bg-[#F6F4ED] min-h-screen font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {showModal && (
          <SyllabusModal course={course} onClose={() => setShowModal(false)} />
        )}
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
          className="rounded-md mb-7 w-full object-cover max-h-64 md:max-h-96 border border-[#E4E0D2]"
        />

        <h1 className="font-['Sora',sans-serif] text-2xl md:text-4xl font-bold mb-4 text-[#12172B] tracking-tight">
          {course.title}
        </h1>
        <p className="text-[#2B3252] text-sm md:text-base mb-7 leading-relaxed">
          {course.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {enrolled ? (
            <div className="w-full sm:w-auto bg-[#E4F1E3] border border-[#B8DCB4] text-[#3D7A38] px-6 py-3 rounded-[3px] font-semibold text-center">
              You're enrolled!
            </div>
          ) : (
            <button
              onClick={handleEnrollClick}
              className="w-full sm:w-auto bg-[#F2A93B] text-[#12172B] px-6 py-3 rounded-[3px] hover:bg-[#F5BC63] font-bold transition-colors"
            >
              Enroll now
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto border-[1.5px] border-[#12172B] text-[#12172B] px-6 py-3 rounded-[3px] hover:bg-[#12172B] hover:text-white font-bold transition-colors"
          >
            Download syllabus
          </button>
        </div>

        <h2 className="font-['Sora',sans-serif] text-xl md:text-2xl font-bold mt-10 mb-4 text-[#12172B]">
          Lessons
        </h2>
        {course.lessons && course.lessons.length > 0 ? (
          <ul className="divide-y divide-[#E4E0D2] border-t border-b border-[#E4E0D2]">
            {course.lessons.map((lesson) => (
              <li key={lesson.id} className="py-3 text-sm md:text-base text-[#2B3252]">
                {lesson.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#9AA3CC] text-sm">No lessons added yet.</p>
        )}
      </div>
    </div>
  );
}