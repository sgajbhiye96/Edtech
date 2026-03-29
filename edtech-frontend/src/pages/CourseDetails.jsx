import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}/`).then((res) => setCourse(res.data));
  }, [id]);

  const enroll = async () => {
    await API.post("/enrollments/enroll/", { course: id });
    alert("Enrolled Successfully!");
  };

  if (!course) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={course.thumbnail_url} className="rounded-xl mb-6 w-full" />

      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

      <p className="text-gray-700 mb-6">{course.description}</p>

      <button
        onClick={enroll}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      >
        Enroll Now
      </button>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Lessons</h2>

      <ul className="list-disc ml-6 text-gray-800">
        {course.lessons.map((lesson) => (
          <li key={lesson.id} className="py-1">
            {lesson.title}
          </li>
        ))}
      </ul>
    </div>
  );
}