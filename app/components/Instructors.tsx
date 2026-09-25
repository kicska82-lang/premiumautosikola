import Image from "next/image";
import Link from "next/link";
import { localImageSrc } from "@/lib/images";
import type { Instructor } from "@/types/content";
import InstructorCalendar from "./InstructorCalendar";

export default function Instructors({ instructors }: { instructors: Instructor[] }) {

  return (
    <section
      id="oktatok"
      className="bg-[#15203a] py-5 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-16">

          <p className="text-xl font-semibold uppercase tracking-[0.25em] text-amber-400 md:text-2xl">
            Oktatóink
          </p>

          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            Ismerd meg oktatóinkat
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Tapasztalt, türelmes és felkészült oktatóink segítenek,
            hogy magabiztos vezetővé válj.
          </p>

        </div>

        <div className="flex flex-wrap justify-center gap-8">

          {instructors.map((item) => (

            <div
              key={item.id}
              className="group flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1d2a49] transition duration-300 hover:-translate-y-3 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >

              <div className="relative h-72 overflow-hidden bg-gray-800">

                <Image
                  src={localImageSrc(item.image, "/images/torok_tibor.jpg")}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

              </div>

              <div className="flex flex-1 flex-col items-center p-8 text-center">

                <h3 className="mt-5 text-2xl font-bold">
                  {item.name}
                </h3>

                <p className="mt-3 text-amber-400">
                  ⭐⭐⭐⭐⭐
                </p>

                <p className="mt-2 text-gray-400">
                  {item.experience}
                </p>

                <p className="mt-5 flex flex-wrap items-baseline justify-center gap-x-2 text-gray-300"><span className="text-sm font-semibold uppercase tracking-wider text-amber-300">Oktatott kategóriák:</span>{item.category}</p>

                <Link href={`/oktatok/${item.id}`} className="mt-7 inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-amber-500 px-3 py-3 text-xs font-semibold text-black transition hover:bg-amber-400 sm:text-sm">
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
