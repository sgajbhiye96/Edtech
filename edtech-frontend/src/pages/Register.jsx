import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function readableApiError(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;

  if (!status) {
    return "Cannot connect to the server. Please check the API URL and backend deployment.";
  }

  if (status === 400 && data && typeof data === "object") {
    const messages = Object.entries(data)
      .map(([field, value]) => {
        const detail = Array.isArray(value) ? value.join(" ") : String(value);
        return field === "non_field_errors" ? detail : `${field}: ${detail}`;
      })
      .filter(Boolean);
    return messages.join(" ") || "Please check your registration details.";
  }

  if (status === 409) {
    return "That username or email may already be registered. Try another one.";
  }

  if (status >= 500) {
    return `The server encountered an error (HTTP ${status}). Please try again later.`;
  }

  return `Registration request failed (HTTP ${status}). Please contact support if this continues.`;
}

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/users/register/", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      console.error("Registration API request failed", {
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        status: err?.response?.status,
        response: err?.response?.data,
        message: err?.message,
      });
      setError(readableApiError(err));
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
          <div role="alert" className="mb-5 bg-[#F3D8D5] border border-[#E3A9A3] text-[#B14A42] text-sm rounded-[3px] px-4 py-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label htmlFor="register-username" className="block text-sm font-medium text-[#2B3252] mb-1.5">
            Username
          </label>
          <input
            id="register-username"
            required
            className="w-full mb-4 px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] text-sm text-[#12172B]"
            placeholder="Choose a username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <label htmlFor="register-email" className="block text-sm font-medium text-[#2B3252] mb-1.5">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            required
            className="w-full mb-4 px-3.5 py-2.5 border border-[#E4E0D2] rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#F2A93B] text-sm text-[#12172B]"
            placeholder="your@email.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label htmlFor="register-password" className="block text-sm font-medium text-[#2B3252] mb-1.5">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            required
            minLength={6}
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
