import { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import API from "../services/api";

export default function AdminLayout() {
  const [state, setState] = useState("checking");

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      setState("denied");
      return;
    }
    API.get("/users/profile/")
      .then((res) => setState(res.data?.is_staff ? "allowed" : "denied"))
      .catch(() => setState("denied"));
  }, []);

  if (state === "checking") return <div className="min-h-screen flex items-center justify-center">Checking admin access…</div>;
  if (state !== "allowed") return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="space-y-3">
          <Link className="block hover:text-gray-300" to="/admin/dashboard">Dashboard</Link>
          <Link className="block hover:text-gray-300" to="/admin/courses">Courses</Link>
          <Link className="block hover:text-gray-300" to="/admin/batches">Batches & Live Learning</Link>
          <Link className="block hover:text-gray-300" to="/admin/users">Users</Link>
          <Link className="block hover:text-gray-300" to="/admin/enrollments">Enrollments</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8"><Outlet /></main>
    </div>
  );
}
