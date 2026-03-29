import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses/").then((res) => setCourses(res.data));
  }, []);

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((c) => (
          <div key={c.id} className="bg-white shadow-lg p-5 rounded-xl">

            <img
              src={c.thumbnail}
              className="h-40 w-full object-cover rounded-lg mb-3"
              alt="course thumbnail"
            />

            <h2 className="font-bold text-lg">{c.title}</h2>

            <p className="text-gray-600 mb-4">
              {c.description.slice(0, 70)}...
            </p>

            <Link
              to={`/courses/${c.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Course
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}