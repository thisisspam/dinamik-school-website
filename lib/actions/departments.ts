"use server";

import { and, eq, max } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/lib/db/client";
import { hasValidSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/media";
import { blocksToLegacyFields, parseDepartmentBlocksFromForm } from "@/lib/department-blocks";

const DEPARTMENT_ACCENTS = ["red", "indigo", "cyan"] as const;

function requiredText(formData: FormData, name: string): string {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`${name} alanı zorunludur.`);
  return value;
}

function normalizeSlug(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function validAccent(formData: FormData): (typeof DEPARTMENT_ACCENTS)[number] {
  const accent = String(formData.get("accent") ?? "red") as (typeof DEPARTMENT_ACCENTS)[number];
  return DEPARTMENT_ACCENTS.includes(accent) ? accent : "red";
}

function validImagePath(value: string): string {
  const path = value.trim();
  return path.startsWith("/") && !path.startsWith("//") ? path : "/images/hero-lab.jpg";
}

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

function revalidateDepartmentPages(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/bolumler");
  revalidatePath("/admin");
  revalidatePath("/admin/bolumler");
  if (slug) revalidatePath(`/bolumler/${slug}`);
}

async function resolveImage(formData: FormData, fallback: string): Promise<string> {
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) return saveUploadedFile(imageFile);
  return validImagePath(String(formData.get("imagePath") ?? fallback));
}

export async function createDepartmentAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const db = getDb();
  const slug = normalizeSlug(requiredText(formData, "slug"));
  if (!slug) throw new Error("Geçerli bir bölüm bağlantısı girin.");
  const existing = await db.select({ id: schema.departments.id }).from(schema.departments).where(eq(schema.departments.slug, slug));
  if (existing.length > 0) throw new Error("Bu bölüm bağlantısı zaten kullanılıyor.");

  const [{ value: currentMax }] = await db.select({ value: max(schema.departments.sortOrder) }).from(schema.departments);
  const image = await resolveImage(formData, "/images/hero-lab.jpg");
  const contentBlocks = parseDepartmentBlocksFromForm(formData);
  const legacyFields = blocksToLegacyFields(contentBlocks);
  await db.insert(schema.departments).values({
    slug,
    shortTitle: requiredText(formData, "shortTitle"),
    title: requiredText(formData, "title"),
    branch: requiredText(formData, "branch"),
    image,
    accent: validAccent(formData),
    lead: requiredText(formData, "lead"),
    purpose: requiredText(formData, "purpose"),
    ...legacyFields,
    contentBlocks,
    isVisible: formData.get("isVisible") === "on",
    isDeletable: true,
    sortOrder: (currentMax ?? 0) + 10,
  });

  revalidateDepartmentPages(slug);
  redirect("/admin/bolumler?saved=1");
}

export async function updateDepartmentAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const db = getDb();
  const existing = (await db.select().from(schema.departments).where(eq(schema.departments.id, id)))[0];
  if (!existing) throw new Error("Bölüm bulunamadı.");

  const image = await resolveImage(formData, existing.image);
  const contentBlocks = parseDepartmentBlocksFromForm(formData);
  const legacyFields = blocksToLegacyFields(contentBlocks);
  await db.update(schema.departments).set({
    shortTitle: requiredText(formData, "shortTitle"),
    title: requiredText(formData, "title"),
    branch: requiredText(formData, "branch"),
    accent: validAccent(formData),
    lead: requiredText(formData, "lead"),
    purpose: requiredText(formData, "purpose"),
    image,
    ...legacyFields,
    contentBlocks,
    isVisible: formData.get("isVisible") === "on",
  }).where(eq(schema.departments.id, id));

  revalidateDepartmentPages(existing.slug);
  redirect("/admin/bolumler?saved=1");
}

export async function toggleDepartmentVisibilityAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const isVisible = String(formData.get("nextVisible")) === "true";
  if (!Number.isInteger(id)) throw new Error("Geçersiz bölüm kimliği.");

  const db = getDb();
  const row = (await db.select({ slug: schema.departments.slug }).from(schema.departments).where(eq(schema.departments.id, id)))[0];
  if (!row) throw new Error("Bölüm bulunamadı.");
  await db.update(schema.departments).set({ isVisible }).where(eq(schema.departments.id, id));
  revalidateDepartmentPages(row.slug);
}

export async function deleteDepartmentAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Geçersiz bölüm kimliği.");

  const db = getDb();
  const row = (await db.select().from(schema.departments).where(eq(schema.departments.id, id)))[0];
  if (!row || !row.isDeletable) return;
  await db.delete(schema.departments).where(
    and(eq(schema.departments.id, id), eq(schema.departments.isDeletable, true)),
  );
  revalidateDepartmentPages(row.slug);
}
