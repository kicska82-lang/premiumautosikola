# Prémium Autósiskola

Next.js 16, React 19, Tailwind CSS és Supabase alapú autósiskola-weboldal, dinamikus tartalomkezeléssel.

## Első üzembe helyezés

1. Hozz létre egy Supabase projektet, majd töltsd ki a `.env.local` fájlban a `NEXT_PUBLIC_SUPABASE_URL` és `NEXT_PUBLIC_SUPABASE_ANON_KEY` változókat.
2. A Supabase SQL Editorban futtasd a [CMS migrációt](supabase/migrations/202607300001_content_cms.sql).
3. A Supabase Authentication felületén hozz létre egy e-mail/jelszó alapú admin felhasználót.
4. Az Authentication felhasználó UUID-jával add meg az admin jogosultságot:

```sql
insert into public.admin_users (user_id) values ('AZ_AUTH_FELHASZNALO_UUID_JA');
```

5. Indítsd el a fejlesztői szervert, majd jelentkezz be az `/admin/login` címen.

### Orvosi alkalmassági dokumentumok

Az orvosi alkalmassági igazolások feltöltéséhez futtasd a [dokumentumtár migrációt](supabase/migrations/202608010004_medical_document_uploads.sql), majd a Supabase Project Settings → API felületén másold ki a **service_role** kulcsot. Ezt csak a szerveroldali környezetbe tedd be, helyileg `.env.local`, Vercelen pedig Environment Variable formájában:

```bash
SUPABASE_SERVICE_ROLE_KEY=...
```

Ezt a kulcsot soha ne tedd `NEXT_PUBLIC_` előtaggal ellátott változóba és ne oszd meg böngészőben.

Az adminfelületen a Hero, Képzések, Oktatók, Autók, Vélemények és Oldalbeállítások módosíthatók. A képek kizárólag a `public/images` könyvtárból választhatók.

### Digitális vezetési karton és Android-próba

Az alkalmazásban az oktató GPS-szel rögzítheti a vezetési órát; az útvonalat a telefon helyadataiból, az OpenStreetMap térképén jeleníti meg. A tanuló belépés után csak a hozzá rendelt saját óráit és útvonalait látja. Az adatbázis közös, a tanulói/oktatói hozzáféréseket pedig adminisztrátor adja ki.

Első éles adatbázisos próba előtt:

1. A Supabase SQL Editorban futtasd sorban a `supabase/migrations/202611010001_mobile_driving_log.sql` és a `supabase/migrations/202611020001_mobile_premium_portal.sql` migrációt (a CMS- és képzési szerződés migrációk után).
2. Állítsd be a szerver `.env.local` fájljában vagy a hoszting környezetében a `SUPABASE_SERVICE_ROLE_KEY` értéket. Ez kizárólag szerveroldali titok; ne kerüljön az APK-ba.
3. Az adminfelületen a **Mobilalkalmazás-fiókok** pontban először hozz létre minden oktatónak egyedi felhasználónevű fiókot. Ezután készíthetsz elkülönített, képzési szerződés nélküli teszttanulót (`Teszt Tanuló`, alapértelmezett neve `teszt.tanulo`), vagy aktív képzési szerződésből tanulói fiókot. Mindkettőt rendeld oktatóhoz; az egyszer megjelenített ideiglenes jelszót add át biztonságosan.
4. Készíts új Android-próba APK-t: `npm run android:apk`. A telepíthető fájl helye: `android/app/build/outputs/apk/debug/app-debug.apk`.

Adatbázis nélkül is elérhető a **Készülékes próba** mód: az oktatói felületen indítható szimulált útvonal, a lezárt próbaóra pedig a tanulói próbanézetben és a térképen is visszanézhető. Ezek az adatok csak az adott telefonon tárolódnak, és nem számítanak bele a valódi óraszámba vagy kilométerbe. A valódi GPS-próbához engedélyezd a helymeghatározást; a térképcsempék megjelenéséhez internetkapcsolat kell.

A mobilportál a felhasználónévhez tartozó belső Auth-azonosítóval jelentkeztet be, így a tanuló és oktató e-mail-cím nélkül is beléphet. A prémium kartonhoz való hozzáférést az adatbázis `premium_active` jogosultsága is védi. Jelenleg az admin aktiválja ezt kézzel; a későbbi automatikus előfizetés-ellenőrzéshez fizetési szolgáltató és annak szerveroldali webhookja szükséges. A tanulói portál a megtett órákat, kategóriánkénti óraszámot és 580 km-es követelményt, útvonalat, oktatói visszajelzést és házi feladatot mutatja. Az oktató csak a hozzá rendelt, prémium hozzáférésű tanulók adatait éri el.

### Központi vizsgaútvonalak

Futtasd a `supabase/migrations/202611030001_exam_routes.sql` migrációt a Supabase SQL Editorban (a CMS migráció után). Ez létrehozza az `exam_routes` táblát és az alapútvonalakat **piszkozatként**; a jelenlegi pontatlan koordináták nem jelennek meg a tanulóknál. Admin belépés után az `/admin/vizsga-utvonalak` oldalon illeszd be a tényleges útvonal koordinátáit soronként `szélesség, hosszúság` formában, ellenőrizd a térképi előnézetet, majd csak jóváhagyás után kapcsold be a közzétételt. A tanulói app a közzétett útvonalakat közvetlenül a Supabase-ből olvassa. Nincs szükség service-role kulcsra ehhez a funkcióhoz.

### Kapcsolati és oktatói telefonszámok

Futtasd a `supabase/migrations/202611020002_instructor_phone_numbers.sql` migrációt. Ez felveszi a telefonszám mezőt az oktatói adatokhoz, beállítja a +36/20-313-7137 számot elsődleges autósiskolai és Török Tibor oktatói számként, a +36/30-235-2597 számot pedig Kicska Gábor Zoltán oktatói profiljához. Az adminisztrációban az Oktatók résznél ezután szerkeszthetők a profilok számai.

## Fejlesztés

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

Nyilvános oldal: [http://localhost:3000](http://localhost:3000)
