import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses/").then((res) => setCourses(res.data));
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Link
          to="/admin/courses/add"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Course
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Title</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-3">{c.id}</td>
              <td className="p-3">{c.title}</td>
              <td className="p-3 space-x-3">
                <Link
                  className="text-blue-600"
                  to={`/admin/courses/edit/${c.id}`}
                >
                  Edit
                </Link>

                <button className="text-red-600">Delete</button>

                <Link
                  className="text-green-600"
                  to={`/admin/courses/${c.id}/lessons`}
                >
                  Lessons
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}