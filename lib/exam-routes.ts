export type ExamRouteStop = {
  name: string;
  coord: [number, number];
  note: string;
};

export type ExamRoute = {
  id: string;
  name: string;
  streets: string;
  color: string;
  path: [number, number][];
  stops: ExamRouteStop[];
  is_published?: boolean;
  sort_order?: number;
};

export const defaultExamRoutes: ExamRoute[] = [
  {
    id: "F/SZ/264",
    name: "Stadion–Kórház",
    streets: "Törzs u. 108. → Pazonyi út → Stadion u. → Kórház u. → Sarkantyú u. → Vay Ádám krt.",
    color: "#eab533",
    path: [[47.9536, 21.7508], [47.9605, 21.739], [47.9688, 21.7205], [47.9628, 21.7138], [47.953, 21.7175], [47.951, 21.729]],
    stops: [
      { name: "Pazonyi út", coord: [47.9605, 21.739], note: "Sávválasztás előtt időben ellenőrizd a tükröket, és határozottan jelezd az irányváltást." },
      { name: "Stadion utca", coord: [47.9688, 21.7205], note: "Figyeld a gyalogosokat, a kerékpárosokat és a kapubejárókból érkező járműveket." },
      { name: "Vay Ádám körút", coord: [47.953, 21.7175], note: "A nagyobb forgalomban tarts megfelelő követési távolságot, és időben készülj fel a besorolásra." },
    ],
  },
  {
    id: "F/SZ/260",
    name: "Kálvin tér–Belváros",
    streets: "Törzs u. 108. → Kórház u. → Arany János u. → Kálvin tér → Szent István u. → Hunyadi u.",
    color: "#4f6fa9",
    path: [[47.9536, 21.7508], [47.959, 21.724], [47.9534, 21.7143], [47.9522, 21.7107], [47.9475, 21.7195], [47.956, 21.728]],
    stops: [
      { name: "Kálvin tér", coord: [47.9522, 21.7107], note: "Már a csomópont előtt olvasd le a táblákat, válassz megfelelő sávot, és számíts gyalogosokra." },
      { name: "Szent István utca", coord: [47.9475, 21.7195], note: "Parkoló autók mellett hagyj oldaltávolságot, és keresd a takarásból kilépő gyalogosokat." },
      { name: "Hunyadi utca", coord: [47.956, 21.728], note: "Ne csak az előtted haladót figyeld: folyamatosan ellenőrizd a jelzőlámpát és a környező forgalmat." },
    ],
  },
  {
    id: "F/SZ/266",
    name: "Északi körút",
    streets: "Törzs u. 108. → Északi krt. → Rákóczi u. → Árok u. → Új u. → Szent István u.",
    color: "#2f8a72",
    path: [[47.9536, 21.7508], [47.9707, 21.725], [47.9608, 21.7105], [47.9545, 21.7045], [47.948, 21.716], [47.9536, 21.7508]],
    stops: [
      { name: "Északi körút", coord: [47.9707, 21.725], note: "Nagyobb sebességnél előrelátóan válassz sávot, és kerüld a hirtelen kormánymozdulatokat." },
      { name: "Rákóczi utca", coord: [47.9608, 21.7105], note: "A sűrű forgalomban különösen fontos a tükrök rendszeres használata és a holttér ellenőrzése." },
      { name: "Árok utca", coord: [47.9545, 21.7045], note: "Szűkebb környezetben csökkents sebességet, és figyeld az elsőbbséget szabályozó jelzéseket." },
    ],
  },
];
