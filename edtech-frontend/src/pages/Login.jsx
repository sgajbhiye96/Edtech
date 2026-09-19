import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/users/login/", form);
      const token =
        res.data.access ||
        res.data.token ||
        res.data.key ||
        res.data.access_token;

      if (!token) {
        setError("Login succeeded but no token received. Check backend response.");
        setLoading(false);
        return;
      }
      if (res.data.refresh) {
        localStorage.setItem("refresh", res.data.refresh);
      }
      login(form.username, token);
      navigate("/dashboard");
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0];
      if (status === 401) {
        setError("Invalid username or password. Please try again.");
      } else if (status === 400) {
        setError(`${detail || "Bad request. Check your inputs."}`);
      } else if (status === 404) {
        setError("Login endpoint not found. Please contact support.");
      } else if (!status) {
        setError("Cannot reach server. Check your internet connection.");
      } else {
        setError(`${detail || "Something went wrong. Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F6F4ED] px-4 py-16 font-['Inter',sans-serif]">
      <div className="bg-white border border-[#E4E0D2] p-8 md:p-10 rounded-md w-full max-w-sm">
        <h2 className="font-['Sora',sans-serif] text-2xl md:text-[26px] font-bold text-center mb-2 text-[#12172B]">
          Welcome back
        </h2>
        <p className="text-center text-[#2B3252] text-sm mb-7">
          Log in to your InnovationAILabs account
        </p>

        {error && (
          <div className="mb-5 bg-[#F3D8D5] border border-[#E3A9A3] text-[#B14A42] text-sm rounded-[3px] px-4 py-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label className="block text-sm font-medium text-[#2B3252] mb-1.5">
            Username
          </label>
          <input
            className="w-full mb-4 px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] text-sm text-[#12172B]"
            placeholder="Enter your username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <label className="block text-sm font-medium text-[#2B3252] mb-1.5">
            Password
          </label>
          <input
            type="password"
            className="w-full mb-6 px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] text-sm text-[#12172B]"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold rounded-[3px] transition-colors ${
              loading
                ? "bg-[#C9CBD6] text-white cursor-not-allowed"
                : "bg-[#12172B] text-white hover:bg-[#232A4A] cursor-pointer"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-[#2B3252] mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#C9821B] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}