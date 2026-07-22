import { pgTable, serial, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import type { DepartmentContentBlock } from "@/lib/department-blocks";

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  shortTitle: text("short_title").notNull(),
  title: text("title").notNull(),
  branch: text("branch").notNull(),
  image: text("image").notNull(),
  accent: text("accent").notNull(),
  lead: text("lead").notNull(),
  purpose: text("purpose").notNull(),
  facts: jsonb("facts").notNull().$type<Array<{ label: string; value: string }>>(),
  skills: jsonb("skills").notNull().$type<string[]>(),
  learningAreas: jsonb("learning_areas")
    .notNull()
    .$type<Array<{ title: string; text: string }>>(),
  careerAreas: jsonb("career_areas").notNull().$type<string[]>(),
  contentBlocks: jsonb("content_blocks").$type<DepartmentContentBlock[]>(),
  isVisible: boolean("is_visible").notNull().default(true),
  isDeletable: boolean("is_deletable").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  role: text("role").notNull(),
  additionalRole: text("additional_role"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
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

export const homepageSections = pgTable("homepage_sections", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  sectionType: text("section_type").notNull(),
  displayName: text("display_name").notNull(),
  eyebrow: text("eyebrow"),
  title: text("title").notNull(),
  description: text("description"),
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  theme: text("theme").notNull().default("original"),
  isVisible: boolean("is_visible").notNull().default(true),
  isDeletable: boolean("is_deletable").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const registrationApplications = pgTable("registration_applications", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  parentName: text("parent_name").notNull(),
  grade: text("grade").notNull(),
  phone: text("phone").notNull(),
  department: text("department").notNull(),
  source: text("source").notNull().default("/on-kayit"),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  consentAccepted: boolean("consent_accepted").notNull().default(true),
  privacyNoticeVersion: text("privacy_notice_version").notNull().default("legacy-consent"),
  whatsappConsent: boolean("whatsapp_consent").notNull().default(false),
  consentAcceptedAt: text("consent_accepted_at").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
