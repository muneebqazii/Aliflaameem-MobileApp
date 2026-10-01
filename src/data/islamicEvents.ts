import { toHijri } from "../lib/hijri";

export interface IslamicEvent {
  name: string;
  month: number; // Hijri month
  day: number;
}

// Order within a day doesn't matter; events never share a Hijri date.
export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { name: "Islamic New Year", month: 1, day: 1 },
  { name: "Ashura", month: 1, day: 10 },
  { name: "Eid Milad un Nabi ﷺ", month: 3, day: 12 },
  { name: "Shab-e-Miraj", month: 7, day: 27 },
  { name: "Shab-e-Barat", month: 8, day: 15 },
  { name: "Ramadan Begins", month: 9, day: 1 },
  { name: "Laylat al-Qadr", month: 9, day: 27 },
  { name: "Eid al-Fitr", month: 10, day: 1 },
  { name: "Hajj (Day of Arafah)", month: 12, day: 9 },
  { name: "Eid al-Adha", month: 12, day: 10 },
];

export interface UpcomingEvent {
  name: string;
  date: Date;
  hijriYear: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** The next `count` events on or after `from`, scanning ahead up to ~13 months. */
export function getUpcomingEvents(from: Date = new Date(), count = 3): UpcomingEvent[] {
  // Noon UTC on the local calendar day avoids any timezone/DST rollover.
  let cursor = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate(), 12);
  const results: UpcomingEvent[] = [];

  for (let i = 0; i < 400 && results.length < count; i++, cursor += DAY_MS) {
    const date = new Date(cursor);
    const hijri = toHijri(date);
    const event = ISLAMIC_EVENTS.find((e) => e.month === hijri.month && e.day === hijri.day);
    if (event) results.push({ name: event.name, date, hijriYear: hijri.year });
  }
  return results;
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
