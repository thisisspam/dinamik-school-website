"use server";

import { and, asc, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db/client";
import { hasValidSession } from "@/lib/auth";
import {
  CUSTOM_HOMEPAGE_SECTION_TYPES,
  HOMEPAGE_SECTION_THEMES,
  type CustomHomepageSectionType,
  type HomepageSectionTheme,
} from "@/lib/content";

function requiredText(formData: FormData, name: string): string {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`${name} alanı zorunludur.`);
  return value;
}

function optionalText(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function validTheme(formData: FormData): HomepageSectionTheme {
  const value = String(formData.get("theme") ?? "original") as HomepageSectionTheme;
  return HOMEPAGE_SECTION_THEMES.includes(value) ? value : "original";
}

function validCustomType(formData: FormData): CustomHomepageSectionType {
  const value = String(formData.get("sectionType") ?? "custom-content") as CustomHomepageSectionType;
  return CUSTOM_HOMEPAGE_SECTION_TYPES.includes(value) ? value : "custom-content";
}

function safeHref(formData: FormData): string | null {
  const href = optionalText(formData, "ctaHref");
  if (!href) return null;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : null;
  } catch {
    return null;
  }
}

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

function refreshHomepageSections(): void {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/bilesenler");
}

export async function createHomepageSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const db = getDb();
  const [{ value: currentMax }] = await db.select({ value: max(schema.homepageSections.sortOrder) }).from(schema.homepageSections);
  const uniqueSuffix = crypto.randomUUID().slice(0, 8);

  await db.insert(schema.homepageSections).values({
    sectionKey: `custom-${Date.now()}-${uniqueSuffix}`,
    sectionType: validCustomType(formData),
    displayName: requiredText(formData, "displayName"),
    eyebrow: optionalText(formData, "eyebrow"),
    title: requiredText(formData, "title"),
    description: optionalText(formData, "description"),
    ctaLabel: optionalText(formData, "ctaLabel"),
    ctaHref: safeHref(formData),
    theme: validTheme(formData),
    isVisible: formData.get("isVisible") === "on",
    isDeletable: true,
    sortOrder: (currentMax ?? 0) + 10,
  });

  refreshHomepageSections();
  redirect("/admin/bilesenler?saved=1");
}

export async function updateHomepageSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz bileşen kimliği.");

  const db = getDb();
  const row = (await db.select().from(schema.homepageSections).where(eq(schema.homepageSections.id, id)))[0];
  if (!row) throw new Error("Bileşen bulunamadı.");

  await db.update(schema.homepageSections).set({
    sectionType: row.isDeletable ? validCustomType(formData) : row.sectionType,
    displayName: requiredText(formData, "displayName"),
    eyebrow: optionalText(formData, "eyebrow"),
    title: requiredText(formData, "title"),
    description: optionalText(formData, "description"),
    ctaLabel: optionalText(formData, "ctaLabel"),
    ctaHref: safeHref(formData),
    theme: validTheme(formData),
    isVisible: formData.get("isVisible") === "on",
  }).where(eq(schema.homepageSections.id, id));

  refreshHomepageSections();
  redirect("/admin/bilesenler?saved=1");
}

export async function toggleHomepageSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const nextVisible = String(formData.get("nextVisible")) === "true";
  if (!Number.isInteger(id)) throw new Error("Geçersiz bileşen kimliği.");

  const db = getDb();
  await db.update(schema.homepageSections).set({ isVisible: nextVisible }).where(eq(schema.homepageSections.id, id));
  refreshHomepageSections();
}

export async function deleteHomepageSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz bileşen kimliği.");

  const db = getDb();
  await db.delete(schema.homepageSections).where(
    and(eq(schema.homepageSections.id, id), eq(schema.homepageSections.isDeletable, true)),
  );
  refreshHomepageSections();
}

export async function moveHomepageSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const direction = String(formData.get("direction"));
  if (!Number.isInteger(id) || !["up", "down"].includes(direction)) throw new Error("Geçersiz sıralama isteği.");

  const db = getDb();
  const customRows = await db.select().from(schema.homepageSections)
    .where(eq(schema.homepageSections.isDeletable, true))
    .orderBy(asc(schema.homepageSections.sortOrder));
  const index = customRows.findIndex((row) => row.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= customRows.length) return;

  const current = customRows[index];
  const adjacent = customRows[swapIndex];
  await db.update(schema.homepageSections).set({ sortOrder: adjacent.sortOrder }).where(eq(schema.homepageSections.id, current.id));
  await db.update(schema.homepageSections).set({ sortOrder: current.sortOrder }).where(eq(schema.homepageSections.id, adjacent.id));
  refreshHomepageSections();
}
