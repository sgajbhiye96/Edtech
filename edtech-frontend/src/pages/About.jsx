export default function About() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16 px-6">

      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          About EduTech
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          We empower learners with practical, industry‑ready skills through hands‑on coding education.
        </p>
      </div>

      {/* Vision + Mission */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 mb-20">
        
        <div className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-3 dark:text-white">Our Vision</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To become India’s most trusted platform for coding, data science, and full‑stack education,
            helping students grow into job‑ready professionals who can build real‑world products.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-3 dark:text-white">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To provide affordable, high‑quality, project‑driven courses that bridge the gap between academics
            and industry expectations, enabling every learner to unlock career opportunities.
          </p>
        </div>

      </div>

      {/* What We Offer */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-xl text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Project‑Based Learning</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Build real applications using React, Python, Flask, MySQL, and more.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-xl text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Internship Experience</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Gain real‑time experience through practical internship opportunities.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-xl text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Career Mentorship</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Resume building, mock interviews, and placement assistance.
            </p>
          </div>

        </div>
      </div>

      {/* ✅ Modern, Beautiful Core Values Section */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold dark:text-white mb-2">
              Quality Education
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Our courses are designed to deliver deep understanding with strong fundamentals.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold dark:text-white mb-2">
              Student‑First Approach
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Your growth is our priority — we focus on personalized guidance and mentorship.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold dark:text-white mb-2">
              Innovation & Growth
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              We constantly improve our content to stay updated with the latest industry trends.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}