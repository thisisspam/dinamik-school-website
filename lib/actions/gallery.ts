"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/lib/db/client";
import { saveUploadedFile } from "@/lib/media";

export async function uploadGalleryImageAction(formData: FormData): Promise<void> {
  const imageFile = formData.get("imageFile");
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    redirect("/admin/galeri");
  }

  const db = getDb();
  const src = await saveUploadedFile(imageFile);
  const existing = await db.select().from(schema.galleryImages);
  const nextOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;

  await db.insert(schema.galleryImages).values({
    src,
    alt: String(formData.get("alt") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim() || null,
    sortOrder: nextOrder,
  });

  revalidatePath("/", "layout");
  redirect("/admin/galeri?saved=1");
}

export async function deleteGalleryImageAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const db = getDb();
  await db.delete(schema.galleryImages).where(eq(schema.galleryImages.id, id));

  revalidatePath("/", "layout");
  redirect("/admin/galeri?saved=1");
}
