import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";

export type MethodKey = "Karachi" | "MuslimWorldLeague" | "NorthAmerica" | "UmmAlQura" | "Egyptian";
export type MadhabKey = (typeof Madhab)[keyof typeof Madhab];
export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PrayerSettings {
  method: MethodKey;
  madhab: MadhabKey;
}

export interface SavedLocation {
  latitude: number;
  longitude: number;
  place?: string;
}

export const DEFAULT_SETTINGS: PrayerSettings = { method: "Karachi", madhab: Madhab.Hanafi };

export const METHODS: { key: MethodKey; label: string }[] = [
  { key: "Karachi", label: "Karachi" },
  { key: "MuslimWorldLeague", label: "Muslim World League" },
  { key: "NorthAmerica", label: "ISNA" },
  { key: "UmmAlQura", label: "Umm al-Qura" },
  { key: "Egyptian", label: "Egyptian" },
];

export const PRAYERS: { key: PrayerKey; name: string; arabic: string }[] = [
  { key: "fajr", name: "Fajr", arabic: "الفجر" },
  { key: "sunrise", name: "Sunrise", arabic: "الشروق" },
  { key: "dhuhr", name: "Dhuhr", arabic: "الظهر" },
  { key: "asr", name: "Asr", arabic: "العصر" },
  { key: "maghrib", name: "Maghrib", arabic: "المغرب" },
  { key: "isha", name: "Isha", arabic: "العشاء" },
];

/** Display name, using Jumu'ah for Dhuhr on Fridays. */
export const prayerName = (key: PrayerKey, date: Date) =>
  key === "dhuhr" && date.getDay() === 5 ? "Jumu'ah" : PRAYERS.find((p) => p.key === key)!.name;

// Formatted by hand so it doesn't depend on Intl support in the JS engine.
export function formatTime(d: Date): string {
  const h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "AM" : "PM"}`;
}

export interface DayTimes {
  today: PrayerTimes;
  tomorrow: PrayerTimes;
}

export function computeTimes(coords: { latitude: number; longitude: number }, day: Date, settings: PrayerSettings): DayTimes {
  const params = CalculationMethod[settings.method]();
  params.madhab = settings.madhab;
  const c = new Coordinates(coords.latitude, coords.longitude);
  const next = new Date(day);
  next.setDate(day.getDate() + 1);
  return { today: new PrayerTimes(c, day, params), tomorrow: new PrayerTimes(c, next, params) };
}

/** Next prayer after `now`. Sunrise is skipped; after Isha it's tomorrow's Fajr. */
export function nextPrayer({ today, tomorrow }: DayTimes, now: Date): { key: PrayerKey; time: Date; isTomorrow: boolean } {
  let key = today.nextPrayer(now) as PrayerKey | "none";
  if (key === "sunrise") key = "dhuhr";
  if (key === "none") return { key: "fajr", time: tomorrow.fajr, isTomorrow: true };
  return { key, time: today[key], isTomorrow: false };
}

/* ── Persistence (shared with the home-screen widget) ───────────── */
const SETTINGS_KEY = "prayer-settings";
const LOCATION_KEY = "last-location";

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function loadSettings(): Promise<PrayerSettings> {
  return { ...DEFAULT_SETTINGS, ...(await readJson<PrayerSettings>(SETTINGS_KEY)) };
}

export const saveSettings = (s: PrayerSettings) => AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s)).catch(() => {});

export const loadLocation = () => readJson<SavedLocation>(LOCATION_KEY);

export const saveLocation = (l: SavedLocation) => AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(l)).catch(() => {});
