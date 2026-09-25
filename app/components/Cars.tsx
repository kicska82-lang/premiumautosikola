import Image from "next/image";
import { localImageSrc } from "@/lib/images";
import type { Car } from "@/types/content";
import CarGallery from "./CarGallery";

export default function Cars({ cars }: { cars: Car[] }) {
  return (
    <section
      id="autok"
      className="relative overflow-hidden py-5"
    >
      <Image src="/images/hero-bg.png" alt="" fill sizes="100vw" className="object-cover object-center" />

      {/* Sötét overlay */}
      <div className="absolute inset-0 bg-[#15203a]/80" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <p className="text-xl font-semibold uppercase tracking-[0.25em] text-amber-400 md:text-2xl">
            Tanulóautóink
          </p>

          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
            Ismerd meg autóinkat
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            Korszerű, kényelmes és megbízható tanulóautók,
            hogy a vezetés tanulása magabiztos élmény legyen.
          </p>

        </div>

        <div className="flex flex-wrap justify-center gap-8">

          {cars.map((car) => (
            <div
              key={car.id}
              className="group flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <CarGallery carName={car.name} images={car.gallery_images?.length ? car.gallery_images : [localImageSrc(car.image, "/images/fiesta.jpg")]} />

              <div className="flex flex-1 flex-col items-center p-6 text-center">

                <h3 className="text-2xl font-bold text-white">
                  {car.name}
                </h3>

                <p className="mt-2 text-amber-400">
                  {car.instructor}
                </p>

                <div className="mt-6 space-y-3 text-center text-gray-300">

                  <p>🕹️ {car.transmission}</p>

                  <p>❄️ {car.climate}</p>

                  <p>📚 B kategória</p>

                </div>

                <p className="mt-7 text-sm font-semibold text-amber-300">Kattints a képre az autó részletes galériájához.</p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
