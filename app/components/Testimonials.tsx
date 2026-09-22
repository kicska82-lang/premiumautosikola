import type { Testimonial } from "@/types/content";

export default function Testimonials({ testimonials, googleRating }: { testimonials: Testimonial[]; googleRating: string }) {
  return (
    <section
      id="velemenyek"
      className="bg-[#15203a] py-5"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-20">

          <p className="text-xl font-semibold uppercase tracking-[0.25em] text-amber-400 md:text-2xl">
            Vélemények
          </p>

          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
            Mit mondanak tanulóink?
          </h2>

          <div className="mt-6 flex justify-center items-center gap-3">

            <span className="text-amber-400 text-3xl">
              ★★★★★
            </span>

            <span className="text-gray-300 text-lg">
              {googleRating}
            </span>

          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {testimonials.map((review) => (

            <div
              key={review.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >

              <div className="text-amber-400 text-2xl mb-5">
                {"★".repeat(review.rating)}
              </div>

              <p className="leading-8 text-gray-300 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="mt-8 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-black">
                  {review.name.charAt(0)}
                </div>

                <div>

                  <h3 className="font-bold text-white">
                    {review.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {review.source}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
