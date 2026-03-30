import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
export default function Register() {
 const [form, setForm] = useState({ username: "", email: "", password: "" });
 const [error, setError] = useState("");
 const navigate = useNavigate();
 const submit = async (e) => {
   e.preventDefault();
   try {
     await API.post("/users/register/", form);
     alert("Account created. Please login!");
     navigate("/login");
   } catch {
     setError("❌ Registration failed. Please try again.");
   }
 };
 return (
<div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
<div className="bg-white dark:bg-gray-800 p-6 md:p-8 shadow-xl rounded-xl w-full max-w-sm">
<h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 dark:text-white">
         Create Account
</h2>
       {error && (
<p className="mb-4 text-red-500 text-sm text-center">{error}</p>
       )}
<form onSubmit={submit}>
<input
           className="w-full mb-4 p-3 border rounded-lg focus:outline-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm md:text-base"
           placeholder="Username"
           onChange={(e) => setForm({ ...form, username: e.target.value })}
         />
<input
           className="w-full mb-4 p-3 border rounded-lg focus:outline-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm md:text-base"
           placeholder="Email"
           type="email"
           onChange={(e) => setForm({ ...form, email: e.target.value })}
         />
<input
           type="password"
           className="w-full mb-6 p-3 border rounded-lg focus:outline-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm md:text-base"
           placeholder="Password"
           onChange={(e) => setForm({ ...form, password: e.target.value })}
         />
<button className="w-full bg-green-600 text-white py-3 font-semibold rounded-lg hover:bg-green-700 transition">
           Register
</button>
</form>
<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
         Already have an account?{" "}
<Link to="/login" className="text-blue-600 hover:underline">
           Login here
</Link>
</p>
</div>
</div>
 );
}