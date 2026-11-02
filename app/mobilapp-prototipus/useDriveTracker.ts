"use client";

import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { useCallback, useEffect, useRef, useState } from "react";

export type GpsPoint = {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  timestamp: number;
};

export type SavedDrive = {
  id: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  lessonHours: number;
  distanceKm: number;
  gpsDistanceKm: number;
  startKm: number;
  endKm: number;
  lessonType: string;
  studentName: string;
  notes: string;
  homework?: string;
  studentUserId?: string;
  points: GpsPoint[];
  simulated?: boolean;
};

const DRAFT_KEY = "premium-drive-draft-v1";
const LESSONS_KEY = "premium-drive-lessons-v1";
const DEMO_ROUTE = [
  [47.9551, 21.7165], [47.9553, 21.7169], [47.9556, 21.7174],
  [47.9559, 21.7180], [47.9562, 21.7185], [47.9564, 21.7191],
  [47.9562, 21.7197], [47.9559, 21.7201], [47.9555, 21.7203],
  [47.9551, 21.7200], [47.9548, 21.7195], [47.9547, 21.7189],
  [47.9548, 21.7182], [47.9550, 21.7176], [47.9551, 21.7169],
] as const;

function distanceBetween(a: GpsPoint, b: GpsPoint) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const earthRadiusKm = 6371;
  const lat = radians(b.latitude - a.latitude);
  const lng = radians(b.longitude - a.longitude);
  const value = Math.sin(lat / 2) ** 2
    + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(lng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(value));
}

function routeDistance(points: GpsPoint[]) {
  return points.slice(1).reduce((total, point, index) => total + distanceBetween(points[index], point), 0);
}

export function useDriveTracker() {
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [permission, setPermission] = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported">("idle");
  const [error, setError] = useState<string | null>(null);
  const [savedDrives, setSavedDrives] = useState<SavedDrive[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const watchId = useRef<number | string | null>(null);
  const demoTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LESSONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SavedDrive>[];
        // Hydrate persisted device-only demo rides after the client mounts.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedDrives(parsed.filter((drive): drive is SavedDrive => Boolean(drive.id && drive.startedAt)).map((drive) => ({
          ...drive,
          lessonHours: Math.max(1, Number(drive.lessonHours) || 1),
          distanceKm: Number.isFinite(drive.startKm) && Number.isFinite(drive.endKm)
            ? Math.max(0, Number(drive.endKm) - Number(drive.startKm))
            : Number(drive.distanceKm) || 0,
          gpsDistanceKm: Number(drive.gpsDistanceKm ?? drive.distanceKm) || 0,
          points: Array.isArray(drive.points) ? drive.points : [],
        }) as SavedDrive));
      }
    } catch {
      setError("A korábbi órák helyi adatai nem olvashatók.");
    }
  }, []);

  useEffect(() => {
    if (!startedAt || !isTracking) return;
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [isTracking, startedAt]);

  useEffect(() => {
    if (!startedAt) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ startedAt, points, savedAt: Date.now() }));
  }, [points, startedAt]);

  useEffect(() => () => {
    if (typeof watchId.current === "number") navigator.geolocation?.clearWatch(watchId.current);
    else if (watchId.current !== null) void Geolocation.clearWatch({ id: watchId.current });
    if (demoTimer.current !== null) window.clearInterval(demoTimer.current);
  }, []);

  const stopWatching = useCallback(() => {
    if (typeof watchId.current === "number") navigator.geolocation.clearWatch(watchId.current);
    else if (watchId.current !== null) void Geolocation.clearWatch({ id: watchId.current });
    watchId.current = null;
  }, []);

  const start = useCallback(() => new Promise<boolean>((resolve) => {
    if (demoTimer.current !== null) window.clearInterval(demoTimer.current);
    demoTimer.current = null;
    setDemoMode(false);
    if (!("geolocation" in navigator)) {
      setPermission("unsupported");
      setError("Ez a készülék nem támogatja a helymeghatározást.");
      resolve(false);
      return;
    }
    setPermission("requesting");
    setError(null);
    setPoints([]);
    const startTime = Date.now();
    setStartedAt(startTime);
    setIsTracking(true);
    setElapsedSeconds(0);

    if (Capacitor.isNativePlatform()) {
      void (async () => {
        try {
          let status = await Geolocation.checkPermissions();
          if (status.location !== "granted") {
            status = await Geolocation.requestPermissions({ permissions: ["location"] });
          }
          if (status.location !== "granted") {
            throw new Error("A rögzítéshez engedélyezd a helymeghatározást a telefon beállításaiban.");
          }

          watchId.current = await Geolocation.watchPosition(
            { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000, interval: 1500 },
            (position, reason) => {
              if (reason) {
                stopWatching();
                setIsTracking(false);
                setStartedAt(null);
                setPermission("idle");
                setError("A GPS-helyzet most nem érhető el. Menj nyíltabb helyre, majd próbáld újra.");
                resolve(false);
                return;
              }
              if (!position) return;
              const { latitude, longitude, accuracy, speed } = position.coords;
              setPermission("granted");
              setPoints((current) => {
                const previous = current.at(-1);
                const next: GpsPoint = { latitude, longitude, accuracy, speed, timestamp: position.timestamp };
                if (previous && next.timestamp - previous.timestamp < 1500) return current;
                if (previous && next.accuracy > 80 && previous.accuracy < next.accuracy) return current;
                return [...current, next];
              });
              resolve(true);
            },
          );
        } catch (reason) {
          stopWatching();
          setIsTracking(false);
          setStartedAt(null);
          setPermission("denied");
          setError(reason instanceof Error ? reason.message : "A helymeghatározás nem érhető el.");
          resolve(false);
        }
      })();
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      ({ coords, timestamp }) => {
        setPermission("granted");
        const next: GpsPoint = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          speed: coords.speed,
          timestamp,
        };
        setPoints((current) => {
          const previous = current.at(-1);
          if (previous && next.timestamp - previous.timestamp < 1500) return current;
          if (previous && next.accuracy > 80 && previous.accuracy < next.accuracy) return current;
          return [...current, next];
        });
        resolve(true);
      },
      (reason) => {
        stopWatching();
        setIsTracking(false);
        setStartedAt(null);
        setPermission(reason.code === reason.PERMISSION_DENIED ? "denied" : "idle");
        setError(reason.code === reason.PERMISSION_DENIED
          ? "A rögzítéshez engedélyezd a helymeghatározást a telefon beállításaiban."
          : "A GPS-helyzet most nem érhető el. Menj nyíltabb helyre, majd próbáld újra.");
        resolve(false);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 },
    );
  }), [stopWatching]);

  const startDemo = useCallback(() => {
    stopWatching();
    if (demoTimer.current !== null) window.clearInterval(demoTimer.current);
    const started = Date.now();
    let index = 1;
    setError(null);
    setPermission("granted");
    setDemoMode(true);
    setPoints([{ latitude: DEMO_ROUTE[0][0], longitude: DEMO_ROUTE[0][1], accuracy: 5, speed: 8, timestamp: started }]);
    setStartedAt(started);
    setIsTracking(true);
    setElapsedSeconds(0);
    demoTimer.current = window.setInterval(() => {
      const [latitude, longitude] = DEMO_ROUTE[index % DEMO_ROUTE.length];
      setPoints((current) => [...current, { latitude, longitude, accuracy: 5, speed: 8, timestamp: Date.now() }]);
      index += 1;
    }, 1800);
  }, [stopWatching]);

  const stop = useCallback(() => {
    stopWatching();
    if (demoTimer.current !== null) window.clearInterval(demoTimer.current);
    demoTimer.current = null;
    setIsTracking(false);
  }, [stopWatching]);

  const save = useCallback((details: Omit<SavedDrive, "id" | "startedAt" | "endedAt" | "durationSeconds" | "distanceKm" | "gpsDistanceKm" | "points">, options: { persistLocal?: boolean; simulatedOverride?: boolean } = {}) => {
    const lesson: SavedDrive = {
      ...details,
      id: crypto.randomUUID(),
      startedAt: new Date(startedAt ?? Date.now()).toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      distanceKm: Math.max(0, details.endKm - details.startKm),
      gpsDistanceKm: routeDistance(points),
      points,
      simulated: options.simulatedOverride ?? demoMode,
    };
    if (options.persistLocal !== false) {
      const next = [lesson, ...savedDrives];
      localStorage.setItem(LESSONS_KEY, JSON.stringify(next));
      setSavedDrives(next);
    }
    localStorage.removeItem(DRAFT_KEY);
    return lesson;
  }, [demoMode, elapsedSeconds, points, savedDrives, startedAt]);

  const reset = useCallback(() => {
    stopWatching();
    if (demoTimer.current !== null) window.clearInterval(demoTimer.current);
    demoTimer.current = null;
    setPoints([]);
    setStartedAt(null);
    setIsTracking(false);
    setElapsedSeconds(0);
    setPermission("idle");
    setError(null);
    localStorage.removeItem(DRAFT_KEY);
  }, [stopWatching]);

  return {
    points,
    elapsedSeconds,
    distanceKm: routeDistance(points),
    savedDrives,
    permission,
    error,
    demoMode,
    startedAt,
    isTracking,
    start,
    startDemo,
    stop,
    save,
    reset,
  };
}
