import type { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_title TEXT NOT NULL,
  title TEXT NOT NULL,
  branch TEXT NOT NULL,
  image TEXT NOT NULL,
  accent TEXT NOT NULL,
  lead TEXT NOT NULL,
  purpose TEXT NOT NULL,
  facts TEXT NOT NULL,
  skills TEXT NOT NULL,
  learning_areas TEXT NOT NULL,
  career_areas TEXT NOT NULL,
  content_blocks TEXT,
  is_visible INTEGER NOT NULL DEFAULT 1,
  is_deletable INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  role TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  general_phone TEXT NOT NULL,
  landline_phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  address_line TEXT NOT NULL,
  map_url TEXT NOT NULL,
  hours TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  youtube_url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS homepage_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  section_key TEXT NOT NULL UNIQUE,
  section_type TEXT NOT NULL,
  display_name TEXT NOT NULL,
  eyebrow TEXT,
  title TEXT NOT NULL,
  description TEXT,
  cta_label TEXT,
  cta_href TEXT,
  theme TEXT NOT NULL DEFAULT 'original',
  is_visible INTEGER NOT NULL DEFAULT 1,
  is_deletable INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS registration_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '/on-kayit',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  consent_accepted INTEGER NOT NULL DEFAULT 1,
  privacy_notice_version TEXT NOT NULL DEFAULT 'legacy-consent',
  whatsapp_consent INTEGER NOT NULL DEFAULT 0,
  consent_accepted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

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

export function ensureDepartmentManagementColumns(db: DatabaseSync): void {
  const columns = db.prepare("PRAGMA table_info(departments)").all() as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));
  if (!columnNames.has("is_visible")) {
    db.exec("ALTER TABLE departments ADD COLUMN is_visible INTEGER NOT NULL DEFAULT 1;");
  }
  if (!columnNames.has("is_deletable")) {
    db.exec("ALTER TABLE departments ADD COLUMN is_deletable INTEGER NOT NULL DEFAULT 0;");
  }
  if (!columnNames.has("content_blocks")) {
    db.exec("ALTER TABLE departments ADD COLUMN content_blocks TEXT;");
  }
}

export function ensureRegistrationPrivacyColumns(db: DatabaseSync): void {
  const columns = db.prepare("PRAGMA table_info(registration_applications)").all() as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));
  if (!columnNames.has("privacy_notice_version")) {
    db.exec("ALTER TABLE registration_applications ADD COLUMN privacy_notice_version TEXT NOT NULL DEFAULT 'legacy-consent';");
  }
  if (!columnNames.has("whatsapp_consent")) {
    db.exec("ALTER TABLE registration_applications ADD COLUMN whatsapp_consent INTEGER NOT NULL DEFAULT 1;");
  }
  if (!columnNames.has("consent_accepted_at")) {
    db.exec("ALTER TABLE registration_applications ADD COLUMN consent_accepted_at TEXT;");
    db.exec("UPDATE registration_applications SET consent_accepted_at = created_at WHERE consent_accepted_at IS NULL;");
  }
}

export function ensureHomepageSections(db: DatabaseSync): void {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM homepage_sections").get() as { count: number };
  if (count > 0) return;

  const sections = readJson<HomepageSectionSeed[]>("homepage-sections.json");
  const insertSection = db.prepare(
    `INSERT INTO homepage_sections
      (section_key, section_type, display_name, eyebrow, title, description, cta_label, cta_href, theme, is_visible, is_deletable, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  sections.forEach((section) => {
    insertSection.run(
      section.sectionKey,
      section.sectionType,
      section.displayName,
      section.eyebrow ?? null,
      section.title,
      section.description ?? null,
      section.ctaLabel ?? null,
      section.ctaHref ?? null,
      section.theme,
      section.isVisible ? 1 : 0,
      section.isDeletable ? 1 : 0,
      section.sortOrder,
    );
  });
}

export function seedInitialContent(db: DatabaseSync): void {
  const departments = readJson<DepartmentSeed[]>("departments.json");
  const insertDepartment = db.prepare(
    `INSERT INTO departments (slug, short_title, title, branch, image, accent, lead, purpose, facts, skills, learning_areas, career_areas, content_blocks, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  departments.forEach((department, index) => {
    insertDepartment.run(
      department.slug,
      department.shortTitle,
      department.title,
      department.branch,
      department.image,
      department.accent,
      department.lead,
      department.purpose,
      JSON.stringify(department.facts),
      JSON.stringify(department.skills),
      JSON.stringify(department.learningAreas),
      JSON.stringify(department.careerAreas),
      department.contentBlocks ? JSON.stringify(department.contentBlocks) : null,
      index,
    );
  });

  const staffGroups = readJson<StaffGroupSeed[]>("staff.json");
  const insertStaff = db.prepare("INSERT INTO staff (name, category, role, sort_order) VALUES (?, ?, ?, ?)");
  let staffSortOrder = 0;
  for (const group of staffGroups) {
    for (const name of group.names) {
      insertStaff.run(name, group.category, group.role, staffSortOrder);
      staffSortOrder += 1;
    }
  }

  const gallery = readJson<GalleryImageSeed[]>("gallery.json");
  const insertGalleryImage = db.prepare("INSERT INTO gallery_images (src, alt, caption, sort_order) VALUES (?, ?, ?, ?)");
  gallery.forEach((image, index) => {
    insertGalleryImage.run(image.src, image.alt, image.caption ?? null, index);
  });

  const settings = readJson<SiteSettingsSeed>("site-settings.json");
  db.prepare(
    `INSERT INTO site_settings (general_phone, landline_phone, whatsapp, email, address_line, map_url, hours, instagram_url, youtube_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    settings.generalPhone,
    settings.landlinePhone,
    settings.whatsapp,
    settings.email,
    settings.addressLine,
    settings.mapUrl,
    settings.hours,
    settings.instagramUrl,
    settings.youtubeUrl,
  );

  ensureHomepageSections(db);
}
