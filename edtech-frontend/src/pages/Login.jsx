import { useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

import { useNavigate } from "react-router-dom";

export default function Login() {

  const [form, setForm] = useState({ username: "", password: "" });

  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const submit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/users/login/", form);

      login(form.username, res.data.access); // Save token + username

      navigate("/dashboard");               // ✅ Redirect to dashboard

    } catch {

      setError("❌ Invalid username or password");

    }

  };

  return (
<div className="flex justify-center items-center h-screen">
<form onSubmit={submit} className="bg-white p-8 shadow rounded w-96">
<h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="mb-3 text-red-500">{error}</p>}
<input

          className="w-full p-2 border mb-3"

          placeholder="Username"

          onChange={(e) => setForm({ ...form, username: e.target.value })}

        />
<input

          className="w-full p-2 border mb-3"

          placeholder="Password"

          type="password"

          onChange={(e) => setForm({ ...form, password: e.target.value })}

        />
<button className="w-full bg-blue-600 text-white py-2">

          Login
</button>
</form>
</div>

  );

}
 