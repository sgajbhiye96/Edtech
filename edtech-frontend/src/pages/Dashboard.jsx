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

  if (!profile)
    return (
      <p className="p-10 text-center text-[#9AA3CC] font-['Inter',sans-serif]">
        Loading...
      </p>
    );

  return (
    <div className="px-4 md:px-10 py-8 md:py-12 bg-[#F6F4ED] min-h-screen font-['Inter',sans-serif]">
      {/* Profile Card */}
      <div className="bg-white border border-[#E4E0D2] rounded-md p-6 md:p-8 mb-8 max-w-2xl">
        <h1 className="font-['Sora',sans-serif] text-2xl md:text-3xl font-bold mb-2 text-[#12172B]">
          Welcome, {profile.username}
        </h1>
        <p className="text-[#2B3252] text-sm md:text-base">
          {profile.email}
        </p>
      </div>

      {/* Enrolled Courses */}
      <h2 className="font-['Sora',sans-serif] text-xl md:text-2xl font-bold mb-5 text-[#12172B]">
        Your enrolled courses
      </h2>

      {profile.courses.length === 0 ? (
        <div className="text-center py-14 bg-white border border-[#E4E0D2] max-w-2xl">
          <p className="text-[#2B3252] mb-5">
            You haven't enrolled in any courses yet.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-[#F2A93B] text-[#12172B] px-6 py-3 rounded-[3px] font-bold hover:bg-[#F5BC63] transition-colors"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {profile.courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white border border-[#E4E0D2] rounded-md p-4 hover:border-[#F2A93B] transition-colors flex items-center gap-4"
            >
              <div className="w-11 h-11 bg-[#12172B] rounded-[3px] flex items-center justify-center text-[#F2A93B] font-bold text-lg flex-shrink-0">
                {course.title[0]}
              </div>
              <span className="font-semibold text-[#12172B] text-sm md:text-base">
                {course.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}