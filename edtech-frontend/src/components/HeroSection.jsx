// Hero Section

export function HeroSection() {

  return (
<section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-gray-900 dark:to-black text-white py-16 md:py-24">
<div className="max-w-6xl mx-auto px-6 text-center animate-fadeIn opacity-0">
<h1 className="text-3xl md:text-6xl font-extrabold mb-6">

          Learn Skills. Build Projects. Get Jobs.
</h1>
<p className="text-base md:text-xl text-blue-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto">

          High‑quality coding courses taught by real developers. Join thousands

          of learners growing their careers.
</p>

        {/* Stacks vertically on mobile, horizontal on desktop */}
<div className="flex flex-col sm:flex-row justify-center gap-4">
<a

            href="/courses"

            className="px-6 py-3 rounded-lg text-lg font-semibold

                       bg-white text-blue-700 hover:bg-gray-200"
>

            Browse Courses
</a>
<a

            href="/register"

            className="px-6 py-3 rounded-lg text-lg font-semibold

                       bg-blue-900 border border-white hover:bg-blue-700"
>

            Start Learning →
</a>
</div>
</div>
</section>

  );

}
 