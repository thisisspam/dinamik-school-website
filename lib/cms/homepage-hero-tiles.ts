export type HomepageHeroTileSize = "featured" | "standard";

export type HomepageHeroTile = {
  id: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  size: HomepageHeroTileSize;
};

export const DEFAULT_HOMEPAGE_HERO_TILES: HomepageHeroTile[] = [
  {
    id: "okulumuzu-taniyin",
    title: "Okulumuzu Tanıyın",
    href: "/okulumuz#okulumuzu-taniyin",
    image: "/images/okulumuzu-taniyin-thumb.webp",
    imageAlt: "Dinamik Okulları tanıtım videosu",
    size: "featured",
  },
  {
    id: "uygulamali-egitim",
    title: "Uygulamalı Eğitim",
    href: "#bolumler",
    image: "/images/uygulamali-egitim-kimya.webp",
    imageAlt: "Kimya laboratuvarında uygulamalı analiz çalışması",
    size: "standard",
  },
  {
    id: "dinamikte-yasam",
    title: "Dinamik'te Yaşam",
    href: "#galeri",
    image: "/images/activities/social/meb-robot-yarismasi/meb-robot-yarismasi-01.webp",
    imageAlt: "Dinamik Okulları öğrencileri MEB Robot Yarışması'nda",
    size: "standard",
  },
];

function safeId(value: unknown, index: number): string {
  if (typeof value !== "string") return `hero-tile-${index + 1}`;
  const id = value.trim().replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return id || `hero-tile-${index + 1}`;
}

function normalizedTile(value: unknown, index: number): HomepageHeroTile | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Record<keyof HomepageHeroTile, unknown>>;
  const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
  const href = typeof candidate.href === "string" ? candidate.href.trim() : "";
  const image = typeof candidate.image === "string" ? candidate.image.trim() : "";
  const imageAlt = typeof candidate.imageAlt === "string" ? candidate.imageAlt.trim() : "";
  if (!title || !href || !image) return null;

  return {
    id: safeId(candidate.id, index),
    title,
    href,
    image,
    imageAlt,
    size: candidate.size === "featured" ? "featured" : "standard",
  };
}

export function parseHomepageHeroTiles(value: string | undefined): HomepageHeroTile[] {
  if (!value?.trim()) return DEFAULT_HOMEPAGE_HERO_TILES;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      const tiles = parsed.slice(0, 8).map(normalizedTile).filter((tile): tile is HomepageHeroTile => Boolean(tile));
      if (tiles.length > 0) return tiles;
    }
  } catch {
    // Existing records used one "title | href | image | image alt" card per line.
  }

  const legacyTiles = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((line, index) => {
      const [title, href, image, imageAlt = ""] = line.split("|").map((column) => column.trim());
      return normalizedTile({
        id: `hero-tile-${index + 1}`,
        title,
        href,
        image,
        imageAlt,
        size: index === 0 ? "featured" : "standard",
      }, index);
    })
    .filter((tile): tile is HomepageHeroTile => Boolean(tile));

  return legacyTiles.length > 0 ? legacyTiles : DEFAULT_HOMEPAGE_HERO_TILES;
}
