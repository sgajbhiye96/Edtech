import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
export default function Hero() {
 const sliderRef = useRef(null);
 useEffect(() => {
   const slider = sliderRef.current;
   if (!slider) return;
   const interval = setInterval(() => {
     slider.scrollBy({ left: 350, behavior: "smooth" });
     if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 20) {
       slider.scrollTo({ left: 0, behavior: "smooth" });
     }
   }, 2500);
   return () => clearInterval(interval);
 }, []);
 const heroImages = ["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"];
 return (
<section className="relative bg-gradient-to-br from-blue-700 to-blue-900 dark:from-gray-900 dark:to-black text-white py-16 md:py-24 overflow-hidden">
     {/* Blob Background */}
<div className="absolute inset-0 -z-10">
<div className="absolute w-64 md:w-96 h-64 md:h-96 bg-blue-500 opacity-20 blur-3xl rounded-full top-20 left-10 animate-pulse"></div>
<div className="absolute w-48 md:w-72 h-48 md:h-72 bg-purple-500 opacity-20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
</div>
<div className="max-w-6xl mx-auto px-4 md:px-6 text-center animate-fadeIn opacity-0" style={{ animationDelay: "0.2s" }}>
<h1 className="text-3xl md:text-6xl font-extrabold mb-4 md:mb-6 leading-tight drop-shadow-md">
         Learn Skills. <span className="text-yellow-300">Build Projects.</span> Get Jobs.
</h1>
<p className="text-base md:text-xl text-blue-100 dark:text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
         Transform your career with industry‑ready courses and real‑world coding projects.
</p>
       {/* Buttons - stack on mobile */}
<div className="flex flex-col sm:flex-row justify-center gap-4">
<Link
           to="/courses"
           className="px-6 py-3 rounded-lg text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition shadow-lg"
>
           Browse Courses
</Link>
<Link
           to="/register"
           className="px-6 py-3 rounded-lg text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 transition shadow-lg"
>
           Join Now →
</Link>
</div>
       {/* Image slider */}
<div
         ref={sliderRef}
         className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth mt-10 md:mt-14 py-3"
>
         {heroImages.map((img, i) => (
<div
             key={i}
             className="flex-shrink-0 w-56 md:w-72 h-36 md:h-44 rounded-xl overflow-hidden shadow-xl hover:scale-105 transition transform duration-300"
>
<img
               src={img}
               alt="hero visuals"
               className="w-full h-full object-cover"
             />
</div>
         ))}
</div>
</div>
</section>
 );
}