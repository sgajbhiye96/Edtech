import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/users/register/", form);
    alert("Account created. Please login!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-center mb-6">Create Account</h2>

        <form onSubmit={submit}>
          <input
            className="w-full mb-4 p-3 border rounded-lg focus:outline-blue-500"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className="w-full mb-4 p-3 border rounded-lg focus:outline-blue-500"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-blue-500"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-green-600 text-white py-3 font-semibold rounded-lg hover:bg-green-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}