const reviews = [
  {
    name: "Kovács Péter",
    text: "Elsőre sikerült a forgalmi vizsgám. Az oktatóm végig türelmes és segítőkész volt.",
  },
  {
    name: "Nagy Anna",
    text: "Modern autók, jó hangulat és profi oktatás. Csak ajánlani tudom.",
  },
  {
    name: "Szabó Zoltán",
    text: "Nagyon korrekt autósiskola. Minden kérdésemre gyors választ kaptam.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="velemenyek"
      className="bg-[#050816] py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-20">

          <p className="uppercase tracking-[8px] text-amber-400 text-sm">
            Vélemények
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Mit mondanak tanulóink?
          </h2>

          <div className="mt-6 flex justify-center items-center gap-3">

            <span className="text-amber-400 text-3xl">
              ★★★★★
            </span>

            <span className="text-gray-300 text-lg">
              4.9 / 5 Google értékelés
            </span>

          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >

              <div className="text-amber-400 text-2xl mb-5">
                ★★★★★
              </div>

              <p className="leading-8 text-gray-300 italic">
                "{review.text}"
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
                    Google értékelés
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