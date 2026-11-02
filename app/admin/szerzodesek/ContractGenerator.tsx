"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState, useTransition } from "react";
import { Archive, Check, Database, FileCheck2, FileText, Plus, Printer, Save, Search, ShieldCheck, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveTrainingContract } from "./actions";

type CourseKey = "B" | "AM" | "A1" | "A2" | "A";
type DocumentKey = "contract" | "privacy";
export type StudentData = {
  contractNumber: string; signedAt: string; name: string; birthName: string;
  birthPlace: string; birthDate: string; motherName: string; address: string;
  phone: string; email: string; category: CourseKey; guardianName: string;
  guardianAddress: string; theoryFee: string; practiceHourlyFee: string;
  extraHourlyFee: string; theoryExamFee: string; practicalExamFee: string;
  practiceLocation: string;
};

export type ContractRecord = {
  id: string;
  contract_number: string;
  contract_year: number;
  signed_at: string;
  student_name: string;
  course_category: CourseKey;
  status: "active" | "cancelled";
  created_at: string;
  updated_at: string;
  document_snapshot: StudentData;
};

const courses: Record<CourseKey, { title: string; minimumPractice: number; distance: string; defaults: Pick<StudentData, "theoryFee" | "practiceHourlyFee" | "extraHourlyFee" | "theoryExamFee" | "practicalExamFee"> }> = {
  B: { title: "B kategóriás járművezető-képzés", minimumPractice: 29, distance: "legalább 580 km", defaults: { theoryFee: "40 000", practiceHourlyFee: "9 000", extraHourlyFee: "9 000", theoryExamFee: "5 100", practicalExamFee: "12 200" } },
  AM: { title: "AM kategóriás járművezető-képzés", minimumPractice: 10, distance: "legalább 100 km", defaults: { theoryFee: "40 000", practiceHourlyFee: "9 000", extraHourlyFee: "9 000", theoryExamFee: "12 700", practicalExamFee: "17 400" } },
  A1: { title: "A1 kategóriás járművezető-képzés", minimumPractice: 10, distance: "legalább 240 km", defaults: { theoryFee: "40 000", practiceHourlyFee: "9 000", extraHourlyFee: "9 000", theoryExamFee: "12 700", practicalExamFee: "39 900" } },
  A2: { title: "A2 kategóriás járművezető-képzés", minimumPractice: 16, distance: "legalább 240 km", defaults: { theoryFee: "40 000", practiceHourlyFee: "9 000", extraHourlyFee: "9 000", theoryExamFee: "12 700", practicalExamFee: "39 900" } },
  A: { title: "A kategóriás járművezető-képzés", minimumPractice: 26, distance: "legalább 390 km", defaults: { theoryFee: "40 000", practiceHourlyFee: "9 000", extraHourlyFee: "9 000", theoryExamFee: "12 700", practicalExamFee: "39 900" } },
};

const initialData: StudentData = {
  contractNumber: "PA-2026-0001", signedAt: "2026-10-11", name: "Minta Anna",
  birthName: "Minta Anna", birthPlace: "Nyíregyháza", birthDate: "2007-04-18",
  motherName: "Példa Éva", address: "4400 Nyíregyháza, Minta utca 1.",
  phone: "+36 30 123 4567", email: "minta.anna@example.hu", category: "B",
  guardianName: "", guardianAddress: "",
  practiceLocation: "Alapoktatás: 4400 Nyíregyháza, Törzs utca 108. szám alatti tanpálya; főoktatás: Nyíregyháza és környéke közúti forgalomban, az oktatóval egyeztetett indulási helyről.",
  ...courses.B.defaults,
};

const formatDate = (value: string) => value ? new Intl.DateTimeFormat("hu-HU").format(new Date(`${value}T12:00:00`)) : "—";

function PaperHeader() {
  return <header className="contract-paper-header">
    <Image src="/print/brand/premiumautosiskola-logo-gold-gradient-transparent-master.svg" alt="Prémium Autósiskola" width={220} height={66} priority />
    <div><strong>Prémium Oktatás Kft.</strong><span>Prémium Autósiskola</span><span>Képzőszervi azonosító: 3896</span></div>
  </header>;
}

export default function ContractGenerator({ records, databaseReady, databaseError }: { records: ContractRecord[]; databaseReady: boolean; databaseError: string | null }) {
  const [student, setStudent] = useState<StudentData>(initialData);
  const [document, setDocument] = useState<DocumentKey>("contract");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const course = useMemo(() => courses[student.category], [student.category]);
  const years = useMemo(() => Array.from(new Set(records.map((record) => record.contract_year))).sort((a, b) => b - a), [records]);
  const visibleRecords = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("hu-HU");
    return records.filter((record) => (selectedYear === "all" || String(record.contract_year) === selectedYear)
      && (!needle || record.student_name.toLocaleLowerCase("hu-HU").includes(needle) || record.contract_number.toLocaleLowerCase("hu-HU").includes(needle)));
  }, [records, search, selectedYear]);
  const suggestedContractNumber = useMemo(() => {
    const year = Number(student.signedAt.slice(0, 4)) || new Date().getFullYear();
    const highest = records
      .filter((record) => record.contract_year === year)
      .reduce((maximum, record) => {
        const match = record.contract_number.match(/-(\d+)$/);
        return Math.max(maximum, match ? Number(match[1]) : 0);
      }, 0);
    return `PA-${year}-${String(highest + 1).padStart(4, "0")}`;
  }, [records, student.signedAt]);
  const previewStudent = useMemo(() => selectedId ? student : { ...student, contractNumber: suggestedContractNumber }, [selectedId, student, suggestedContractNumber]);

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setStudent((current) => name === "category"
      ? { ...current, category: value as CourseKey, ...courses[value as CourseKey].defaults }
      : { ...current, [name]: value });
  }

  function newContract() {
    setSelectedId(null);
    const year = new Date().getFullYear();
    const highest = records.filter((record) => record.contract_year === year).reduce((maximum, record) => {
      const match = record.contract_number.match(/-(\d+)$/);
      return Math.max(maximum, match ? Number(match[1]) : 0);
    }, 0);
    setStudent({ ...initialData, signedAt: new Date().toISOString().slice(0, 10), contractNumber: `PA-${year}-${String(highest + 1).padStart(4, "0")}` });
    setSaveMessage("Új szerződés adatlapja.");
  }

  function openContract(record: ContractRecord) {
    setSelectedId(record.id);
    setStudent(record.document_snapshot);
    setDocument("contract");
    setSaveMessage(`${record.contract_number} megnyitva.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveContract() {
    setSaveMessage("");
    startTransition(async () => {
      try {
        const result = await saveTrainingContract(selectedId, student);
        setSelectedId(result.id);
        setStudent((current) => ({ ...current, contractNumber: result.contractNumber }));
        setSaveMessage(result.message);
        router.refresh();
      } catch (error) {
        setSaveMessage(error instanceof Error ? error.message : "A mentés nem sikerült.");
      }
    });
  }

  return <div className="contract-workspace">
    <header className="contract-toolbar no-print">
      <div><p className="contract-kicker">Tanulói adminisztráció</p><h1>Járművezető-képzési dokumentumok</h1><p>A tanuló adataiból elkészül a képzési szerződés és a hozzá tartozó adatkezelési tájékoztató.</p></div>
      <div className="contract-toolbar-actions"><button type="button" onClick={newContract} className="contract-secondary-button"><Plus size={19} /> Új szerződés</button><button type="button" onClick={saveContract} disabled={isPending || !databaseReady} className="contract-save-button"><Save size={19} /> {isPending ? "Mentés…" : selectedId ? "Módosítások mentése" : "Mentés az adatbázisba"}</button><button type="button" onClick={() => window.print()} className="contract-print-button"><Printer size={19} /> Nyomtatás / PDF</button></div>
    </header>
    <div className="contract-document-tabs no-print" role="tablist" aria-label="Dokumentumtípus">
      <button type="button" role="tab" aria-selected={document === "contract"} onClick={() => setDocument("contract")} className={document === "contract" ? "active" : ""}><FileText size={18} /> Képzési szerződés</button>
      <button type="button" role="tab" aria-selected={document === "privacy"} onClick={() => setDocument("privacy")} className={document === "privacy" ? "active" : ""}><ShieldCheck size={18} /> Adatkezelési tájékoztató</button>
    </div>
    <div className="contract-status no-print"><span><Database size={18} /> {databaseReady ? "Biztonságos adatbázis-kapcsolat" : "Az adatbázistábla még nincs telepítve"}</span><span><FileCheck2 size={18} /> Automatikusan frissülő előnézet</span>{selectedId && <span><Check size={18} /> Mentett szerződés megnyitva</span>}</div>
    {saveMessage && <p className="contract-message no-print" role="status">{saveMessage}</p>}
    {!databaseReady && <p className="contract-message contract-message-error no-print">A nyilvántartás még nem használható. Futtasd a 202610110001_training_contracts.sql migrációt a Supabase-ben.{databaseError ? ` Hiba: ${databaseError}` : ""}</p>}
    <div className="contract-grid">
      <aside className="contract-form no-print">
        <div className="contract-form-heading"><UserRoundPlus size={22} /><div><strong>Új tanuló</strong><span>Személyes és képzési adatok</span></div></div>
        <fieldset><legend>Dokumentum adatai</legend>
          <label>Szerződésszám <small>mentéskor az adatbázis automatikusan véglegesíti</small><input name="contractNumber" value={selectedId ? student.contractNumber : suggestedContractNumber} readOnly /></label>
          <label>Képzési kategória<select name="category" value={student.category} onChange={update}>{Object.keys(courses).map((key) => <option key={key} value={key}>{key} kategória</option>)}</select></label>
          <label>Aláírás kelte<input type="date" name="signedAt" value={student.signedAt} onChange={update} /></label>
        </fieldset>
        <fieldset><legend>Díjak a megkötés napján</legend>
          <label>Elméleti képzés díja (Ft)<input inputMode="numeric" name="theoryFee" value={student.theoryFee} onChange={update} /></label>
          <div className="contract-form-row"><label>Gyakorlati óradíj (Ft)<input inputMode="numeric" name="practiceHourlyFee" value={student.practiceHourlyFee} onChange={update} /></label><label>Pótóradíj (Ft)<input inputMode="numeric" name="extraHourlyFee" value={student.extraHourlyFee} onChange={update} /></label></div>
          <div className="contract-form-row"><label>Elméleti vizsgadíj (Ft)<input inputMode="numeric" name="theoryExamFee" value={student.theoryExamFee} onChange={update} /></label><label>Gyakorlati vizsgadíjak (Ft)<input inputMode="numeric" name="practicalExamFee" value={student.practicalExamFee} onChange={update} /></label></div>
          <label>Gyakorlati képzés helyszíne<textarea name="practiceLocation" rows={4} value={student.practiceLocation} onChange={update} /></label>
        </fieldset>
        <fieldset><legend>Tanuló személyes adatai</legend>
          <label>Teljes név<input name="name" value={student.name} onChange={update} /></label><label>Születési név<input name="birthName" value={student.birthName} onChange={update} /></label>
          <div className="contract-form-row"><label>Születési hely<input name="birthPlace" value={student.birthPlace} onChange={update} /></label><label>Születési idő<input type="date" name="birthDate" value={student.birthDate} onChange={update} /></label></div>
          <label>Anyja születési neve<input name="motherName" value={student.motherName} onChange={update} /></label><label>Lakcím<input name="address" value={student.address} onChange={update} /></label>
          <div className="contract-form-row"><label>Telefonszám<input name="phone" value={student.phone} onChange={update} /></label><label>E-mail<input type="email" name="email" value={student.email} onChange={update} /></label></div>
        </fieldset>
        <fieldset><legend>Törvényes képviselő, ha szükséges</legend><label>Név<input name="guardianName" value={student.guardianName} onChange={update} placeholder="Nagykorúnál üresen hagyható" /></label><label>Lakcím<input name="guardianAddress" value={student.guardianAddress} onChange={update} /></label></fieldset>
      </aside>
      <main className="contract-preview-wrap">
        {document === "contract" ? <ContractPaper student={previewStudent} course={course} /> : <PrivacyPaper student={previewStudent} />}
      </main>
    </div>
    <section className="contract-archive no-print">
      <div className="contract-archive-heading"><div><p className="contract-kicker">Online nyilvántartás</p><h2>Mentett szerződések</h2><p>Év, tanulónév vagy szerződésszám alapján visszakereshető.</p></div><Archive size={28} /></div>
      <div className="contract-archive-filters"><label><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tanuló vagy szerződésszám keresése" /></label><select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}><option value="all">Minden év</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></div>
      {!databaseReady ? <p className="contract-archive-empty">A migráció telepítése után itt jelennek meg a mentett szerződések.</p> : visibleRecords.length === 0 ? <p className="contract-archive-empty">Nincs a szűrésnek megfelelő szerződés.</p> : <div className="contract-record-list">{visibleRecords.map((record) => <button type="button" key={record.id} onClick={() => openContract(record)} className={record.id === selectedId ? "active" : ""}><span><strong>{record.student_name}</strong><small>{record.contract_number} · {record.course_category} kategória</small></span><span><time>{formatDate(record.signed_at)}</time><small>{record.status === "active" ? "Aktív" : "Érvénytelenített"}</small></span></button>)}</div>}
    </section>
  </div>;
}

function ContractPaper({ student, course }: { student: StudentData; course: (typeof courses)[CourseKey] }) {
  return <article className={`contract-paper one-page-contract${student.guardianName ? " has-guardian" : ""}`}>
    <PaperHeader />
    <div className="contract-title"><p>{student.contractNumber || "Szerződésszám nélkül"}</p><h2>Felnőttképzési szerződés – járművezető-képzés</h2><span>egyedi képzési és szolgáltatási feltételek</span></div>
    <section><h3>1. A szerződő felek</h3>
      <p><strong>Képző szerv:</strong> Prémium Oktatás Korlátolt Felelősségű Társaság (Prémium Autósiskola), székhely: 4400 Nyíregyháza, Toldi utca 69. 1. em. 11. ajtó; adószám: 27289936-1-15; cégjegyzékszám: 15-09-086978; képviseli: Moravcsik Gábor ügyvezető.</p>
      <dl className="contract-data-list"><div><dt>Tanuló neve</dt><dd>{student.name || "—"}</dd></div><div><dt>Születési neve</dt><dd>{student.birthName || "—"}</dd></div><div><dt>Születési hely és idő</dt><dd>{student.birthPlace || "—"}, {formatDate(student.birthDate)}</dd></div><div><dt>Anyja születési neve</dt><dd>{student.motherName || "—"}</dd></div><div><dt>Lakcím</dt><dd>{student.address || "—"}</dd></div><div><dt>Elérhetőség</dt><dd>{student.phone || "—"} · {student.email || "—"}</dd></div></dl>
      {student.guardianName && <div className="contract-guardian-data"><strong>Törvényes képviselő:</strong> {student.guardianName}<span><strong>Lakcíme:</strong> {student.guardianAddress || "—"}</span></div>}
    </section>
    <section><h3>2. A képzés tárgya és teljesítése</h3>
      <p><strong>Képzés: {course.title}.</strong> Célja a kategóriára érvényes vezetői engedély megszerzéséhez szükséges elméleti ismeretek és gyakorlati készségek elsajátítása.</p>
      <p>Az e-learning képzés önállóan, saját ütemben történik, amelyre 90 óra vagy 365 nap áll rendelkezésre. Amennyiben ez nem elegendő, a hozzáférés meghosszabbítása külön, 10 000 Ft-os díj ellenében történik.</p>
      <p><strong>Jogszabályi gyakorlati minimum:</strong> {course.minimumPractice} tanóra és {course.distance}. A ténylegesen szükséges óraszám a tanuló egyéni fejlődésétől függ; a minimum teljesítése nem jelent automatikus vizsgára bocsátást vagy sikeres vizsgát.</p>
      <p><strong>A gyakorlati képzés helyszíne:</strong> {student.practiceLocation || "—"}</p>
    </section>
    <section><h3>3. Díjak és elszámolás</h3>
      <dl className="contract-fee-list"><div><dt>Elméleti képzés díja</dt><dd>{student.theoryFee} Ft</dd></div><div><dt>Gyakorlati vezetés óradíja</dt><dd>{student.practiceHourlyFee} Ft / tanóra</dd></div><div><dt>Pótóra díja</dt><dd>{student.extraHourlyFee} Ft / tanóra</dd></div><div><dt>Elméleti vizsgadíj</dt><dd>{student.theoryExamFee} Ft</dd></div><div><dt>Gyakorlati vizsgadíjak</dt><dd>{student.practicalExamFee} Ft</dd></div></dl>
      <p>A képzés végösszege előre nem határozható meg, mert a gyakorlati órák tényleges száma a tanuló előrehaladásától függ. Az elszámolás a mindenkori egységárak és a ténylegesen igénybe vett szolgáltatások alapján történik. A díjat a képző szerv részére, számla ellenében kell megfizetni; a szakoktató külön díj átvételére nem jogosult. Ütemezett részletfizetés külön megállapodás alapján igényelhető.</p>
      <p className="contract-fee-notice"><strong>A meghatározott díjak esetleges változtatásának jogát a tárgyév hatodik hónapjáig fenntartjuk, és a díjakat felülvizsgáljuk. A változásról a honlapunkon, illetve személyesen értesítjük ügyfeleinket.</strong></p>
    </section>
    <section><h3>4. Oktatás, vizsga és együttműködés</h3>
      <p>A gyakorlati órák teljesítését a vezetési karton és a jogszabály szerinti elektronikus adatszolgáltatás igazolja. Vizsgára jelentésre a vonatkozó életkori, egészségügyi, elméleti, gyakorlati, menettávolsági és díjfizetési feltételek teljesítése után kerülhet sor.</p>
      <p>Az órák egyeztetésének, lemondásának, az oktató- vagy képzőszerv-váltásnak, továbbá a szerződés megszüntetésének részletes szabályait az átadott Írásbeli tájékoztató és az Általános Szerződési Feltételek tartalmazza.</p>
    </section>
    <section><h3>5. Nyilatkozatok</h3><p>A tanuló kijelenti, hogy az Írásbeli tájékoztatót, az aktuális árlistát, az ÁSZF-et és az adatkezelési tájékoztatót a szerződéskötés előtt megismerte, kérdéseire választ kapott. A felek a szerződést elolvasás és közös értelmezés után írják alá.</p></section>
    <Signatures student={student} left="tanuló aláírása" right="képző szerv képviselője" />
  </article>;
}

function PrivacyPaper({ student }: { student: StudentData }) {
  return <article className="contract-paper privacy-paper">
    <PaperHeader />
    <div className="contract-title"><p>{student.contractNumber || "Tanulói dokumentum"}</p><h2>Adatkezelési tájékoztató</h2><span>a járművezető-képzéshez kapcsolódó személyes adatok kezeléséről</span></div>
    <section><h3>1. Az adatkezelő</h3><p><strong>Prémium Oktatás Kft.</strong> (Prémium Autósiskola), székhely: 4400 Nyíregyháza, Toldi utca 69. 1. em. 11. ajtó; ügyfélfogadás: 4400 Nyíregyháza, Széchenyi utca 17. földszint 2U.; e-mail: info@premiumautosiskola.hu; telefon: +36/20-313-7137 (elsődleges), +36/30-235-2597; adószám: 27289936-1-15.</p></section>
    <section><h3>2. Az érintett tanuló adatai</h3>
      <dl className="contract-data-list"><div><dt>Tanuló neve</dt><dd>{student.name || "—"}</dd></div><div><dt>Születési neve</dt><dd>{student.birthName || "—"}</dd></div><div><dt>Születési hely és idő</dt><dd>{student.birthPlace || "—"}, {formatDate(student.birthDate)}</dd></div><div><dt>Anyja születési neve</dt><dd>{student.motherName || "—"}</dd></div><div><dt>Lakcím</dt><dd>{student.address || "—"}</dd></div><div><dt>Elérhetőség</dt><dd>{student.phone || "—"} · {student.email || "—"}</dd></div><div><dt>Képzési kategória</dt><dd>{student.category} kategória</dd></div><div><dt>Szerződésszám</dt><dd>{student.contractNumber || "—"}</dd></div></dl>
      {student.guardianName && <div className="contract-guardian-data"><strong>Törvényes képviselő:</strong> {student.guardianName}<span><strong>Lakcíme:</strong> {student.guardianAddress || "—"}</span></div>}
    </section>
    <section><h3>3. A kezelt adatok, célok és jogalapok</h3>
      <div className="privacy-table"><div><strong>Adatkezelési cél</strong><strong>Adatok és jogalap</strong></div><div><span>Jelentkezés, kapcsolattartás, képzési jogviszony</span><span>Azonosító és kapcsolattartási adatok, választott kategória; szerződés teljesítése és szerződéskötést megelőző lépések.</span></div><div><span>Képzés, vizsgára jelentés, hatósági adminisztráció</span><span>Születési, okmány-, alkalmassági, képzési, vizsga- és vezetési adatok; jogi kötelezettség teljesítése és szerződés teljesítése.</span></div><div><span>Számlázás, befizetések nyilvántartása</span><span>Számlázási és pénzügyi adatok; jogi kötelezettség teljesítése.</span></div><div><span>Panaszok, jogi igények</span><span>Kapcsolódó kommunikáció és dokumentumok; jogos érdek, illetve jogi igények előterjesztése és védelme.</span></div></div>
    </section>
    <section><h3>4. Adattovábbítás és adatfeldolgozók</h3><p>A szükséges adatokat jogszabály alapján továbbíthatjuk a közlekedési vizsgaközpontnak, az illetékes hatóságoknak, valamint a felnőttképzési adatszolgáltatási rendszerbe. A feladatukhoz szükséges mértékben hozzáférhetnek a képző szerv munkatársai, szakoktatói, könyvelője, számlázási, e-learning-, tárhely- és informatikai szolgáltatói. Adatot nem értékesítünk.</p></section>
    <section><h3>5. Megőrzési idő</h3><p>Az adatokat az adott adatkezelési célhoz szükséges ideig, illetve a képzési, közlekedési, számviteli és polgári jogi jogszabályokban előírt határidőig őrizzük meg. A számlázási iratokat a számviteli megőrzési idő végéig, a szerződéses és igényérvényesítési adatokat az alkalmazandó elévülési idő végéig kezeljük. A kizárólag hozzájáruláson alapuló adatokat a hozzájárulás visszavonásáig vagy a cél megszűnéséig kezeljük.</p></section>
    <section><h3>6. Az érintett jogai</h3><p>A tanuló kérheti a személyes adataihoz való hozzáférést, azok helyesbítését, törlését vagy kezelésük korlátozását, valamint – a jogalaptól függően – élhet adathordozhatósági és tiltakozási jogával. A hozzájárulás bármikor visszavonható, ez azonban nem érinti a visszavonás előtti kezelés jogszerűségét és a más jogalapon szükséges adatkezelést.</p></section>
    <section><h3>7. Jogorvoslat</h3><p>Adatvédelmi kérés a fenti elérhetőségeken nyújtható be. Panasz tehető a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (1055 Budapest, Falk Miksa utca 9–11.; www.naih.hu), továbbá bírósági jogorvoslat is igénybe vehető.</p></section>
    <section><h3>8. A tájékoztató átvétele</h3><p>Alulírott <strong>{student.name || "—"}</strong> kijelentem, hogy a jelen adatkezelési tájékoztatót a személyes adataim megadása előtt megismertem és egy példányát átvettem. Ez a nyilatkozat a tájékoztató megismerését igazolja, és nem helyettesíti az olyan adatkezeléshez szükséges külön hozzájárulást, amelynek jogalapja hozzájárulás.</p></section>
    <Signatures student={student} left="tanuló aláírása" right="adatkezelő képviselője" />
  </article>;
}

function Signatures({ student, left, right }: { student: StudentData; left: string; right: string }) {
  return <footer className="contract-signatures"><p>Kelt: Nyíregyháza, {formatDate(student.signedAt)}</p><div><span>{left}</span><span>{right}</span></div>{student.guardianName && <div className="guardian-signature"><span>törvényes képviselő aláírása</span></div>}</footer>;
}
