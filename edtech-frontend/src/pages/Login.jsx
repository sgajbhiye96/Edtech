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
// Try your custom login endpoint first
const res = await API.post("/users/login/", form);
// Handle both possible response shapes:
// { access: "...", refresh: "..." } ← DRF SimpleJWT
// { token: "..." } ← custom token
// { key: "..." } ← dj-rest-auth
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
// Also save refresh token if present
if (res.data.refresh) {

localStorage.setItem("refresh", res.data.refresh);
}
login(form.username, token);
navigate("/dashboard");
} catch (err) {
const status = err?.response?.status;
const detail = err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0];
if (status === 401) {
setError(" Invalid username or password. Please try again.");
} else if (status === 400) {
setError(` ${detail || "Bad request. Check your inputs."}`);
} else if (status === 404) {
setError(" Login endpoint not found. Please contact support.");
} else if (!status) {
setError(" Cannot reach server. Check your internet connection.");
} else {
setError(` ${detail || "Something went wrong. Please try again."}`);
}
} finally {
setLoading(false);
}
};
return (
<div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
<div className="bg-white dark:bg-gray-800 p-6 md:p-8 shadow-xl rounded-xl w-full max-w-sm">
<h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 dark:text-white"
style={{ fontFamily: "'Syne', sans-serif" }}>
Welcome Back
</h2>
<p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
Login to your InnovationAILabs account
</p>
{error && (
<div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 text-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
{error}
</div>
)}
<form onSubmit={submit}>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Username
</label>

<input
className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
placeholder="Enter your username"
autoComplete="username"
value={form.username}
onChange={(e) => setForm({ ...form, username: e.target.value })}
/>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Password
</label>
<input
type="password"
className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
placeholder="Enter your password"
autoComplete="current-password"
value={form.password}
onChange={(e) => setForm({ ...form, password: e.target.value })}
/>
<button
type="submit"
disabled={loading}
className="w-full py-3 font-semibold rounded-lg transition text-white"
style={{
background: loading ? "#9ca3af" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
cursor: loading ? "not-allowed" : "pointer",
}}
>
{loading ? "Logging in..." : "Login →"}
</button>
</form>
<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
Don't have an account?{" "}
<Link to="/register" className="text-blue-600 hover:underline font-medium">
Register here
</Link>
</p>
</div>
</div>
);
}