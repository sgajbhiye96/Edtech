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
// Django returns field-level errors as objects
if (data && typeof data === "object") {
const firstError = Object.values(data).flat()[0];
setError(` ${firstError}`);
} else if (status === 400) {
setError(" Registration failed. Please check your details.");
} else if (!status) {
setError(" Cannot reach server. Check your internet connection.");
} else {
setError(" Registration failed. Please try again.");
}
} finally {
setLoading(false);

}
};
return (
<div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
<div className="bg-white dark:bg-gray-800 p-6 md:p-8 shadow-xl rounded-xl w-full max-w-sm">
<h2
className="text-2xl md:text-3xl font-semibold text-center mb-2 dark:text-white"
style={{ fontFamily: "'Syne', sans-serif" }}
>
Create Account
</h2>
<p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
Join InnovationAILabs and start learning today
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
placeholder="Choose a username"
autoComplete="username"
value={form.username}
onChange={(e) => setForm({ ...form, username: e.target.value })}
/>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Email
</label>
<input
type="email"
className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
placeholder="your@email.com"
autoComplete="email"
value={form.email}
onChange={(e) => setForm({ ...form, email: e.target.value })}
/>

<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Password
</label>
<input
type="password"
className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
placeholder="Min. 6 characters"
autoComplete="new-password"
value={form.password}
onChange={(e) => setForm({ ...form, password: e.target.value })}
/>
<button
type="submit"
disabled={loading}
className="w-full py-3 font-semibold rounded-lg transition text-white"
style={{
background: loading ? "#9ca3af" : "linear-gradient(135deg, #10b981, #059669)",
cursor: loading ? "not-allowed" : "pointer",
}}
>
{loading ? "Creating account..." : "Create Account →"}
</button>
</form>
<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
Already have an account?{" "}
<Link to="/login" className="text-blue-600 hover:underline font-medium">
Login here
</Link>
</p>
</div>
</div>
);
}