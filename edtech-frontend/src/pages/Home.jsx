import { useEffect, useState } from "react";
import API from "../services/api";

import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { FeaturedCourses } from "../components/FeaturedCourses";
import { TestimonialSection } from "../components/TestimonialSection";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses/").then((res) => setCourses(res.data));
  }, []);

  return (
    <>
      <HeroSection />
      {/* <CategoriesSection /> */}
      <FeaturedCourses courses={courses} />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </>
  );
}