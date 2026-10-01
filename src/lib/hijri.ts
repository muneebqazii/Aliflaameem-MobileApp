export interface HijriDate {
  year: number;
  month: number; // 1 = Muharram … 12 = Dhul Hijjah
  day: number;
}

export const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Akhirah",
  "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul Qa'dah", "Dhul Hijjah",
];

export const HIJRI_MONTHS_AR = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
  "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة",
];

const UMALQURA_LOCALE = "en-u-ca-islamic-umalqura-nu-latn";

/** Umm al-Qura formatter, or null when the JS engine's Intl lacks Islamic calendars. */
const umalqura: Intl.DateTimeFormat | null = (() => {
  try {
    const fmt = new Intl.DateTimeFormat(UMALQURA_LOCALE, {
      timeZone: "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    if (fmt.resolvedOptions().calendar !== "islamic-umalqura") return null;
    // Sanity check against a known date: 1 Jan 2025 = 1 Rajab 1446.
    const known = intlToHijri(fmt, new Date(Date.UTC(2025, 0, 1, 12)));
    return known.year === 1446 && known.month === 7 && known.day === 1 ? fmt : null;
  } catch {
    return null;
  }
})();

function intlToHijri(fmt: Intl.DateTimeFormat, date: Date): HijriDate {
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? "", 10);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/* ── Tabular (arithmetic) Islamic calendar — offline fallback ───── */
const ISLAMIC_EPOCH = 1948439.5;

function gregorianToJd(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
    Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045 - 0.5
  );
}

function islamicToJd(y: number, m: number, d: number): number {
  return d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + Math.floor((3 + 11 * y) / 30) + ISLAMIC_EPOCH - 1;
}

function tabularToHijri(date: Date): HijriDate {
  const jd = gregorianToJd(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  const year = Math.floor((30 * (jd - ISLAMIC_EPOCH) + 10646) / 10631);
  const month = Math.min(12, Math.ceil((jd - (29 + islamicToJd(year, 1, 1))) / 29.5) + 1);
  const day = jd - islamicToJd(year, month, 1) + 1;
  return { year, month, day };
}

/** Hijri date for the calendar day of `date` (its UTC year/month/day). */
export function toHijri(date: Date): HijriDate {
  return umalqura ? intlToHijri(umalqura, date) : tabularToHijri(date);
}

/** Noon UTC on the device's local calendar day — the form toHijri expects. */
export const utcNoon = (local: Date) => new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate(), 12));

/** e.g. "19 Rabi al-Thani 1448 AH" for the device's local calendar day. */
export function formatHijri(local: Date): string {
  const h = toHijri(utcNoon(local));
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH`;
}

export interface HijriDay {
  date: Date; // noon UTC
  hijri: HijriDate;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Every day of the Hijri month containing `anchor` (a noon-UTC date). */
export function hijriMonthDays(anchor: Date): HijriDay[] {
  const { month } = toHijri(anchor);
  // Walk back to the 1st, then forward until the month changes (29 or 30 days).
  let start = anchor.getTime();
  while (toHijri(new Date(start - DAY_MS)).month === month) start -= DAY_MS;

  const days: HijriDay[] = [];
  for (let t = start; ; t += DAY_MS) {
    const hijri = toHijri(new Date(t));
    if (hijri.month !== month) break;
    days.push({ date: new Date(t), hijri });
  }
  return days;
}

export const addDays = (date: Date, n: number) => new Date(date.getTime() + n * DAY_MS);
