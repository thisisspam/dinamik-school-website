"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/auth";
import { getDb, schema } from "@/lib/db/client";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

function color(formData: FormData, name: string, label: string): string {
  const value = String(formData.get(name) ?? "").trim();
  if (!HEX_COLOR.test(value)) throw new Error(`${label} geçerli bir HEX renk olmalıdır.`);
  return value.toLowerCase();
}

function boundedNumber(formData: FormData, name: string, min: number, max: number): number {
  const value = Number(formData.get(name));
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} değeri ${min}-${max} aralığında olmalıdır.`);
  }
  return value;
}

export async function updateSiteThemeAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const db = await getDb();
  const existing = (await db.select().from(schema.siteTheme))[0];
  const values = {
    brandNavy: color(formData, "brandNavy", "Kurumsal lacivert"),
    brandNavyDeep: color(formData, "brandNavyDeep", "Koyu lacivert"),
    brandRed: color(formData, "brandRed", "Kurumsal kırmızı"),
    brandRedDark: color(formData, "brandRedDark", "Koyu kırmızı"),
    surface: color(formData, "surface", "Sayfa zemini"),
    surfaceSoft: color(formData, "surfaceSoft", "Yumuşak zemin"),
    ink: color(formData, "ink", "Ana metin"),
    muted: color(formData, "muted", "İkincil metin"),
    border: color(formData, "border", "Çizgi"),
    headerBackground: color(formData, "headerBackground", "Header zemini"),
    footerBackground: color(formData, "footerBackground", "Footer zemini"),
    containerWidth: boundedNumber(formData, "containerWidth", 960, 1600),
    buttonRadius: boundedNumber(formData, "buttonRadius", 0, 999),
    cardRadius: boundedNumber(formData, "cardRadius", 0, 48),
    shadowIntensity: boundedNumber(formData, "shadowIntensity", 0, 150),
  };

  if (existing) {
    await db.update(schema.siteTheme).set(values).where(eq(schema.siteTheme.id, existing.id));
  } else {
    await db.insert(schema.siteTheme).values(values);
  }

  revalidatePath("/", "layout");
  redirect("/admin/tema?saved=1");
}
