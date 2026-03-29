export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-xl font-semibold">Total Courses</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-xl font-semibold">Total Students</h3>
          <p className="text-3xl font-bold mt-2">340</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-xl font-semibold">Total Enrollments</h3>
          <p className="text-3xl font-bold mt-2">890</p>
        </div>
      </div>
    </div>
  );
}