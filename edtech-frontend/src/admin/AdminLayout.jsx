import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <nav className="space-y-3">
          <Link className="block hover:text-gray-300" to="/admin/dashboard">Dashboard</Link>
          <Link className="block hover:text-gray-300" to="/admin/courses">Courses</Link>
          <Link className="block hover:text-gray-300" to="/admin/users">Users</Link>
          <Link className="block hover:text-gray-300" to="/admin/enrollments">Enrollments</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}