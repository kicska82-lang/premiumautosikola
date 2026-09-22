import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CarGallery from "@/app/components/CarGallery";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getPublicContent } from "@/lib/content";
import { localImageSrc } from "@/lib/images";

const weekDays = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

export default async function InstructorPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, content] = await Promise.all([params, getPublicContent()]);
  const instructor = content.instructors.find((item) => String(item.id) === id);
  if (!instructor) notFound();

  const slots = instructor.availability ?? [];
  const instructorCars = content.cars.filter((car) => car.instructor.trim().toLocaleLowerCase() === instructor.name.trim().toLocaleLowerCase());

  return <>
    <Header />
    <main className="min-h-screen bg-[#15203a] pb-24 pt-32 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <Link href="/#oktatok" className="text-sm font-semibold text-amber-300 hover:text-amber-200">← Vissza az oktatókhoz</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_1fr]">
          <aside>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-amber-400/30 bg-slate-900">
              <Image src={localImageSrc(instructor.image, "/images/torok_tibor.jpg")} alt={instructor.name} fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Oktatott kategóriák</p>
              <p className="mt-3 text-lg font-semibold text-white">{instructor.category}</p>
              <p className="mt-3 text-slate-300">{instructor.experience}</p>
            </div>
          </aside>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">Oktatói profil</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">{instructor.name}</h1>
            <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 leading-8 text-slate-200 md:p-8">
              <h2 className="text-2xl font-black text-white">Bemutatkozás</h2>
              <p className="mt-4 whitespace-pre-line">{instructor.description}</p>
            </section>
            <section className="mt-7 rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/10 to-white/5 p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Oktatási naptár</p>
              <h2 className="mt-2 text-2xl font-black text-white">Heti elérhető időpontok</h2>
              {slots.length ? <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{weekDays.map((day) => {
                const daySlots = slots.filter((slot) => slot.day === day);
                return <div key={day} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="font-bold text-white">{day}</p>{daySlots.length ? <div className="mt-3 space-y-2">{daySlots.map((slot, index) => <p key={`${slot.from}-${slot.to}-${index}`} className="rounded-lg bg-amber-400/10 px-3 py-2 text-sm text-amber-200">{slot.from}–{slot.to}</p>)}</div> : <p className="mt-3 text-sm text-slate-500">Nincs megadott idősáv</p>}</div>;
              })}</div> : <p className="mt-5 text-slate-300">Az aktuális oktatási időpontok egyeztetés alatt állnak. Kérj információt elérhetőségeinken.</p>}
            </section>
          </div>
        </div>
        {instructorCars.length > 0 && <section className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">Oktatóautó</p>
          <h2 className="mt-3 text-3xl font-black">{instructor.name} autója</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2">{instructorCars.map((car) => <article key={car.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <CarGallery carName={car.name} images={car.gallery_images?.length ? car.gallery_images : [localImageSrc(car.image, "/images/fiesta.jpg")]} variant="grid" />
            <div className="p-5"><h3 className="text-xl font-bold">{car.name}</h3><p className="mt-2 text-slate-300">{car.transmission} · {car.climate}</p></div>
          </article>)}</div>
        </section>}
      </div>
    </main>
    <Footer settings={content.settings} />
  </>;
}
