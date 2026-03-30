import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../services/api";

export default function Courses() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {

    API.get("/courses/").then((res) => setCourses(res.data));

  }, []);

  return (
<div className="px-4 md:px-6 py-8 md:py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
<h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 dark:text-white">

        Available Courses
</h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {courses.map((c) => (
<div key={c.id} className="bg-white dark:bg-gray-800 shadow-lg p-4 md:p-5 rounded-xl">
<img

              src={c.thumbnail}

              className="h-40 w-full object-cover rounded-lg mb-3"

              alt="course thumbnail"

            />
<h2 className="font-bold text-base md:text-lg dark:text-white mb-1">

              {c.title}
</h2>
<p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4">

              {c.description.slice(0, 70)}...
</p>
<Link

              to={`/courses/${c.id}`}

              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm md:text-base"
>

              View Course
</Link>
</div>

        ))}
</div>
</div>

  );

}
 