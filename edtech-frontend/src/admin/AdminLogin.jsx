import { useState } from "react";
import API from "../services/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/users/login/", form);
      if (!res.data?.access) {
        throw new Error("The login service did not return an access token.");
      }

      // Keep administrator credentials separate from a student's session.
      localStorage.setItem("admin_token", res.data.access);
      if (res.data.refresh) {
        localStorage.setItem("admin_refresh", res.data.refresh);
      } else {
        localStorage.removeItem("admin_refresh");
      }
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Login failed. Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>

        {error && (
          <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={loginAdmin}>
          <input
            className="w-full p-3 border rounded mb-4"
            placeholder="Username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            type="password"
            className="w-full p-3 border rounded mb-4"
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
