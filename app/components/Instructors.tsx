import Image from "next/image";
import Link from "next/link";
import { localImageSrc } from "@/lib/images";
import type { Instructor } from "@/types/content";
import InstructorCalendar from "./InstructorCalendar";

export default function Instructors({ instructors }: { instructors: Instructor[] }) {

  return (
    <section
      id="oktatok"
      className="bg-[#15203a] py-10 text-white md:py-12"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-6 text-center md:mb-8">

          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
            Oktatóink
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            Ismerd meg oktatóinkat
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
            Tapasztalt, türelmes és felkészült oktatóink segítenek,
            hogy magabiztos vezetővé válj.
          </p>

        </div>

        <div className="flex flex-wrap justify-center gap-4">

          {instructors.map((item) => (

            <div
              key={item.id}
              className="group flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1d2a49] transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/15"
            >

              <div className="relative h-48 overflow-hidden bg-gray-800">

                <Image
                  src={localImageSrc(item.image, "/images/torok_tibor.jpg")}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

              </div>

              <div className="flex flex-1 flex-col items-center p-5 text-center">

                <h3 className="text-xl font-bold">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-amber-400">
                  ⭐⭐⭐⭐⭐
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  {item.experience}
                </p>

                <p className="mt-3 flex flex-wrap items-baseline justify-center gap-x-2 text-sm text-gray-300"><span className="text-xs font-semibold uppercase tracking-wider text-amber-300">Oktatott kategóriák:</span>{item.category}</p>

                <Link href={`/oktatok/${item.id}`} className="mt-4 inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg bg-amber-500 px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-amber-400 sm:text-sm">
                  Bemutatkozás és időpontok →
                </Link>

              </div>

            </div>

          ))}

        </div>

        <InstructorCalendar instructors={instructors} />

      </div>
    </section>
  );
}
