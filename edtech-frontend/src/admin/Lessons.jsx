import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function Lessons() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);

  const [form, setForm] = useState({
    title: "",
    video_url: "",
    position: "",
    course: id,
  });

  useEffect(() => {
    API.get(`/courses/${id}/`).then((res) => setLessons(res.data.lessons));
  }, [id]);

  const addLesson = async (e) => {
    e.preventDefault();
    await API.post("/lessons/", form);
    alert("Lesson added!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Lessons</h1>

      {/* Add Lesson */}
      <div className="bg-white p-6 rounded shadow max-w-xl mb-8">
        <h2 className="text-xl font-semibold mb-3">Add Lesson</h2>

        <form onSubmit={addLesson} className="space-y-3">
          <input className="w-full p-3 border rounded" placeholder="Lesson Title"
            onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <input className="w-full p-3 border rounded" placeholder="Video URL"
            onChange={(e) => setForm({ ...form, video_url: e.target.value })} />

          <input className="w-full p-3 border rounded" placeholder="Position"
            onChange={(e) => setForm({ ...form, position: e.target.value })} />

          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Add Lesson
          </button>
        </form>
      </div>

      {/* Lessons List */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Lesson List</h2>

        {lessons.map((l) => (
          <div key={l.id} className="border-b py-3">
            <p className="font-semibold">{l.position}. {l.title}</p>
            <p className="text-sm text-gray-600">{l.video_url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}