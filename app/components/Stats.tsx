"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const stats = [
    {
      number: 2500,
      suffix: "+",
      title: "Sikeres vizsga",
    },
    {
      number: 15,
      suffix: "+",
      title: "Év tapasztalat",
    },
    {
      number: 98,
      suffix: "%",
      title: "Elsőre sikeres vizsgák",
    },
    {
      number: 4.9,
      suffix: "★",
      title: "Google értékelés",
      decimals: 1,
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-[#070b18] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">

          {stats.map((item) => (

            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20"
            >

              <h3 className="text-5xl font-black text-amber-400">

                {inView && (
                  <CountUp
                    end={item.number}
                    duration={2.5}
                    decimals={item.decimals || 0}
                  />
                )}

                {item.suffix}

              </h3>

              <p className="mt-4 text-gray-300">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}