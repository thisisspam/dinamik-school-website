import { asc } from "drizzle-orm";
import { getDb, schema } from "./db/client";

export type GalleryImage = { src: string; alt: string; caption?: string };

export type SiteSettings = {
  generalPhone: string;
  landlinePhone: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  mapUrl: string;
  hours: string;
  instagramUrl: string;
};

export const HOMEPAGE_SECTION_THEMES = ["original", "light", "navy", "red"] as const;
export const CUSTOM_HOMEPAGE_SECTION_TYPES = ["custom-content", "custom-announcement", "custom-cta"] as const;

export type HomepageSectionTheme = (typeof HOMEPAGE_SECTION_THEMES)[number];
export type CustomHomepageSectionType = (typeof CUSTOM_HOMEPAGE_SECTION_TYPES)[number];
export type HomepageSection = {
  id: number;
  sectionKey: string;
  sectionType: string;
  displayName: string;
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme: HomepageSectionTheme;
  isVisible: boolean;
  isDeletable: boolean;
  sortOrder: number;
};

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const db = await getDb();
  const rows = await db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.sortOrder));
  return rows.map((row) => ({ src: row.src, alt: row.alt, caption: row.caption ?? undefined }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const rows = await db.select().from(schema.siteSettings);
  const row = rows[0];
  if (!row) throw new Error("Site ayarları bulunamadı. `npm run db:seed` çalıştırın.");
  return {
    generalPhone: row.generalPhone,
    landlinePhone: row.landlinePhone,
    whatsapp: row.whatsapp,
    email: row.email,
    addressLine: row.addressLine,
    mapUrl: row.mapUrl,
    hours: row.hours,
    instagramUrl: row.instagramUrl,
  };
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const db = await getDb();
  const rows = await db.select().from(schema.homepageSections).orderBy(asc(schema.homepageSections.sortOrder));
  return rows.map((row) => ({
    id: row.id,
    sectionKey: row.sectionKey,
    sectionType: row.sectionType,
    displayName: row.displayName,
    eyebrow: row.eyebrow ?? undefined,
    title: row.title,
    description: row.description ?? undefined,
    ctaLabel: row.ctaLabel ?? undefined,
    ctaHref: row.ctaHref ?? undefined,
    theme: HOMEPAGE_SECTION_THEMES.includes(row.theme as HomepageSectionTheme)
      ? (row.theme as HomepageSectionTheme)
      : "original",
    isVisible: row.isVisible,
    isDeletable: row.isDeletable,
    sortOrder: row.sortOrder,
  }));
}
