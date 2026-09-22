import { getPublicContent } from "@/lib/content";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LicenceJourney from "./components/LicenceJourney";
import WhyUs from "./components/WhyUs";
import Instructors from "./components/Instructors";
import Cars from "./components/Cars";
import Courses from "./components/Courses";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export default async function Home() {
  const content = await getPublicContent();

  return <><Header /><Hero hero={content.hero} stats={content.settings?.stats ?? []} /><LicenceJourney /><WhyUs features={content.settings?.features ?? []} /><Instructors instructors={content.instructors} /><Cars cars={content.cars} /><Courses courses={content.courses} /><Testimonials testimonials={content.testimonials} googleRating={content.settings?.google_rating ?? ""} /><Footer settings={content.settings} /></>;
}
