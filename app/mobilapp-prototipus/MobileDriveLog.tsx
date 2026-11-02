"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getMobileCloud, isMobileCloudConfigured, type DrivingLessonRow, type MobileProfile, type MobileStudent } from "@/lib/mobile-drive-cloud";
import LeafletRouteMap from "./LeafletRouteMap";
import { type GpsPoint, type SavedDrive, useDriveTracker } from "./useDriveTracker";

const lessonTypes = [
  { name: "Alapoktatás", minimum: 9 },
  { name: "Országúti vezetés", minimum: 4 },
  { name: "Városi vezetés", minimum: 14 },
  { name: "Éjszakai vezetés", minimum: 2 },
] as const;
type LessonType = (typeof lessonTypes)[number]["name"];
type View = "setup" | "tracking" | "finish" | "saved";

function parseRoutePoints(value: unknown): GpsPoint[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const point = item as Partial<GpsPoint>;
    if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) return [];
    return [{
      latitude: Number(point.latitude), longitude: Number(point.longitude),
      accuracy: Number(point.accuracy) || 0, speed: Number.isFinite(point.speed) ? Number(point.speed) : null,
      timestamp: Number(point.timestamp) || Date.now(),
    }];
  });
}

function fromRow(row: DrivingLessonRow, studentName: string): SavedDrive {
  return {
    id: row.id, startedAt: row.started_at, endedAt: row.ended_at,
    durationSeconds: row.duration_seconds, lessonHours: row.lesson_hours,
    distanceKm: row.end_odometer - row.start_odometer, gpsDistanceKm: Number(row.gps_distance_km) || 0,
    startKm: row.start_odometer, endKm: row.end_odometer, lessonType: row.lesson_type,
    studentName, studentUserId: row.student_user_id, notes: row.instructor_notes || "", homework: row.homework || "", points: parseRoutePoints(row.route_points), simulated: row.is_simulated,
  };
}

function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)} perc`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export default function MobileDriveLog() {
  const clientRef = useRef<ReturnType<typeof getMobileCloud> | null>(null);
  const tracker = useDriveTracker();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MobileProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [demoRole, setDemoRole] = useState<MobileProfile["role"] | null>(null);
  const [students, setStudents] = useState<MobileStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [reviewStudentId, setReviewStudentId] = useState("");
  const [cloudDrives, setCloudDrives] = useState<SavedDrive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<SavedDrive | null>(null);
  const [view, setView] = useState<View>("setup");
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("Városi vezetés");
  const [lessonHours, setLessonHours] = useState("2");
  const [notes, setNotes] = useState("");
  const [homework, setHomework] = useState("");

  useEffect(() => {
    if (!isMobileCloudConfigured()) return;
    const client = getMobileCloud();
    clientRef.current = client;
    void client.auth.getSession().then(({ data }) => {
      setProfileLoading(Boolean(data.session?.user));
      setUser(data.session?.user ?? null);
    });
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      setProfileLoading(Boolean(session?.user));
      setUser(session?.user ?? null);
      setProfile(null);
      setStudents([]);
      setCloudDrives([]);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !clientRef.current) return;
    let cancelled = false;
    void clientRef.current.from("mobile_profiles")
      .select("user_id, username, role, display_name, student_category, is_active, premium_active")
      .eq("user_id", user.id).maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setMessage(`A mobilalkalmazás adatbázis-sémája még nincs telepítve. ${error.message}`);
        else if (!data) setMessage("Ehhez a belépéshez még nincs tanulói vagy oktatói profil rendelve. Az adminisztrátor tud hozzáférést adni.");
        else if (!data.is_active) setMessage("Ez a mobilalkalmazás-fiók jelenleg inaktív.");
        else { setProfile(data as MobileProfile); setMessage(""); }
        setProfileLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const loadCloudData = useCallback(async (activeProfile: MobileProfile, activeUser: User) => {
    const client = clientRef.current;
    if (!client) return;
    let activeStudents: MobileStudent[] = [];
    if (activeProfile.role === "instructor") {
      const { data: assignments, error: assignmentError } = await client.from("mobile_instructor_students")
        .select("student_user_id").eq("instructor_user_id", activeUser.id);
      if (assignmentError) throw assignmentError;
      const studentIds = (assignments ?? []).map((assignment) => assignment.student_user_id as string);
      if (!studentIds.length) {
        setStudents([]);
        setCloudDrives([]);
        return;
      }
      const { data: studentRows, error: studentError } = await client.from("mobile_profiles")
        .select("user_id, username, display_name, student_category, premium_active").in("user_id", studentIds).eq("role", "student").eq("is_active", true).eq("premium_active", true);
      if (studentError) throw studentError;
      activeStudents = (studentRows ?? []) as MobileStudent[];
      setStudents(activeStudents);
      setSelectedStudentId((current) => activeStudents.some((student) => student.user_id === current) ? current : (activeStudents[0]?.user_id ?? ""));
    }

    let query = client.from("driving_lessons").select("*").order("started_at", { ascending: false });
    if (activeProfile.role === "student") query = query.eq("student_user_id", activeUser.id);
    else query = query.eq("instructor_user_id", activeUser.id);
    const { data: rows, error } = await query;
    if (error) throw error;
    const nameById = new Map(activeStudents.map((student) => [student.user_id, student.display_name]));
    setCloudDrives(((rows ?? []) as DrivingLessonRow[]).map((row) => fromRow(row, activeProfile.role === "student" ? activeProfile.display_name : (nameById.get(row.student_user_id) ?? "Tanuló"))));
  }, []);

  useEffect(() => {
    if (!profile || !user) return;
    void loadCloudData(profile, user).catch((error: unknown) => setMessage(error instanceof Error ? `Az órák betöltése nem sikerült: ${error.message}` : "Az órák betöltése nem sikerült."));
  }, [profile, user, loadCloudData]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientRef.current) { setMessage("A közös adatbázis nincs beállítva. A helyi próbamód ettől még használható."); return; }
    setBusy(true); setMessage("");
    setProfileLoading(true);
    const { error } = await clientRef.current.auth.signInWithPassword({ email: `${email.trim().toLowerCase()}@login.premiumautosiskola.hu`, password });
    if (error) { setProfileLoading(false); setMessage("A belépés nem sikerült. Ellenőrizd a felhasználónevet és a jelszót."); }
    setBusy(false);
  }

  async function signOut() {
    await clientRef.current?.auth.signOut();
    setProfile(null); setUser(null); setDemoRole(null); setView("setup");
  }

  async function refresh() {
    if (profile && user) {
      setBusy(true);
      try { await loadCloudData(profile, user); setMessage("Az órák frissültek."); }
      catch (error) { setMessage(error instanceof Error ? `Frissítés sikertelen: ${error.message}` : "Frissítés sikertelen."); }
      finally { setBusy(false); }
    }
  }

  async function saveLesson() {
    if (currentRole !== "instructor") return;
    if (!endKm || Number(endKm) < Number(startKm)) { setMessage("A záró kilométeróra-állás legyen legalább akkora, mint a kezdő érték."); return; }
    setBusy(true); setMessage("");
    try {
      const details = {
        startKm: Number(startKm), endKm: Number(endKm), lessonType,
        lessonHours: Number(lessonHours), studentName: isDemo ? "Teszt tanuló" : students.find((student) => student.user_id === selectedStudentId)?.display_name ?? "Tanuló", notes, homework,
      };
      if (isDemo) {
        tracker.save(details, { simulatedOverride: true });
        setView("saved");
        return;
      }
      if (!user || !profile || profile.role !== "instructor" || !clientRef.current || !selectedStudentId) return;
      const saved = tracker.save(details, { persistLocal: false });
      const { error } = await clientRef.current.from("driving_lessons").insert({
        student_user_id: selectedStudentId, instructor_user_id: user.id,
        lesson_type: lessonType, lesson_hours: Number(lessonHours),
        start_odometer: Number(startKm), end_odometer: Number(endKm),
        started_at: saved.startedAt, ended_at: saved.endedAt, duration_seconds: saved.durationSeconds,
        gps_distance_km: saved.gpsDistanceKm, route_points: saved.points,
        instructor_notes: notes.trim(), homework: homework.trim(), is_simulated: Boolean(saved.simulated),
      });
      if (error) throw error;
      await loadCloudData(profile, user);
      setView("saved");
    } catch (error) {
      setMessage(error instanceof Error ? `A mentés nem sikerült: ${error.message}` : "Az óra mentése nem sikerült.");
    } finally { setBusy(false); }
  }

  const currentRole = profile?.role ?? demoRole;
  const drives = demoRole ? tracker.savedDrives : cloudDrives;
  const isDemo = Boolean(demoRole);
  const lessonProgress = useMemo(() => {
    const realDrives = drives.filter((drive) => !drive.simulated);
    return lessonTypes.map((item) => ({
      ...item,
      done: realDrives.filter((drive) => drive.lessonType === item.name).reduce((sum, drive) => sum + drive.lessonHours, 0),
    }));
  }, [drives]);
  const realDistance = drives.filter((drive) => !drive.simulated).reduce((sum, drive) => sum + drive.distanceKm, 0);
  const realHours = lessonProgress.reduce((sum, item) => sum + item.done, 0);
  const selectedStudent = students.find((student) => student.user_id === selectedStudentId);
  const reviewStudent = students.find((student) => student.user_id === reviewStudentId);
  const reviewDrives = cloudDrives.filter((drive) => drive.studentUserId === reviewStudentId);

  if (!currentRole) return <section className="mt-4 rounded-[26px] bg-white p-5 shadow-sm sm:p-6">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Digitális vezetési karton</p>
    <h2 className="mt-2 text-2xl font-black">Belépés az órákhoz</h2>
    <p className="mt-2 text-sm leading-6 text-slate-500">Az oktató rögzíti a vezetési órát. A tanuló belépés után visszanézheti az óráit, az adatokat és a térképen az útvonalat.</p>
    <form onSubmit={signIn} className="mt-5 space-y-3">
      <label className="block text-xs font-black text-slate-500">Felhasználónév<input type="text" autoComplete="username" autoCapitalize="none" autoCorrect="off" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 p-3.5 text-sm font-bold outline-none focus:border-amber-400" /></label>
      <label className="block text-xs font-black text-slate-500">Jelszó<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 p-3.5 text-sm font-bold outline-none focus:border-amber-400" /></label>
      <button disabled={busy || profileLoading} className="w-full rounded-2xl bg-[#101b35] px-4 py-4 font-black text-white disabled:opacity-50">{busy ? "Belépés…" : "Belépés"}</button>
    </form>
    {profileLoading && <p className="mt-3 text-center text-xs text-slate-400">Fiók ellenőrzése…</p>}
    {message && <p role="status" className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">{message}</p>}
    <div className="mt-5 border-t border-slate-100 pt-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">Készülékes próba · adatbázis nélkül</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">A szimulált útvonal, a térkép és az óralezárás azonnal kipróbálható. A próba csak ezen a telefonon marad meg.</p>
      <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => { setDemoRole("instructor"); setView("setup"); }} className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-xs font-black text-amber-900">Oktatói próba</button><button onClick={() => setDemoRole("student")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-black text-slate-700">Tanulói próba</button></div>
    </div>
  </section>;

  return <section className="mt-4">
    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-[#101b35] px-4 py-3 text-white">
      <div className="min-w-0"><p className="truncate text-sm font-black">{profile?.display_name ?? (demoRole === "instructor" ? "Oktató · tesztfiók" : "Tanuló · tesztfiók")}</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">{currentRole === "instructor" ? "Oktatói felület" : "Tanulói felület"}{isDemo ? " · helyi próba" : " · közös adatbázis"}</p></div>
      <div className="flex shrink-0 gap-2"><button onClick={refresh} disabled={busy || isDemo} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold disabled:opacity-40">Frissítés</button><button onClick={signOut} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold">Kilépés</button></div>
    </div>
    {isDemo && <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-200 p-1 text-xs font-black"><button onClick={() => setDemoRole("instructor")} className={`rounded-xl px-3 py-2.5 ${currentRole === "instructor" ? "bg-[#101b35] text-white" : "text-slate-500"}`}>Oktatói próba</button><button onClick={() => setDemoRole("student")} className={`rounded-xl px-3 py-2.5 ${currentRole === "student" ? "bg-[#101b35] text-white" : "text-slate-500"}`}>Tanulói próba</button></div>}
    {message && <p role="status" className="mb-4 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">{message}</p>}

    {currentRole === "instructor" && <>
      {view === "tracking" ? <div className="overflow-hidden rounded-[28px] bg-[#101b35] text-white shadow-xl">
        <div className="relative h-64"><LeafletRouteMap points={tracker.points} follow /><span className="absolute left-3 top-3 z-[400] rounded-full bg-red-600 px-3 py-2 text-[10px] font-black text-white">{tracker.demoMode ? "SZIMULÁLT ÚTVONAL" : "ÚTVONALRÖGZÍTÉS"}</span></div>
        <div className="grid grid-cols-3 divide-x divide-white/10 p-4 text-center"><div><p className="text-xl font-black">{String(Math.floor(tracker.elapsedSeconds / 60)).padStart(2, "0")}:{String(tracker.elapsedSeconds % 60).padStart(2, "0")}</p><p className="text-[9px] text-slate-400">eltelt idő</p></div><div><p className="text-xl font-black">{tracker.distanceKm.toFixed(1)}</p><p className="text-[9px] text-slate-400">GPS km</p></div><div><p className="text-xl font-black">{tracker.points.length}</p><p className="text-[9px] text-slate-400">GPS-pont</p></div></div>
        <div className="px-4 pb-4"><button onClick={() => { tracker.stop(); setEndKm(""); setView("finish"); }} className="w-full rounded-2xl bg-red-600 px-4 py-4 font-black text-white">Vezetési óra befejezése</button></div>
      </div> : view === "finish" ? <div className="rounded-[26px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Óra lezárása</h2><div className="mt-4 grid grid-cols-2 gap-3">
          <NumberField label="Kezdő km" value={startKm} onChange={setStartKm} />
          <NumberField label="Záró km" value={endKm} onChange={setEndKm} />
        </div>
        <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm font-bold">Óra szerinti táv: {Math.max(0, Number(endKm || startKm) - Number(startKm))} km · GPS: {tracker.distanceKm.toFixed(1)} km</p>
        <label className="mt-4 block text-xs font-black text-slate-500">Oktatói magyarázat / visszajelzés<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={3000} className="mt-2 w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm font-medium outline-none focus:border-amber-400" placeholder="Mit csinált jól a tanuló? Min érdemes még dolgozni?" /></label>
        <label className="mt-4 block text-xs font-black text-slate-500">Házi feladat / következő órára<textarea value={homework} onChange={(event) => setHomework(event.target.value)} rows={3} maxLength={3000} className="mt-2 w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm font-medium outline-none focus:border-amber-400" placeholder="Például: indulás előtti ellenőrzések átismétlése" /></label>
        <button onClick={saveLesson} disabled={busy || !endKm || Number(endKm) < Number(startKm)} className="mt-4 w-full rounded-2xl bg-[#101b35] px-4 py-4 font-black text-white disabled:opacity-40">{busy ? "Mentés…" : "Óra mentése a tanulói kartonba"}</button><button onClick={() => setView("tracking")} className="mt-2 w-full py-3 text-sm font-bold text-slate-500">Vissza a rögzítéshez</button>
      </div> : view === "saved" ? <div className="rounded-[26px] bg-white p-6 text-center shadow-sm"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div><h2 className="mt-4 text-xl font-black">A vezetési óra elmentve</h2><p className="mt-2 text-sm leading-6 text-slate-500">Az útvonal az oktatói és a tanulói felületen is megjelenik.</p>{isDemo && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">Szimulált próbaadat; nem számít bele a vizsgára készültségbe.</p>}<button onClick={() => { setView("setup"); tracker.reset(); setStartKm(""); setNotes(""); setHomework(""); }} className="mt-5 w-full rounded-2xl bg-[#eab533] px-4 py-4 font-black">Új óra indítása</button></div> : <div className="space-y-4">
        {!isDemo && students.length > 0 && <div className="rounded-[26px] bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-amber-700">Prémium oktatói portál</p><h2 className="mt-1 text-xl font-black">Tanulóim</h2><p className="mt-1 text-xs text-slate-500">A hozzád rendelt, prémium hozzáférésű tanulók órái, útvonalai és előrehaladása.</p>
          <div className="mt-4 space-y-2">{students.map((student) => {
            const studentDrives = cloudDrives.filter((drive) => drive.studentUserId === student.user_id);
            const hours = studentDrives.filter((drive) => !drive.simulated).reduce((sum, drive) => sum + drive.lessonHours, 0);
            const km = studentDrives.filter((drive) => !drive.simulated).reduce((sum, drive) => sum + drive.distanceKm, 0);
            return <button key={student.user_id} onClick={() => { setReviewStudentId((current) => current === student.user_id ? "" : student.user_id); setSelectedStudentId(student.user_id); }} className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left ${reviewStudentId === student.user_id ? "border-amber-400 bg-amber-50" : "border-slate-200"}`}><span><strong className="block text-sm">{student.display_name}</strong><span className="text-[10px] text-slate-500">@{student.username} · {student.student_category ?? "B"}</span></span><span className="text-right"><strong className="block text-xs">{hours} óra · {km} km</strong><span className="text-[10px] text-slate-500">{studentDrives.length} alkalom</span></span></button>;
          })}</div>
          {reviewStudent && <div className="mt-4 border-t border-slate-100 pt-4"><h3 className="font-black">{reviewStudent.display_name} · óraelőzmény</h3>{reviewDrives.length ? <div className="mt-3 space-y-3">{reviewDrives.map((drive) => <article key={drive.id} className="overflow-hidden rounded-2xl border border-slate-200"><div className="relative h-40"><LeafletRouteMap points={drive.points} /><span className="absolute left-3 top-3 z-[400] rounded-lg bg-white/95 px-2 py-1 text-[9px] font-black">{drive.simulated ? "TESZTÚTVONAL" : "GPS-ÚTVONAL"}</span></div><div className="p-3"><div className="flex justify-between gap-2"><strong className="text-xs">{drive.lessonType}</strong><span className="text-[10px] font-bold">{drive.lessonHours} óra · {drive.distanceKm} km</span></div><p className="mt-1 text-[10px] text-slate-500">{formatDate(drive.startedAt)} · kilométeróra: {drive.startKm}–{drive.endKm} km</p>{drive.notes && <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs leading-5"><strong>Oktatói visszajelzés:</strong> {drive.notes}</p>}{drive.homework && <p className="mt-2 rounded-xl bg-amber-50 p-3 text-xs leading-5"><strong>Házi feladat:</strong> {drive.homework}</p>}</div></article>)}</div> : <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">Ehhez a tanulóhoz még nincs rögzített óra.</p>}</div>}
        </div>}
        <div className="rounded-[26px] bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-amber-700">Digitális vezetési karton</p><h2 className="mt-1 text-xl font-black">Új vezetési óra</h2>
          {isDemo ? <label className="mt-4 block text-xs font-black text-slate-500">Tanuló<input readOnly value="Teszt tanuló" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-bold" /></label> : <label className="mt-4 block text-xs font-black text-slate-500">Tanuló<select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold">{students.map((student) => <option key={student.user_id} value={student.user_id}>{student.display_name} · {student.student_category ?? "B"}</option>)}</select></label>}
          {!isDemo && students.length === 0 && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">Ehhez az oktatói fiókhoz még nincs tanuló rendelve. Az admin felületen létre kell hozni a tanulói hozzáférést, majd hozzá kell rendelni az oktatóhoz.</p>}
          <label className="mt-4 block text-xs font-black text-slate-500">Óra típusa<select value={lessonType} onChange={(event) => setLessonType(event.target.value as LessonType)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold">{lessonTypes.map((item) => <option key={item.name} value={item.name}>{item.name} · minimum {item.minimum} óra</option>)}</select></label>
          <label className="mt-4 block text-xs font-black text-slate-500">Elszámolt tanórák<input type="number" min="1" max="8" step="1" value={lessonHours} onChange={(event) => setLessonHours(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 p-3.5 text-sm font-bold" /></label>
          <NumberField label="Kezdő kilométeróra-állás" value={startKm} onChange={setStartKm} />
          <div className="mt-4 grid grid-cols-2 gap-3"><button disabled={!canStart(startKm, lessonHours) || (!isDemo && !selectedStudentId) || busy} onClick={async () => { setMessage(""); if (await tracker.start()) setView("tracking"); else setMessage(tracker.error ?? "A GPS indítása nem sikerült."); }} className="rounded-2xl bg-[#eab533] px-3 py-4 text-sm font-black text-[#101b35] disabled:opacity-40">GPS-es óra indítása</button>{(process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_MOBILE_DEMO === "true") && <button disabled={!canStart(startKm, lessonHours) || (!isDemo && !selectedStudentId) || busy} onClick={() => { tracker.startDemo(); setView("tracking"); }} className="rounded-2xl border border-amber-300 bg-amber-50 px-3 py-4 text-xs font-black text-amber-900 disabled:opacity-40">Szimulált útvonal</button>}</div>
          <p className="mt-3 text-[10px] leading-4 text-slate-400">A GPS útvonal és a pontos helyadat csak a vezetési óra rögzítése alatt kerül mentésre. Vezetés közben ne kezeld a telefont.</p>
        </div>
        {selectedStudent && <div className="rounded-2xl bg-blue-50 p-4 text-xs leading-5 text-blue-950">Kijelölt tanuló: <strong>{selectedStudent.display_name}</strong>. Mentés után az óra az ő tanulói kartonján is látható lesz.</div>}
      </div>}
    </>}

    {currentRole === "student" && <>
      {(!isDemo && profile && !profile.premium_active) ? <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-6"><p className="text-xs font-black uppercase tracking-wider text-amber-800">Prémium digitális vezetési karton</p><h2 className="mt-2 text-xl font-black text-slate-900">A szolgáltatás előfizetéssel érhető el</h2><p className="mt-2 text-sm leading-6 text-slate-700">A vezetési órák, térképes útvonalak, oktatói visszajelzések és házi feladatok megtekintéséhez aktív prémium hozzáférés szükséges. Kérjük, keresd az autósiskolát az előfizetés aktiválásához.</p></div> : selectedDrive ? <div className="overflow-hidden rounded-[26px] bg-white shadow-sm"><div className="relative h-64"><LeafletRouteMap points={selectedDrive.points} /><span className="absolute left-3 top-3 z-[400] rounded-full bg-white/95 px-3 py-2 text-[10px] font-black shadow">{selectedDrive.simulated ? "TESZTÚTVONAL" : "RÖGZÍTETT ÚTVONAL"}</span></div><div className="p-5"><button onClick={() => setSelectedDrive(null)} className="text-xs font-black text-slate-500">← Vissza az órákhoz</button><p className="mt-4 text-xs font-black uppercase tracking-wider text-amber-700">{selectedDrive.lessonType}</p><p className="mt-1 text-lg font-black">{formatDate(selectedDrive.startedAt)}</p>{selectedDrive.simulated && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">Ez szimulált próbaútvonal, nem valódi GPS-adat.</p>}<div className="mt-4 grid grid-cols-2 gap-2"><Metric value={formatDuration(selectedDrive.durationSeconds)} label="időtartam" /><Metric value={`${selectedDrive.lessonHours} óra`} label="elszámolva" /><Metric value={`${selectedDrive.distanceKm} km`} label="kilométeróra alapján" /><Metric value={`${selectedDrive.gpsDistanceKm.toFixed(1)} km`} label="GPS-táv" /><Metric value={selectedDrive.startKm.toLocaleString("hu-HU")} label="kezdő km" /><Metric value={selectedDrive.endKm.toLocaleString("hu-HU")} label="záró km" /></div>{selectedDrive.notes && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-600"><strong>Oktatói visszajelzés:</strong> {selectedDrive.notes}</p>}{selectedDrive.homework && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-950"><strong>Házi feladat:</strong> {selectedDrive.homework}</p>}</div></div> : <>
        <div className="rounded-[26px] bg-gradient-to-br from-[#111c36] to-[#233251] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-amber-300">Valódi órák · {profile?.student_category ?? "B"} kategória</p><div className="mt-3 flex items-end justify-between"><p className="text-4xl font-black">{realHours}<span className="ml-2 text-sm font-bold text-slate-300">/ 29 óra</span></p><p className="text-sm font-black text-amber-300">{realDistance} / 580 km</p></div><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, realHours / 29 * 100)}%` }} /></div><p className="mt-3 text-[10px] leading-4 text-slate-300">A vizsgára bocsátás feltétele az óraszámok és a legalább 580 km teljesítése; a szimulált utak nem számítanak bele.</p></div>
        <h3 className="mt-5 text-base font-black">Kötelező óratípusok</h3><div className="mt-3 space-y-3 rounded-[22px] bg-white p-4 shadow-sm">{lessonProgress.map((item) => <div key={item.name}><div className="flex justify-between text-xs"><span className="font-bold">{item.name}</span><strong>{item.done}/{item.minimum}</strong></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, item.done / item.minimum * 100)}%` }} /></div></div>)}</div>
        <div className="mt-5 flex items-center justify-between"><h3 className="text-base font-black">Vezetési óráim</h3><span className="text-[10px] font-bold text-slate-400">{drives.length} alkalom</span></div>
        {drives.length ? <div className="mt-3 space-y-3">{drives.map((drive) => <button key={drive.id} onClick={() => setSelectedDrive(drive)} className="w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white text-left shadow-sm"><div className="relative h-36"><LeafletRouteMap points={drive.points} /><span className="absolute left-3 top-3 z-[400] rounded-lg bg-white/95 px-2 py-1 text-[9px] font-black">{drive.simulated ? "PRÓBA" : "GPS-ÚTVONAL"}</span></div><div className="p-4"><div className="flex justify-between"><strong className="text-sm">{drive.lessonType}</strong><span className="text-xs font-black">{drive.lessonHours} óra</span></div><p className="mt-1 text-[10px] text-slate-500">{formatDate(drive.startedAt)} · {drive.distanceKm} km</p><p className="mt-2 text-[9px] font-black uppercase tracking-wider text-amber-700">Útvonal és óraadatok megtekintése →</p></div></button>)}</div> : <p className="mt-3 rounded-[22px] border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-500">A tanulói fiókhoz még nem tartozik elmentett vezetési óra.</p>}
      </>}
    </>}
  </section>;
}

function canStart(startKm: string, lessonHours: string) {
  const start = Number(startKm);
  const hours = Number(lessonHours);
  return startKm !== "" && Number.isInteger(start) && start >= 0 && Number.isInteger(hours) && hours >= 1 && hours <= 8;
}

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="mt-4 block text-xs font-black text-slate-500">{label}<div className="relative"><input type="number" min="0" step="1" value={value} onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))} className="mt-2 w-full rounded-2xl border border-slate-200 p-3.5 pr-10 text-sm font-black outline-none focus:border-amber-400" /><span className="absolute right-3 top-1/2 translate-y-1/2 text-xs text-slate-400">km</span></div></label>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl bg-slate-100 p-3 text-center"><p className="text-sm font-black">{value}</p><p className="mt-1 text-[9px] font-bold text-slate-400">{label}</p></div>;
}

