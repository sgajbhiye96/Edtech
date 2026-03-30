import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
export default function Dashboard() {
 const [profile, setProfile] = useState(null);
 useEffect(() => {
   API.get("/users/profile/")
     .then((res) => setProfile(res.data))
     .catch(() => console.log("Profile error"));
 }, []);
 if (!profile) return (
<p className="p-10 text-center text-gray-500">Loading...</p>
 );
 return (
<div className="px-4 md:px-10 py-8 md:py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
     {/* Profile Card */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-8 mb-8 max-w-2xl">
<h1 className="text-2xl md:text-3xl font-bold mb-3 dark:text-white">
         Welcome, {profile.username} 👋
</h1>
<p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
         Email: {profile.email}
</p>
</div>
     {/* Enrolled Courses */}
<h2 className="text-xl md:text-2xl font-semibold mb-4 dark:text-white">
       Your Enrolled Courses
</h2>
     {profile.courses.length === 0 ? (
<div className="text-center py-10">
<p className="text-gray-500 dark:text-gray-400 mb-4">
           You haven't enrolled in any courses yet.
</p>
<Link
           to="/courses"
           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
>
           Browse Courses
</Link>
</div>
     ) : (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {profile.courses.map((course) => (
<Link
             key={course.id}
             to={`/courses/${course.id}`}
             className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 hover:shadow-lg transition flex items-center gap-4"
>
<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
               {course.title[0]}
</div>
<span className="font-semibold dark:text-white text-sm md:text-base">
               {course.title}
</span>
</Link>
         ))}
</div>
     )}
</div>
 );
}