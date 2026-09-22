import CourseCards from "./CourseCards";
import CourseCalculator from "./CourseCalculator";
import type { Course } from "@/types/content";

export default function Courses({ courses }: { courses: Course[] }) {

  return (
    <section
      id="kepzesek"
      className="bg-[#15203a] py-5"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Fejléc */}
        <div className="mb-16 text-center">

          <p className="mb-3 text-xl font-semibold uppercase tracking-[0.25em] text-amber-400 md:text-2xl">
            Képzéseink
          </p>

          <h2 className="text-3xl font-black text-white md:text-4xl">
            Válaszd a számodra
            <span className="text-amber-400"> megfelelő </span>
            képzést
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Modern oktatás, prémium szolgáltatás és rugalmas időpontok.
            Tanulj korszerű autókkal tapasztalt oktatóinktól.
          </p>

        </div>

        <CourseCards courses={courses} />
        <div className="mt-12"><CourseCalculator courses={courses} /></div>

      </div>
    </section>
  );
}
