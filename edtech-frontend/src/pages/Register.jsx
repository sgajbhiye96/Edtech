import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/users/register/", form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      const data = err?.response?.data;
      const status = err?.response?.status;
      if (data && typeof data === "object") {
        const firstError = Object.values(data).flat()[0];
        setError(`${firstError}`);
      } else if (status === 400) {
        setError("Registration failed. Please check your details.");
      } else if (!status) {
        setError("Cannot reach server. Check your internet connection.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F6F4ED] px-4 py-16 font-['Inter',sans-serif]">
      <div className="bg-white border border-[#E4E0D2] p-8 md:p-10 rounded-md w-full max-w-sm">
        <h2 className="font-['Sora',sans-serif] text-2xl md:text-[26px] font-bold text-center mb-2 text-[#12172B]">
          Create your account
        </h2>
        <p className="text-center text-[#2B3252] text-sm mb-7">
          Join InnovationAILabs and start building today
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
            placeholder="Choose a username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <label className="block text-sm font-medium text-[#2B3252] mb-1.5">
            Email
          </label>
          <input
            type="email"
            className="w-full mb-4 px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] text-sm text-[#12172B]"
            placeholder="your@email.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="block text-sm font-medium text-[#2B3252] mb-1.5">
            Password
          </label>
          <input
            type="password"
            className="w-full mb-6 px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] text-sm text-[#12172B]"
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold rounded-[3px] transition-colors ${
              loading
                ? "bg-[#C9CBD6] text-white cursor-not-allowed"
                : "bg-[#F2A93B] text-[#12172B] hover:bg-[#F5BC63] cursor-pointer"
            }`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#2B3252] mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[#C9821B] font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}