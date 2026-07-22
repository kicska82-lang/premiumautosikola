import Header from "./components/Header";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import Instructors from "./components/Instructors";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Stats from "./components/Stats";
import Cars from "./components/Cars";

export default function Home() {
  return (
    <>
      <Header />
        <Hero />
        <Stats />
        <Courses />
        <WhyUs />
        <Instructors />
        <Cars />
        <Testimonials />
    </>
  );
}