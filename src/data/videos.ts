export interface Video {
  id: string; // YouTube video ID
  title: string;
}

const tazkiraTulIbaad: Video[] = [
  { id: "kwdRB7YSBe4", title: "Tazkira tul Ibaad — Part 01" },
  { id: "s9IbWaMGmXU", title: "Tazkira tul Ibaad — Part 02" },
  { id: "Aqs9WGA4QQU", title: "Tazkira tul Ibaad — Part 03" },
  { id: "Q-JaGkHGWis", title: "Tazkira tul Ibaad — Part 04" },
  { id: "J5Mdqj2Hx5w", title: "Tazkira tul Ibaad — Part 05" },
  { id: "CRfKPRc3YpY", title: "Tazkira tul Ibaad — Part 06" },
  { id: "XTkZdvXIWY0", title: "Tazkira tul Ibaad — Part 07" },
  { id: "wJE2QSuto6w", title: "Tazkira tul Ibaad — Part 08" },
  { id: "2Zt4lBLBUhw", title: "Tazkira tul Ibaad — Part 09" },
  { id: "Oeoa-tbCZBg", title: "Tazkira tul Ibaad — Part 10" },
];

const tahleemEQuran: Video[] = [
  { id: "r7do50t22R4", title: "Tahleem-e-Quran — Part 01" },
  { id: "7LzJI-XX8Dc", title: "Tahleem-e-Quran — Part 02" },
  { id: "S5xOTcwsijA", title: "Tahleem-e-Quran — Part 03" },
];

const mahafilMasajidMadaris: Video[] = [
  { id: "uDCAElW5xF0", title: "Eid ul Fitr 2026 in Markazi Jameh Masjid Arazi Khas" },
];

/** Videos per category id. Categories without an entry have no video screen yet. */
export const videosByCategory: Record<string, Video[]> = {
  mahafils: mahafilMasajidMadaris,
  tareekh: tazkiraTulIbaad,
  quranlearning: tahleemEQuran,
};

export const CHANNEL_NAME = "Aliflaameem";

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0&modestbranding=1`;
