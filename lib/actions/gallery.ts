"use server";

import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/lib/db/client";
import { saveUploadedFile } from "@/lib/media";
import { hasValidSession } from "@/lib/auth";
import { isMediaCollectionKey, type MediaCollectionKey } from "@/lib/cms/media-collections";

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

function collectionFromForm(formData: FormData): MediaCollectionKey {
  const value = String(formData.get("collectionKey") ?? "");
  if (!isMediaCollectionKey(value)) throw new Error("Geçersiz medya koleksiyonu.");
  return value;
}

function revalidateMediaRoutes(): void {
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/basarilarimiz");
  revalidatePath("/faaliyetlerimiz");
}

function galleryAdminPath(collectionKey: MediaCollectionKey): string {
  return `/admin/galeri?collection=${collectionKey}&saved=1`;
}

export async function uploadGalleryImageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const collectionKey = collectionFromForm(formData);
  const imageFile = formData.get("imageFile");
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    redirect(`/admin/galeri?collection=${collectionKey}`);
  }

  const db = await getDb();
  const src = await saveUploadedFile(imageFile);
  const existing = await db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.collectionKey, collectionKey));
  const nextOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
  const fit = String(formData.get("fit") ?? "cover") === "contain" ? "contain" : "cover";

  await db.insert(schema.galleryImages).values({
    collectionKey,
    src,
    alt: String(formData.get("alt") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    albumId: String(formData.get("albumId") ?? "").trim() || null,
    albumTitle: String(formData.get("albumTitle") ?? "").trim() || null,
    fit,
    objectPosition: String(formData.get("objectPosition") ?? "").trim() || null,
    sortOrder: nextOrder,
  });

  revalidateMediaRoutes();
  redirect(galleryAdminPath(collectionKey));
}

export async function deleteGalleryImageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const collectionKey = collectionFromForm(formData);
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) throw new Error("Geçersiz galeri kaydı.");

  const db = await getDb();
  await db.delete(schema.galleryImages).where(and(
    eq(schema.galleryImages.id, id),
    eq(schema.galleryImages.collectionKey, collectionKey),
  ));

  revalidateMediaRoutes();
  redirect(galleryAdminPath(collectionKey));
}

export async function updateGalleryImageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const collectionKey = collectionFromForm(formData);
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) throw new Error("Geçersiz galeri kaydı.");
  const alt = String(formData.get("alt") ?? "").trim();
  if (!alt) throw new Error("Görsel açıklaması zorunludur.");

  const fit = String(formData.get("fit") ?? "cover") === "contain" ? "contain" : "cover";
  const db = await getDb();
  await db
    .update(schema.galleryImages)
    .set({
      alt,
      caption: String(formData.get("caption") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      albumId: String(formData.get("albumId") ?? "").trim() || null,
      albumTitle: String(formData.get("albumTitle") ?? "").trim() || null,
      fit,
      objectPosition: String(formData.get("objectPosition") ?? "").trim() || null,
    })
    .where(and(
      eq(schema.galleryImages.id, id),
      eq(schema.galleryImages.collectionKey, collectionKey),
    ));

  revalidateMediaRoutes();
  redirect(galleryAdminPath(collectionKey));
}

export async function moveGalleryImageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const collectionKey = collectionFromForm(formData);
  const id = Number(formData.get("id"));
  const direction = String(formData.get("direction"));
  if (!Number.isInteger(id) || !["up", "down"].includes(direction)) {
    throw new Error("Geçersiz sıralama isteği.");
  }

  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.collectionKey, collectionKey))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));
  const index = rows.findIndex((row) => row.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= rows.length) return;

  const current = rows[index];
  const adjacent = rows[swapIndex];
  await db.update(schema.galleryImages).set({ sortOrder: adjacent.sortOrder }).where(eq(schema.galleryImages.id, current.id));
  await db.update(schema.galleryImages).set({ sortOrder: current.sortOrder }).where(eq(schema.galleryImages.id, adjacent.id));
  revalidateMediaRoutes();
  redirect(galleryAdminPath(collectionKey));
}
