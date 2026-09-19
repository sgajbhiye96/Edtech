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
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const courseResponse = await API.get(`/courses/${id}/`);
        if (cancelled) return;

        const courseData = courseResponse.data;
        setCourse(courseData);

        if (user) {
          const enrollmentResponse = await API.get("/enrollments/");
          if (cancelled) return;

          const courseBatchIds = new Set(
            (courseData.batches || []).map((batch) => String(batch.id))
          );
          const isEnrolled = enrollmentResponse.data.some(
            (enrollment) =>
              enrollment.status === "ACTIVE" &&
              courseBatchIds.has(String(enrollment.batch))
          );
          setEnrolled(isEnrolled);
        } else {
          setEnrolled(false);
        }
      } catch (err) {
        if (!cancelled) console.log("Error:", err);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const handleEnrollClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedBatch) {
      window.alert("Please select a batch first.");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setEnrolled(true);
    setShowPayment(false);
    setTimeout(() => navigate("/dashboard"), 800);
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
            batch={selectedBatch}
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

        <div className="mb-8 rounded-md border border-[#E4E0D2] bg-white p-5">
          <h2 className="font-['Sora',sans-serif] text-lg font-bold text-[#12172B]">
            Choose your live batch
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Select the cohort you want to join before continuing to payment.
          </p>
          <div className="mt-4 space-y-3">
            {(course.batches || []).filter((b) => b.registration_open).map((batch) => (
              <button
                key={batch.id}
                type="button"
                onClick={() => setSelectedBatch({ ...batch, course_title: course.title })}
                className={`w-full rounded-md border p-4 text-left transition ${selectedBatch?.id === batch.id ? "border-[#F2A93B] bg-[#FFF8EA]" : "border-[#E4E0D2] hover:border-[#12172B]"}`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-bold text-[#12172B]">{batch.name}</div>
                    <div className="text-sm text-[#6B7280]">{batch.start_date} → {batch.end_date}</div>
                  </div>
                  <div className="font-bold text-[#12172B]">₹{Number(batch.price).toLocaleString("en-IN")}</div>
                </div>
                <div className="mt-2 text-xs text-[#9AA3CC]">{batch.enrolled_count}/{batch.max_students} seats filled</div>
              </button>
            ))}
          </div>
          {(!course.batches || course.batches.filter((b) => b.registration_open).length === 0) && (
            <p className="mt-4 text-sm text-[#9AA3CC]">No live batches are currently open for registration.</p>
          )}
        </div>

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