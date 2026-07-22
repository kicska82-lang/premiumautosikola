export default function Courses() {
  const courses = [
    {
      title: "B kategória",
      price: "390 000 Ft",
      icon: "🚗",
      features: [
        "Online KRESZ tanfolyam",
        "30 óra gyakorlati vezetés",
        "Vizsgafelkészítés",
      ],
    },
    {
      title: "A kategória",
      price: "420 000 Ft",
      icon: "🏍️",
      features: [
        "Motoros KRESZ",
        "Rutin és forgalmi oktatás",
        "Védőfelszerelés tanácsadás",
      ],
    },
    {
      title: "AM kategória",
      price: "180 000 Ft",
      icon: "🛵",
      features: [
        "Segédmotor képzés",
        "Rugalmas időpontok",
        "Gyors vizsgafelkészítés",
      ],
    },
    {
      title: "Utánképzés",
      price: "Egyedi ajánlat",
      icon: "🎓",
      features: [
        "Vizsga előtti gyakorlás",
        "Magabiztos vezetés",
        "Tapasztalt oktatók",
      ],
    },
  ];

  return (
    <section
      id="kepzesek"
      className="bg-[#050816] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Fejléc */}
        <div className="mb-16 text-center">

          <p className="mb-3 uppercase tracking-[8px] text-amber-400 text-sm">
            Képzéseink
          </p>

          <h2 className="text-5xl font-black text-white">
            Válaszd a számodra
            <span className="text-amber-400"> megfelelő </span>
            képzést
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Modern oktatás, prémium szolgáltatás és rugalmas időpontok.
            Tanulj korszerű autókkal tapasztalt oktatóinktól.
          </p>

        </div>

        {/* Kártyák */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {courses.map((course) => (
            <div
              key={course.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >

              <div className="mb-6 text-6xl">
                {course.icon}
              </div>

              <h3 className="mb-2 text-2xl font-bold text-white">
                {course.title}
              </h3>

              <p className="mb-6 text-3xl font-black text-amber-400">
                {course.price}
              </p>

              <ul className="space-y-3">

                {course.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="text-amber-400">✔</span>
                    {feature}
                  </li>
                ))}

              </ul>

              <a
                href="#kapcsolat"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-amber-500 py-3 font-semibold text-black transition duration-300 hover:bg-amber-400"
              >
                Jelentkezem →
              </a>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}