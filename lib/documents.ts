export type PublicDocument = { title: string; lead: string; sections: { heading: string; paragraphs: string[]; bullets?: string[] }[]; notice?: string };

export const publicDocuments: Record<string, PublicDocument> = {
  "kresz-gyorssegedlet": {
    title: "KRESZ gyorssegédlet a mindennapi vezetéshez",
    lead: "Rövid, saját megfogalmazású emlékeztető a friss jogosítvánnyal közlekedőknek. Nem helyettesíti a hatályos jogszabály szövegét vagy az oktatói tanácsot.",
    sections: [
      { heading: "1. Indulás előtt: a vezető felelőssége", paragraphs: ["Csak akkor indulj el, ha vezetésre képes állapotban vagy, a jármű biztonságosan használható, és nálad vannak a szükséges okmányaid.", "Alkohol vagy a vezetési képességet hátrányosan befolyásoló szer hatása alatt ne vezess. Menet közben kézben tartott mobiltelefont ne használj; állj meg biztonságosan, ha telefonálnod kell."] },
      { heading: "2. Elsőbbség: előbb nézz, aztán indulj", paragraphs: ["A forgalomirányító rendőr utasítása az első, ezt követi a fényjelzés, majd a jelzőtábla és az útburkolati jel. Ha nincs irányítás vagy elsőbbséget szabályozó jelzés, az egyenrangú utak találkozásánál a jobbról érkező járműnek adj elsőbbséget.", "Kanyarodás, sávváltás, kihajtás, elindulás vagy úttestre ráhajtás előtt mindig győződj meg róla, hogy nem akadályozol más járművet vagy gyalogost. A bizonytalan helyzetben ne erőltesd az elsőbbségedet."] },
      { heading: "3. Sebesség: a megengedett maximum nem célsebesség", paragraphs: ["Személyautóval jelzés hiányában általában lakott területen 50 km/h, lakott területen kívül 90 km/h, autóúton 110 km/h, autópályán 130 km/h a legnagyobb megengedett sebesség.", "Esőben, sötétben, ködben, rossz úton, gyalogosok vagy kerékpárosok közelében válassz ennél kisebb sebességet. Mindig úgy haladj, hogy a belátható útszakaszon meg tudj állni."] },
      { heading: "4. Sávválasztás és irányváltoztatás", paragraphs: ["Tarts jobbra, ha ezt a forgalmi helyzet lehetővé teszi. Sávváltás előtt ellenőrizd a tükröket, nézz holttérbe, jelezz időben, és csak akkor kezdj manőverbe, ha ezzel nem kényszerítesz fékezésre vagy irányváltoztatásra másokat.", "Kanyarodás előtt időben sorolj be. A zebrán, kerékpáros átvezetésen és az úttest szélén lévő közlekedőkre külön figyelj; ne takard el a gyalogos útját a járművel."] },
      { heading: "5. Körforgalom és kereszteződés", paragraphs: ["Körforgalomnál a kihelyezett táblák és útburkolati jelek döntenek. A behajtás előtt lassíts, nézz balra, és add meg az elsőbbséget, ha ezt a jelzés vagy a forgalmi helyzet megköveteli.", "Kereszteződést csak úgy közelíts meg, hogy szükség esetén biztonsággal meg tudj állni. Ne hajts be akkor, ha a feltorlódott forgalom miatt várhatóan a kereszteződésben ragadnál."] },
      { heading: "6. Gyalogosok, kerékpárosok és motorosok", paragraphs: ["A gyalogosok és a kerékpárosok nehezebben észlelhetők, sebességük pedig könnyen félrebecsülhető. Zebra, iskola, buszmegálló, kerékpárút-kereszteződés és parkoló járművek közelében lassíts és számíts váratlan mozgásra.", "Ajtónyitás előtt nézz hátra. Előzéskor és kikerüléskor hagyj elegendő oldaltávolságot, különösen kétkerekű jármű mellett."] },
      { heading: "7. Megállás és várakozás", paragraphs: ["Megállás vagy parkolás előtt keresd a táblákat, kiegészítő jelzéseket, útburkolati jeleket és a helyi szabályokat. Ne állj meg olyan helyen, ahol beláthatóságot rontasz, forgalmat akadályozol vagy veszélyeztetsz másokat.", "Zebra, kereszteződés, buszmegálló, kapubejáró, kerékpáros átvezetés vagy vasúti átjáró közelében különösen szigorú korlátozások lehetnek. Kétség esetén inkább válassz másik helyet."] },
      { heading: "8. Vasúti átjáró: soha ne kockáztass", paragraphs: ["A vasúti átjárót fokozott óvatossággal közelítsd meg. Csak akkor hajts rá, ha folyamatos áthaladásra van lehetőség; az átjáróban ne állj meg.", "Meg kell állni többek között közeledő vonatnál, nem teljesen nyitott sorompónál, piros villogásnál, a fehér villogás hiányánál, illetve akkor, ha nincs biztosítva a folyamatos áthaladás. Biztosítatlan átjárónál győződj meg mindkét irányból, hogy nem közeledik vonat."] },
      { heading: "9. Ha valami váratlan történik", paragraphs: ["Vészhelyzetben először a biztonság: lassíts, fékezz határozottan, tartsd az irányt, és csak annyit kormányozz, amennyi az ütközés elkerüléséhez szükséges. Ne a telefont keresd, hanem állj meg biztonságos helyen.", "Koccanás vagy baleset esetén biztosítsd a helyszínt, szükség esetén hívj segítséget a 112-es segélyhívón, és ne hagyd el a helyszínt a kötelezettségeid teljesítése előtt."] },
    ],
    notice: "Utolsó szakmai ellenőrzés: 2026. augusztus 22. A részletes, mindenkor hatályos szabályokat a Nemzeti Jogszabálytárban elérhető 1/1975. (II. 5.) KPM–BM együttes rendelet tartalmazza: https://njt.hu/jogszabaly/1975-1-20-24.33",
  },
  "irasbeli-tajekoztato": {
    title: "Írásbeli tájékoztató és vállalási feltételek",
    lead: "A Prémium Oktatás Kft. tájékoztatója a járművezetői képzések fő feltételeiről.",
    sections: [
      { heading: "Képző szerv és ügyfélszolgálat", paragraphs: ["Képző szerv: Prémium Oktatás Kft. Székhely: 4551 Nyíregyháza, Trombita utca 12.", "Ügyfélfogadás: 4400 Nyíregyháza, Széchenyi utca 18. Telefon: +36-30-235-2597. E-mail: info@premiumautosiskola.hu."] },
      { heading: "Jelentkezés és a képzés feltételei", paragraphs: ["Jelentkezés személyesen vagy elektronikus úton kezdeményezhető. A képzési szerződés megkötésekor ellenőrizzük a választott kategória jogszabályi feltételeit.", "Kiskorú tanuló esetén a törvényes képviselő közreműködése és aláírása szükséges."], bullets: ["A szükséges életkor és az alapfokú iskolai végzettség igazolása.", "Ahol előírt, 1. alkalmassági csoportú orvosi alkalmasság.", "A képzési és vizsgafeltételek teljesítése a vizsgára bocsátás előtt."] },
      { heading: "Képzési rend és díjak", paragraphs: ["A képzések elméleti és gyakorlati részből állnak. A kötelező óraszámokat, az egyes díjtételeket és a vizsgadíjakat az aktuális árlista tartalmazza.", "A pótórák és az esetleges külön szolgáltatások díja az alap képzési díjon felül merülhet fel. A fizetés részleteiről a képzési szerződés rendelkezik."] },
      { heading: "Hiányzás, gyakorlati oktatás, panasz", paragraphs: ["Elméleti hiányzás pótlásának módjáról, illetve a gyakorlati óra módosításáról az iskola és az oktató előzetesen egyeztet a tanulóval.", "Panasz vagy észrevétel esetén az ügyfélszolgálatunkon kérhető segítség."], bullets: ["Az oktatási események adatait a vezetési karton vagy az elektronikus vezetési karton rögzíti.", "A tanuló kérheti képzési igazolás kiállítását, ha a képzését más képzőszervnél kívánja folytatni."] },
    ],
    notice: "A tájékoztató közzététel előtt jogi és szakmai ellenőrzést igényel; a képzési szerződés egyedi feltételei elsőbbséget élveznek.",
  },
  "altalanos-szerzodesi-feltetelek": {
    title: "Általános szerződési feltételek",
    lead: "A Prémium Oktatás Kft. képzési szolgáltatásainak általános feltételei.",
    sections: [
      { heading: "Hatály és fogalmak", paragraphs: ["Az ÁSZF a Prémium Oktatás Kft. és a vele képzési szerződést kötő tanuló közötti jogviszony általános feltételeit rendezi.", "A részletes egyedi feltételeket, díjakat és fizetési ütemezést a képzési szerződés és az aktuális árlista tartalmazza."] },
      { heading: "Szolgáltatás", paragraphs: ["A képző szerv a választott kategóriához tartozó elméleti és gyakorlati képzést szervezi meg. E-learning képzés esetén a tanuló a számára biztosított egyedi hozzáférést rendeltetésszerűen használhatja."] },
      { heading: "A tanuló kötelezettségei", paragraphs: ["A tanuló köteles valós adatokat megadni, a képzési és vizsgafeltételeket teljesíteni, valamint az oktatási rendet betartani.", "Az előre egyeztetett gyakorlati foglalkozás módosítását vagy lemondását lehetőleg időben jelezni kell az oktatónak vagy az ügyfélszolgálatnak."] },
      { heading: "Módosítás, megszűnés, jogérvényesítés", paragraphs: ["Az ÁSZF módosításáról a képző szerv a honlapján előzetesen tájékoztat. A tanuló a vonatkozó jogszabályok és a képzési szerződés szerint élhet felmondási, panasz- és jogérvényesítési lehetőségeivel."] },
    ],
    notice: "Ez az ÁSZF-tervezet nem helyettesíti az ügyvédi felülvizsgálattal jóváhagyott, végleges szerződési feltételeket.",
  },
  "jelentkezesi-adatlap": {
    title: "Jelentkezési adatlap - adatösszesítő",
    lead: "A jelentkezéshez szükséges alapadatok összefoglalója. Online jelentkezés a honlapon is indítható.",
    sections: [
      { heading: "Személyes és kapcsolattartási adatok", paragraphs: ["A jelentkezéshez a tanuló viselt és - ha eltér - születési neve, születési helye és ideje, anyja neve, lakcíme, értesítési címe, telefonszáma és e-mail-címe szükséges."] },
      { heading: "Azonosító és képzési adatok", paragraphs: ["A képző szerv a jelentkezés feldolgozásához a vonatkozó jogszabályok szerinti azonosító adatokat, az iskolai végzettségre, az egészségügyi alkalmasságra és az esetleges meglévő vezetői engedélyre vonatkozó információkat kéri.", "Kiskorú tanulónál a törvényes képviselő adatai is szükségesek."] },
      { heading: "Nyilatkozat", paragraphs: ["A tanuló nyilatkozik az adatok valóságtartalmáról és az adatkezelési tájékoztató megismeréséről. A részletes, aláírandó jelentkezési adatlapot az ügyfélszolgálat biztosítja."] },
    ],
    notice: "Ez az oldal az adatok előkészítését segíti; a hivatalos jelentkezési bizonylatot a képző szerv állítja ki.",
  },
  "vezetesi-karton": {
    title: "Vezetési karton - tájékoztató",
    lead: "A vezetési karton a gyakorlati oktatás és a vizsgák hivatalos nyilvántartási bizonylata.",
    sections: [
      { heading: "Mit rögzít?", paragraphs: ["A karton tartalmazza a képző szerv, a tanuló és a szakoktató azonosító adatait, a tanfolyam típusát és a megszerezni kívánt kategóriát.", "Az egyes oktatásoknál rögzíthető többek között a dátum, kezdő és befejező idő, jármű rendszáma, kilométeróra-állása, oktatási idő, megtett kilométer és az aláírások."] },
      { heading: "Használata", paragraphs: ["A vezetési karton hitelesítését a képző szerv kezdeményezi a vizsgaközpont rendszerében a szükséges feltételek teljesülése után.", "Kartoncsere, oktató- vagy képzőszerv-váltás, illetve elvesztés esetén a képző szerv és a tanuló a vonatkozó eljárási szabályok szerint jár el."] },
      { heading: "Tanulói teendő", paragraphs: ["A tanuló minden gyakorlati alkalom előtt és után ellenőrizze a rögzített adatokat, és csak helyes adatok esetén írja alá a megfelelő rovatot."] },
    ],
    notice: "Tájékoztató kivonat. Nem helyettesíti a vizsgaközpont által generált és hitelesített vezetési kartont.",
  },
  "kepzesi-igazolas": {
    title: "Képzési igazolás - tájékoztató",
    lead: "A képzési igazolás a már elvégzett képzés hiteles összefoglalója, elsősorban tanulóáthelyezéshez.",
    sections: [
      { heading: "Mire szolgál?", paragraphs: ["Ha a tanuló a képzését másik képző szervnél kívánja folytatni, az elbocsátó képző szerv képzési igazolást állít ki.", "A tanuló kérésére az igazolást a képző szervnek a jogszabályi határidőn belül kell rendelkezésre bocsátania."] },
      { heading: "Fő adattartalom", paragraphs: ["Az igazolás tartalmazza a kiállító képző szerv, a tanuló és a képzés azonosító adatait, a tanfolyam időtartamát, a vezetési karton azonosítóját, az elméleti vizsgákra és a teljesített vezetési gyakorlatra vonatkozó adatokat."] },
      { heading: "Kiadás", paragraphs: ["Az igazolás kiállításához vedd fel a kapcsolatot ügyfélszolgálatunkkal. A dokumentum a vizsgaközpont rendszerében rögzített egyedi azonosítóhoz kapcsolódik."] },
    ],
    notice: "Ez az oldal tájékoztató; a hivatalos képzési igazolást a képző szerv vagy a vizsgaközpont rendszere állítja ki.",
  },
};
