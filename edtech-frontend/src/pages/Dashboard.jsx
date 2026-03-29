import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/users/profile/")
      .then((res) => setProfile(res.data))
      .catch(() => console.log("Profile error"));
  }, []);

  if (!profile) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {profile.username} 👋
      </h1>

      <p className="text-lg mb-4">Email: {profile.email}</p>

      <h2 className="text-2xl font-semibold mb-3">Your Enrolled Courses</h2>
      <ul className="list-disc ml-6">
        {profile.courses.map((course) => (
          <li key={course.id} className="py-1">
            {course.title}
          </li>
        ))}
      </ul>
    </div>
  );
}