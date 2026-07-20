"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/lib/db/client";

export async function updateSettingsAction(formData: FormData): Promise<void> {
  const db = await getDb();
  const existing = (await db.select().from(schema.siteSettings))[0];

  const values = {
    generalPhone: String(formData.get("generalPhone") ?? "").trim(),
    landlinePhone: String(formData.get("landlinePhone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    addressLine: String(formData.get("addressLine") ?? "").trim(),
    mapUrl: String(formData.get("mapUrl") ?? "").trim(),
    hours: String(formData.get("hours") ?? "").trim(),
    instagramUrl: String(formData.get("instagramUrl") ?? "").trim(),
    youtubeUrl: String(formData.get("youtubeUrl") ?? "").trim(),
  };

  if (existing) {
    await db.update(schema.siteSettings).set(values).where(eq(schema.siteSettings.id, existing.id));
  } else {
    await db.insert(schema.siteSettings).values(values);
  }

  revalidatePath("/", "layout");
  redirect("/admin/ayarlar?saved=1");
}
