import type { Course } from "@/types/content";

export function courseSlug(course: Pick<Course, "title">) {
  return course.title
    .toLocaleLowerCase("hu-HU")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Vehicle = { name: string; details: string; image?: string };

export function courseInfo(course: Course, carVehicles: Vehicle[]) {
  const title = course.title.toLocaleLowerCase("hu-HU");
  const shared = {
    theory: "Az elméleti képzés e-learning formában is teljesíthető. A jelentkezéshez szükséges okmányokat az ügyfélfogadáskor ellenőrizzük.",
    place: "A rutin- és vizsgapálya címe: 4400 Nyíregyháza, Törzs utca 108.",
  };

  if (title.startsWith("am kateg")) return { ...shared, age: "Legalább 13 év 6 hónap a tanfolyam kezdetekor; az első elméleti vizsga 13 év 9 hónaptól tehető.", requirements: ["Érvényes személyazonosító okmány", "Írni és olvasni tudás", "A vizsgára az előírt életkor betöltése"], vehicles: [{ name: "Derbi Senda", details: "Segédmotoros oktatójármű, AM kategóriához.", image: "/images/motorok/derbi-senda-50.png" }] };
  if (title.includes("a1")) return { ...shared, age: "Legalább 15 év 6 hónap a tanfolyam kezdetekor; az első elméleti vizsga 15 év 9 hónaptól tehető.", requirements: ["Legalább alapfokú iskolai végzettség", "1. csoportú egészségügyi alkalmasság", "A kategóriához előírt védőfelszerelés a gyakorlati oktatáshoz"], vehicles: [{ name: "Honda CG125", details: "124 cm³, 8 kW - A1 kategóriás oktatómotorkerékpár.", image: "/images/motorok/honda-cg125.png" }] };
  if (title.includes("a2")) return { ...shared, age: title.includes("2 even") ? "A korábbi kategória és annak megszerzésétől eltelt idő alapján rövidített képzés is választható." : "Legalább 17 év 6 hónap a tanfolyam kezdetekor; az első elméleti vizsga 17 év 9 hónaptól tehető.", requirements: ["Legalább alapfokú iskolai végzettség", "1. csoportú egészségügyi alkalmasság", "A korábbi jogosítvány bemutatása rövidített képzésnél"], vehicles: [{ name: "Suzuki GS500", details: "487 cm³, 35 kW - A2 kategóriás oktatómotorkerékpár.", image: "/images/motorok/suzuki-gs500.png" }] };
  if (title.includes("a kateg")) return { ...shared, age: title.includes("2 even") ? "A korábbi A1/A2 jogosítvány és annak megszerzése óta eltelt idő alapján rövidített képzés választható." : "Legalább 23 év 6 hónap a tanfolyam kezdetekor; az első elméleti vizsga 23 év 9 hónaptól tehető.", requirements: ["Legalább alapfokú iskolai végzettség", "1. csoportú egészségügyi alkalmasság", "A korábbi jogosítvány bemutatása rövidített képzésnél"], vehicles: [{ name: "Honda CBF600N", details: "599 cm³, 57 kW - korlátlan A kategóriás oktatómotorkerékpár." }, { name: "Suzuki GS500", details: "487 cm³, 35 kW - a motoros oktatás során használt jármű." , image: "/images/motorok/suzuki-gs500.png" }] };
  return { ...shared, age: "Legalább 16 év 6 hónap a tanfolyam kezdetekor; az első elméleti vizsga 16 év 9 hónaptól tehető.", requirements: ["Legalább alapfokú iskolai végzettség", "1. csoportú egészségügyi alkalmasság", "Érvényes személyazonosító okmány és lakcímkártya"], vehicles: carVehicles };
}
