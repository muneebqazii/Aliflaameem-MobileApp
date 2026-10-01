export type Side = "left" | "right";

export interface Category {
  id: string;
  title: string;
  side: Side;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  { id: "mahafils",      title: "Mahafils, Masajid & Madaris",  side: "left",  icon: "🕌", description: "Sacred gathering places for worship and learning" },
  { id: "seerats",       title: "Seerats & Darood Pak",         side: "left",  icon: "📚", description: "Prophetic biography and blessings" },
  { id: "tareekh",       title: "Tareekh & Tazkira tul Ibaad",  side: "left",  icon: "📜", description: "Islamic history and biographies of the righteous" },
  { id: "itq",           title: "ITQ & HMML (USA)",             side: "left",  icon: "🏛️", description: "International Tajweed Qualification & Library resources" },
  { id: "tahleem",       title: "Studies, Teaching & Welfare",  side: "left",  icon: "🧒", description: "Teaching and learning for the youth" },
  { id: "quran",         title: "Quran Kareem",                 side: "right", icon: "📖", description: "The Holy Quran — recitation and understanding" },
  { id: "quranlearning", title: "Quran Learning",               side: "right", icon: "🎓", description: "Structured Quranic education for all levels" },
  { id: "hadees",        title: "Hadees Shareef",               side: "right", icon: "🌙", description: "Prophetic traditions and their explanations" },
  { id: "fiqh",          title: "Fiqh, Fatawa & Tassawuf",      side: "right", icon: "⚖️", description: "Islamic jurisprudence, rulings and spirituality" },
  { id: "duat",          title: "Duat o Tahwizat & Funding",    side: "right", icon: "🤲", description: "Prayers, supplications and spiritual protections" },
];

export const leftCategories = categories.filter((c) => c.side === "left");
export const rightCategories = categories.filter((c) => c.side === "right");
