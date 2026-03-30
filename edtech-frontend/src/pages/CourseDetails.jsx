import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../services/api";

export default function CourseDetails() {

  const { id } = useParams();

  const [course, setCourse] = useState(null);

  useEffect(() => {

    API.get(`/courses/${id}/`).then((res) => setCourse(res.data));

  }, [id]);

  const enroll = async () => {

    await API.post("/enrollments/enroll/", { course: id });

    alert("Enrolled Successfully!");

  };

  if (!course) return (
<p className="p-10 text-center text-gray-500">Loading...</p>

  );

  return (
<div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
<img

        src={course.thumbnail_url}

        alt={course.title}

        className="rounded-xl mb-6 w-full object-cover max-h-64 md:max-h-96"

      />
<h1 className="text-2xl md:text-4xl font-bold mb-4 dark:text-white">

        {course.title}
</h1>
<p className="text-gray-700 dark:text-gray-300 text-sm md:text-base mb-6">

        {course.description}
</p>
<button

        onClick={enroll}

        className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
>

        Enroll Now
</button>
<h2 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-3 dark:text-white">

        Lessons
</h2>
<ul className="list-disc ml-5 md:ml-6 text-gray-800 dark:text-gray-300">

        {course.lessons.map((lesson) => (
<li key={lesson.id} className="py-1 text-sm md:text-base">

            {lesson.title}
</li>

        ))}
</ul>
</div>

  );

}
 