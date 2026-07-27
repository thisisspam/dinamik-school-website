"use server";

import { and, asc, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasValidSession } from "@/lib/auth";
import { getDb, schema } from "@/lib/db/client";
import { isActivityCollectionKey } from "@/lib/cms/activity-album-core";
import { isReferenceActiveDepartmentSlug } from "@/lib/cms/department-programs";
import type { ActivityCollectionKey } from "@/lib/cms/media-definitions";

const MAX_PHOTOS_PER_BATCH = 40;

export type UploadedActivityPhoto = {
  url: string;
  originalName: string;
};

export type ActivityAlbumDraft = {
  scope: "general" | "department";
  collectionKey?: ActivityCollectionKey;
  departmentSlug?: string;
  title: string;
  description: string;
  photos: UploadedActivityPhoto[];
};

export type ActivityAlbumMutationResult = {
  ok: boolean;
  message: string;
  albumId?: number;
};

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

function slugify(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "faaliyet";
}

function isTrustedBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.hostname.endsWith(".blob.vercel-storage.com")
      && url.pathname.startsWith("/cms/activities/");
  } catch {
    return false;
  }
}

function validatePhotos(photos: UploadedActivityPhoto[]): UploadedActivityPhoto[] {
  if (!Array.isArray(photos) || photos.length === 0) {
    throw new Error("Albüm için en az bir fotoğraf yükleyin.");
  }
  if (photos.length > MAX_PHOTOS_PER_BATCH) {
    throw new Error(`Tek seferde en fazla ${MAX_PHOTOS_PER_BATCH} fotoğraf yüklenebilir.`);
  }
  const normalized = photos.map((photo) => ({
    url: String(photo.url ?? "").trim(),
    originalName: String(photo.originalName ?? "").trim().slice(0, 180),
  }));
  if (normalized.some((photo) => !isTrustedBlobUrl(photo.url))) {
    throw new Error("Yüklenen fotoğraf adreslerinden biri doğrulanamadı.");
  }
  return normalized;
}

async function resolveAlbumDestination(input: {
  scope: "general" | "department";
  collectionKey?: string;
  departmentSlug?: string;
}): Promise<{ collectionKey: ActivityCollectionKey | "department-activities"; departmentSlug: string | null }> {
  if (input.scope === "general") {
    if (!input.collectionKey || !isActivityCollectionKey(input.collectionKey)) {
      throw new Error("Faaliyet türünü seçin.");
    }
    return { collectionKey: input.collectionKey, departmentSlug: null };
  }

  const departmentSlug = String(input.departmentSlug ?? "").trim();
  if (!isReferenceActiveDepartmentSlug(departmentSlug)) {
    throw new Error("Geçerli bir bölüm seçin.");
  }
  const db = await getDb();
  const [department] = await db
    .select({ slug: schema.departments.slug })
    .from(schema.departments)
    .where(and(
      eq(schema.departments.slug, departmentSlug),
      eq(schema.departments.isVisible, true),
    ))
    .limit(1);
  if (!department) throw new Error("Seçilen bölüm yayında değil.");
  return { collectionKey: "department-activities", departmentSlug };
}

function revalidateActivityRoutes(departmentSlugs: Array<string | null | undefined> = []): void {
  revalidatePath("/faaliyetlerimiz");
  revalidatePath("/admin/faaliyetler");
  for (const slug of new Set(departmentSlugs.filter((value): value is string => Boolean(value)))) {
    revalidatePath(`/bolumler/${slug}`);
  }
}

export async function createActivityAlbumAction(
  draft: ActivityAlbumDraft,
): Promise<ActivityAlbumMutationResult> {
  await requireAdminSession();
  try {
    const title = String(draft.title ?? "").trim();
    const description = String(draft.description ?? "").trim();
    if (title.length < 3) throw new Error("Faaliyet başlığı en az 3 karakter olmalıdır.");
    if (description.length < 10) throw new Error("Faaliyet açıklaması en az 10 karakter olmalıdır.");
    const photos = validatePhotos(draft.photos);
    const destination = await resolveAlbumDestination(draft);
    const db = await getDb();
    const existingAlbums = await db
      .select({ sortOrder: schema.mediaAlbums.sortOrder })
      .from(schema.mediaAlbums)
      .where(and(
        eq(schema.mediaAlbums.collectionKey, destination.collectionKey),
        destination.departmentSlug
          ? eq(schema.mediaAlbums.departmentSlug, destination.departmentSlug)
          : isNull(schema.mediaAlbums.departmentSlug),
      ));
    const nextSortOrder = existingAlbums.reduce((max, album) => Math.max(max, album.sortOrder), -1) + 1;
    const albumKey = `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();
    const [album] = await db
      .insert(schema.mediaAlbums)
      .values({
        albumKey,
        collectionKey: destination.collectionKey,
        departmentSlug: destination.departmentSlug,
        title,
        description,
        isVisible: true,
        sortOrder: nextSortOrder,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.mediaAlbums.id });

    try {
      await db.insert(schema.galleryImages).values(
        photos.map((photo, index) => ({
          collectionKey: destination.collectionKey,
          src: photo.url,
          alt: `${title} albümünden ${index + 1}. fotoğraf`,
          caption: title,
          description,
          albumId: albumKey,
          albumTitle: title,
          fit: "cover",
          objectPosition: null,
          sortOrder: index,
        })),
      );
    } catch (error) {
      await db.delete(schema.mediaAlbums).where(eq(schema.mediaAlbums.id, album.id));
      throw error;
    }

    revalidateActivityRoutes([destination.departmentSlug]);
    return { ok: true, message: `${photos.length} fotoğraflı faaliyet albümü oluşturuldu.`, albumId: album.id };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Faaliyet albümü oluşturulamadı." };
  }
}

export async function addPhotosToActivityAlbumAction(input: {
  albumId: number;
  photos: UploadedActivityPhoto[];
}): Promise<ActivityAlbumMutationResult> {
  await requireAdminSession();
  try {
    const albumId = Number(input.albumId);
    if (!Number.isInteger(albumId) || albumId <= 0) throw new Error("Geçersiz albüm.");
    const photos = validatePhotos(input.photos);
    const db = await getDb();
    const [album] = await db
      .select()
      .from(schema.mediaAlbums)
      .where(eq(schema.mediaAlbums.id, albumId))
      .limit(1);
    if (!album) throw new Error("Albüm bulunamadı.");
    const currentImages = await db
      .select({ sortOrder: schema.galleryImages.sortOrder })
      .from(schema.galleryImages)
      .where(eq(schema.galleryImages.albumId, album.albumKey));
    const firstSortOrder = currentImages.reduce((max, image) => Math.max(max, image.sortOrder), -1) + 1;

    await db.insert(schema.galleryImages).values(
      photos.map((photo, index) => ({
        collectionKey: album.collectionKey,
        src: photo.url,
        alt: `${album.title} albümünden ${currentImages.length + index + 1}. fotoğraf`,
        caption: album.title,
        description: album.description,
        albumId: album.albumKey,
        albumTitle: album.title,
        fit: "cover",
        objectPosition: null,
        sortOrder: firstSortOrder + index,
      })),
    );
    await db
      .update(schema.mediaAlbums)
      .set({ updatedAt: new Date().toISOString() })
      .where(eq(schema.mediaAlbums.id, albumId));
    revalidateActivityRoutes([album.departmentSlug]);
    return { ok: true, message: `${photos.length} fotoğraf albüme eklendi.`, albumId };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Fotoğraflar eklenemedi." };
  }
}

export async function updateActivityAlbumAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const albumId = Number(formData.get("albumId"));
  if (!Number.isInteger(albumId) || albumId <= 0) throw new Error("Geçersiz albüm.");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (title.length < 3 || description.length < 10) throw new Error("Başlık ve açıklama alanlarını tamamlayın.");
  const scope = String(formData.get("scope")) === "department" ? "department" : "general";
  const destination = await resolveAlbumDestination({
    scope,
    collectionKey: String(formData.get("collectionKey") ?? ""),
    departmentSlug: String(formData.get("departmentSlug") ?? ""),
  });
  const db = await getDb();
  const [current] = await db
    .select()
    .from(schema.mediaAlbums)
    .where(eq(schema.mediaAlbums.id, albumId))
    .limit(1);
  if (!current) throw new Error("Albüm bulunamadı.");

  await db
    .update(schema.mediaAlbums)
    .set({
      collectionKey: destination.collectionKey,
      departmentSlug: destination.departmentSlug,
      title,
      description,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.mediaAlbums.id, albumId));
  await db
    .update(schema.galleryImages)
    .set({
      collectionKey: destination.collectionKey,
      albumTitle: title,
      caption: title,
      description,
    })
    .where(eq(schema.galleryImages.albumId, current.albumKey));
  revalidateActivityRoutes([current.departmentSlug, destination.departmentSlug]);
  redirect(`/admin/faaliyetler/${albumId}?saved=1`);
}

export async function toggleActivityAlbumAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const albumId = Number(formData.get("albumId"));
  const db = await getDb();
  const [album] = await db.select().from(schema.mediaAlbums).where(eq(schema.mediaAlbums.id, albumId)).limit(1);
  if (!album) throw new Error("Albüm bulunamadı.");
  await db
    .update(schema.mediaAlbums)
    .set({ isVisible: !album.isVisible, updatedAt: new Date().toISOString() })
    .where(eq(schema.mediaAlbums.id, albumId));
  revalidateActivityRoutes([album.departmentSlug]);
  redirect(`/admin/faaliyetler/${albumId}?saved=1`);
}

export async function deleteActivityAlbumAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const albumId = Number(formData.get("albumId"));
  const db = await getDb();
  const [album] = await db.select().from(schema.mediaAlbums).where(eq(schema.mediaAlbums.id, albumId)).limit(1);
  if (!album) throw new Error("Albüm bulunamadı.");
  await db.delete(schema.galleryImages).where(eq(schema.galleryImages.albumId, album.albumKey));
  await db.delete(schema.mediaAlbums).where(eq(schema.mediaAlbums.id, albumId));
  revalidateActivityRoutes([album.departmentSlug]);
  redirect("/admin/faaliyetler?deleted=1");
}

export async function moveActivityAlbumAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const albumId = Number(formData.get("albumId"));
  const direction = String(formData.get("direction"));
  if (!Number.isInteger(albumId) || !["up", "down"].includes(direction)) throw new Error("Geçersiz sıralama isteği.");
  const db = await getDb();
  const [album] = await db.select().from(schema.mediaAlbums).where(eq(schema.mediaAlbums.id, albumId)).limit(1);
  if (!album) throw new Error("Albüm bulunamadı.");
  const rows = await db
    .select()
    .from(schema.mediaAlbums)
    .where(and(
      eq(schema.mediaAlbums.collectionKey, album.collectionKey),
      album.departmentSlug
        ? eq(schema.mediaAlbums.departmentSlug, album.departmentSlug)
        : isNull(schema.mediaAlbums.departmentSlug),
    ))
    .orderBy(asc(schema.mediaAlbums.sortOrder), asc(schema.mediaAlbums.id));
  const index = rows.findIndex((row) => row.id === albumId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index >= 0 && swapIndex >= 0 && swapIndex < rows.length) {
    const adjacent = rows[swapIndex];
    await db.update(schema.mediaAlbums).set({ sortOrder: adjacent.sortOrder }).where(eq(schema.mediaAlbums.id, album.id));
    await db.update(schema.mediaAlbums).set({ sortOrder: album.sortOrder }).where(eq(schema.mediaAlbums.id, adjacent.id));
  }
  revalidateActivityRoutes([album.departmentSlug]);
  redirect("/admin/faaliyetler");
}

export async function updateActivityPhotoAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const albumId = Number(formData.get("albumId"));
  const photoId = Number(formData.get("photoId"));
  const alt = String(formData.get("alt") ?? "").trim();
  if (!Number.isInteger(albumId) || !Number.isInteger(photoId) || !alt) throw new Error("Fotoğraf bilgileri geçersiz.");
  const db = await getDb();
  const detail = await db
    .select({ albumKey: schema.mediaAlbums.albumKey, departmentSlug: schema.mediaAlbums.departmentSlug })
    .from(schema.mediaAlbums)
    .where(eq(schema.mediaAlbums.id, albumId))
    .limit(1);
  if (!detail[0]) throw new Error("Albüm bulunamadı.");
  await db
    .update(schema.galleryImages)
    .set({
      alt,
      caption: String(formData.get("caption") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      fit: String(formData.get("fit")) === "contain" ? "contain" : "cover",
      objectPosition: String(formData.get("objectPosition") ?? "").trim() || null,
    })
    .where(and(
      eq(schema.galleryImages.id, photoId),
      eq(schema.galleryImages.albumId, detail[0].albumKey),
    ));
  revalidateActivityRoutes([detail[0].departmentSlug]);
  redirect(`/admin/faaliyetler/${albumId}?saved=1`);
}

export async function deleteActivityPhotoAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const albumId = Number(formData.get("albumId"));
  const photoId = Number(formData.get("photoId"));
  const db = await getDb();
  const [album] = await db.select().from(schema.mediaAlbums).where(eq(schema.mediaAlbums.id, albumId)).limit(1);
  if (!album) throw new Error("Albüm bulunamadı.");
  await db.delete(schema.galleryImages).where(and(
    eq(schema.galleryImages.id, photoId),
    eq(schema.galleryImages.albumId, album.albumKey),
  ));
  revalidateActivityRoutes([album.departmentSlug]);
  redirect(`/admin/faaliyetler/${albumId}?saved=1`);
}

export async function moveActivityPhotoAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const albumId = Number(formData.get("albumId"));
  const photoId = Number(formData.get("photoId"));
  const direction = String(formData.get("direction"));
  if (!Number.isInteger(albumId) || !Number.isInteger(photoId) || !["up", "down"].includes(direction)) {
    throw new Error("Geçersiz sıralama isteği.");
  }
  const db = await getDb();
  const [album] = await db.select().from(schema.mediaAlbums).where(eq(schema.mediaAlbums.id, albumId)).limit(1);
  if (!album) throw new Error("Albüm bulunamadı.");
  const rows = await db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.albumId, album.albumKey))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));
  const index = rows.findIndex((row) => row.id === photoId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index >= 0 && swapIndex >= 0 && swapIndex < rows.length) {
    const current = rows[index];
    const adjacent = rows[swapIndex];
    await db.update(schema.galleryImages).set({ sortOrder: adjacent.sortOrder }).where(eq(schema.galleryImages.id, current.id));
    await db.update(schema.galleryImages).set({ sortOrder: current.sortOrder }).where(eq(schema.galleryImages.id, adjacent.id));
  }
  revalidateActivityRoutes([album.departmentSlug]);
  redirect(`/admin/faaliyetler/${albumId}`);
}
