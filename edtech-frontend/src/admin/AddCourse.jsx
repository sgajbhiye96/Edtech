import { useState } from "react";
import API from "../services/api";

export default function AddCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail_url: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/courses/", form);
    alert("Course Added!");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Course</h1>

      <form onSubmit={submit} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <textarea className="w-full p-3 border rounded" placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <input className="w-full p-3 border rounded" placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <input className="w-full p-3 border rounded" placeholder="Thumbnail URL"
          onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Save
        </button>
      </form>
    </div>
  );
}