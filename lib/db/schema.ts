import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { DepartmentContentBlock } from "@/lib/department-blocks";

export const departments = sqliteTable("departments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  shortTitle: text("short_title").notNull(),
  title: text("title").notNull(),
  branch: text("branch").notNull(),
  image: text("image").notNull(),
  accent: text("accent").notNull(),
  lead: text("lead").notNull(),
  purpose: text("purpose").notNull(),
  facts: text("facts", { mode: "json" }).notNull().$type<Array<{ label: string; value: string }>>(),
  skills: text("skills", { mode: "json" }).notNull().$type<string[]>(),
  learningAreas: text("learning_areas", { mode: "json" })
    .notNull()
    .$type<Array<{ title: string; text: string }>>(),
  careerAreas: text("career_areas", { mode: "json" }).notNull().$type<string[]>(),
  contentBlocks: text("content_blocks", { mode: "json" }).$type<DepartmentContentBlock[]>(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  isDeletable: integer("is_deletable", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const staff = sqliteTable("staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  role: text("role").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const galleryImages = sqliteTable("gallery_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  generalPhone: text("general_phone").notNull(),
  landlinePhone: text("landline_phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  addressLine: text("address_line").notNull(),
  mapUrl: text("map_url").notNull(),
  hours: text("hours").notNull(),
  instagramUrl: text("instagram_url").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
});

export const homepageSections = sqliteTable("homepage_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionKey: text("section_key").notNull().unique(),
  sectionType: text("section_type").notNull(),
  displayName: text("display_name").notNull(),
  eyebrow: text("eyebrow"),
  title: text("title").notNull(),
  description: text("description"),
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  theme: text("theme").notNull().default("original"),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  isDeletable: integer("is_deletable", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const registrationApplications = sqliteTable("registration_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentName: text("student_name").notNull(),
  parentName: text("parent_name").notNull(),
  grade: text("grade").notNull(),
  phone: text("phone").notNull(),
  department: text("department").notNull(),
  source: text("source").notNull().default("/on-kayit"),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  consentAccepted: integer("consent_accepted", { mode: "boolean" }).notNull().default(true),
  privacyNoticeVersion: text("privacy_notice_version").notNull().default("legacy-consent"),
  whatsappConsent: integer("whatsapp_consent", { mode: "boolean" }).notNull().default(false),
  consentAcceptedAt: text("consent_accepted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
