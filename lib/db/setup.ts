import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const CREATE_TABLE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    short_title TEXT NOT NULL,
    title TEXT NOT NULL,
    branch TEXT NOT NULL,
    image TEXT NOT NULL,
    accent TEXT NOT NULL,
    lead TEXT NOT NULL,
    purpose TEXT NOT NULL,
    facts JSONB NOT NULL,
    skills JSONB NOT NULL,
    learning_areas JSONB NOT NULL,
    career_areas JSONB NOT NULL,
    content_blocks JSONB,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    is_deletable BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    role TEXT NOT NULL,
    image TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `ALTER TABLE staff ADD COLUMN IF NOT EXISTS image TEXT`,
  `CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    src TEXT NOT NULL,
    alt TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    general_phone TEXT NOT NULL,
    landline_phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    address_line TEXT NOT NULL,
    map_url TEXT NOT NULL,
    hours TEXT NOT NULL,
    instagram_url TEXT NOT NULL,
    youtube_url TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_sections (
    id SERIAL PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    section_type TEXT NOT NULL,
    display_name TEXT NOT NULL,
    eyebrow TEXT,
    title TEXT NOT NULL,
    description TEXT,
    cta_label TEXT,
    cta_href TEXT,
    theme TEXT NOT NULL DEFAULT 'original',
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    is_deletable BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS registration_applications (
    id SERIAL PRIMARY KEY,
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT '/on-kayit',
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT,
    consent_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    privacy_notice_version TEXT NOT NULL DEFAULT 'legacy-consent',
    whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE,
    consent_accepted_at TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
  )`,
];

const CONTENT_DIR = resolve(process.cwd(), "content");

type DepartmentSeed = {
  slug: string;
  shortTitle: string;
  title: string;
  branch: string;
  image: string;
  accent: string;
  lead: string;
  purpose: string;
  facts: unknown;
  skills: unknown;
  learningAreas: unknown;
  careerAreas: unknown;
  contentBlocks?: unknown;
};
type StaffGroupSeed = { category: string; role: string; names: string[] };
type StaffPortraitSeed = {
  name: string;
  aliases?: string[];
  category: string;
  role: string;
  image: string;
};
type GalleryImageSeed = { src: string; alt: string; caption?: string };
type SiteSettingsSeed = {
  generalPhone: string;
  landlinePhone: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  mapUrl: string;
  hours: string;
  instagramUrl: string;
  youtubeUrl: string;
};
type HomepageSectionSeed = {
  sectionKey: string;
  sectionType: string;
  displayName: string;
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme: string;
  isVisible: boolean;
  isDeletable: boolean;
  sortOrder: number;
};

function readJson<T>(fileName: string): T {
  return JSON.parse(readFileSync(resolve(CONTENT_DIR, fileName), "utf8")) as T;
}

export async function ensureHomepageSections(db: NeonHttpDatabase<typeof schema>): Promise<void> {
  const existing = await db.select({ id: schema.homepageSections.id }).from(schema.homepageSections).limit(1);
  if (existing.length > 0) return;

  const sections = readJson<HomepageSectionSeed[]>("homepage-sections.json");
  await db.insert(schema.homepageSections).values(sections);
}

export async function seedInitialContent(db: NeonHttpDatabase<typeof schema>): Promise<void> {
  const departments = readJson<DepartmentSeed[]>("departments.json");
  await db.insert(schema.departments).values(
    departments.map((department, index) => ({
      slug: department.slug,
      shortTitle: department.shortTitle,
      title: department.title,
      branch: department.branch,
      image: department.image,
      accent: department.accent,
      lead: department.lead,
      purpose: department.purpose,
      facts: department.facts as Array<{ label: string; value: string }>,
      skills: department.skills as string[],
      learningAreas: department.learningAreas as Array<{ title: string; text: string }>,
      careerAreas: department.careerAreas as string[],
      contentBlocks: (department.contentBlocks ?? null) as never,
      sortOrder: index,
    })),
  );

  const staffGroups = readJson<StaffGroupSeed[]>("staff.json");
  const staffPortraits = readJson<StaffPortraitSeed[]>("staff-portraits.json");
  const staffRows: Array<{ name: string; category: string; role: string; image: string | null; sortOrder: number }> = [];
  let staffSortOrder = 0;
  for (const group of staffGroups) {
    for (const name of group.names) {
      staffRows.push({ name, category: group.category, role: group.role, image: null, sortOrder: staffSortOrder });
      staffSortOrder += 1;
    }
  }

  for (const portrait of staffPortraits) {
    const acceptedNames = new Set([portrait.name, ...(portrait.aliases ?? [])]);
    const existing = staffRows.find((row) => acceptedNames.has(row.name));
    if (existing) {
      existing.name = portrait.name;
      existing.category = portrait.category;
      existing.role = portrait.role;
      existing.image = portrait.image;
      continue;
    }

    const lastCategoryIndex = staffRows.findLastIndex((row) => row.category === portrait.category);
    const insertAt = lastCategoryIndex >= 0 ? lastCategoryIndex + 1 : staffRows.length;
    staffRows.splice(insertAt, 0, {
      name: portrait.name,
      category: portrait.category,
      role: portrait.role,
      image: portrait.image,
      sortOrder: staffSortOrder,
    });
    staffSortOrder += 1;
  }
  staffRows.forEach((row, index) => {
    row.sortOrder = index;
  });
  await db.insert(schema.staff).values(staffRows);

  const gallery = readJson<GalleryImageSeed[]>("gallery.json");
  await db.insert(schema.galleryImages).values(
    gallery.map((image, index) => ({ src: image.src, alt: image.alt, caption: image.caption ?? null, sortOrder: index })),
  );

  const settings = readJson<SiteSettingsSeed>("site-settings.json");
  await db.insert(schema.siteSettings).values(settings);

  await ensureHomepageSections(db);
}

export async function reseedInitialContent(db: NeonHttpDatabase<typeof schema>): Promise<void> {
  await db.delete(schema.departments);
  await db.delete(schema.staff);
  await db.delete(schema.galleryImages);
  await db.delete(schema.siteSettings);
  await db.delete(schema.homepageSections);
  await seedInitialContent(db);
}
