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
  collectionKey: text("collection_key").notNull().default("site-gallery"),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  caption: text("caption"),
  description: text("description"),
  albumId: text("album_id"),
  albumTitle: text("album_title"),
  fit: text("fit").notNull().default("cover"),
  objectPosition: text("object_position"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const mediaCollections = pgTable("media_collections", {
  id: serial("id").primaryKey(),
  collectionKey: text("collection_key").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const mediaAlbums = pgTable("media_albums", {
  id: serial("id").primaryKey(),
  albumKey: text("album_key").notNull().unique(),
  collectionKey: text("collection_key").notNull(),
  departmentSlug: text("department_slug"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
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
  content: jsonb("content").$type<Record<string, string>>(),
  isVisible: boolean("is_visible").notNull().default(true),
  isDeletable: boolean("is_deletable").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contentPages = pgTable("content_pages", {
  id: serial("id").primaryKey(),
  pageKey: text("page_key").notNull().unique(),
  displayName: text("display_name").notNull(),
  route: text("route").notNull(),
  category: text("category").notNull(),
  theme: text("theme").notNull().default("original"),
  content: jsonb("content").notNull().$type<Record<string, string>>(),
  updatedAt: text("updated_at").notNull(),
});

export const siteTheme = pgTable("site_theme", {
  id: serial("id").primaryKey(),
  brandNavy: text("brand_navy").notNull(),
  brandNavyDeep: text("brand_navy_deep").notNull(),
  brandRed: text("brand_red").notNull(),
  brandRedDark: text("brand_red_dark").notNull(),
  surface: text("surface").notNull(),
  surfaceSoft: text("surface_soft").notNull(),
  ink: text("ink").notNull(),
  muted: text("muted").notNull(),
  border: text("border").notNull(),
  headerBackground: text("header_background").notNull(),
  footerBackground: text("footer_background").notNull(),
  containerWidth: integer("container_width").notNull().default(1280),
  buttonRadius: integer("button_radius").notNull().default(999),
  cardRadius: integer("card_radius").notNull().default(18),
  shadowIntensity: integer("shadow_intensity").notNull().default(100),
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
