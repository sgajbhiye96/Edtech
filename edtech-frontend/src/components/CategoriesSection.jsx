// Categories

export function CategoriesSection() {

  const categories = [

    "Web Development",

    "Python",

    "Mobile Apps",

    "AI / ML",

    "Data Science",

    "DevOps",

    "UI / UX",

  ];

  return (
<section className="py-10 md:py-14 bg-gray-50 dark:bg-gray-900">
<div className="max-w-6xl mx-auto px-4 md:px-6">
<h2 className="text-xl md:text-2xl font-bold mb-6 dark:text-white">

          Explore Categories
</h2>
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          {categories.map((c, i) => (
<div

              key={i}

              className="p-3 md:p-4 bg-white dark:bg-gray-800 shadow rounded-xl text-center text-sm md:text-lg font-semibold hover:scale-105 transition cursor-pointer dark:text-white"
>

              {c}
</div>

          ))}
</div>
</div>
</section>

  );

}
 