import { useState } from "react";
import API from "../services/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });

  const loginAdmin = async (e) => {
    e.preventDefault();
    const res = await API.post("/users/login/", form);

    localStorage.setItem("admin_token", res.data.access);
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>

        <form onSubmit={loginAdmin}>
          <input
            className="w-full p-3 border rounded mb-4"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            className="w-full p-3 border rounded mb-4"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full p-3 bg-blue-600 text-white rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}