"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/lib/db/client";
import { saveUploadedFile } from "@/lib/media";

async function resolveStaffImage(formData: FormData): Promise<string | null> {
  const existingImage = String(formData.get("existingImage") ?? "").trim() || null;
  if (formData.get("removeImage") === "on") return null;

  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    return saveUploadedFile(imageFile);
  }

  return existingImage;
}

export async function createStaffAction(formData: FormData): Promise<void> {
  const db = await getDb();
  const existing = await db.select().from(schema.staff);
  const nextOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;

  await db.insert(schema.staff).values({
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    additionalRole: String(formData.get("additionalRole") ?? "").trim() || null,
    image: await resolveStaffImage(formData),
    sortOrder: nextOrder,
  });

  revalidatePath("/", "layout");
  redirect("/admin/kadromuz?saved=1");
}

export async function updateStaffAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const db = await getDb();

  await db
    .update(schema.staff)
    .set({
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      role: String(formData.get("role") ?? "").trim(),
      additionalRole: String(formData.get("additionalRole") ?? "").trim() || null,
      image: await resolveStaffImage(formData),
    })
    .where(eq(schema.staff.id, id));

  revalidatePath("/", "layout");
  redirect("/admin/kadromuz?saved=1");
}

export async function deleteStaffAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const db = await getDb();
  await db.delete(schema.staff).where(eq(schema.staff.id, id));

  revalidatePath("/", "layout");
  redirect("/admin/kadromuz?saved=1");
}
