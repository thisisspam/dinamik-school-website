"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/auth";
import { CONTENT_PAGE_DEFINITION_BY_KEY } from "@/lib/cms/page-definitions";
import {
  getContentPageStructuredField,
  parseContentPageStructuredRows,
  serializeContentPageStructuredRows,
} from "@/lib/cms/content-page-structured-fields";
import { CONTENT_PAGE_THEMES, type ContentPageTheme } from "@/lib/cms/types";
import { getDb, schema } from "@/lib/db/client";
import { saveUploadedFile } from "@/lib/media";

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

function safeUrl(value: string, fieldLabel: string): string {
  if (!value || value.startsWith("/") || value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:" || url.protocol === "tel:") {
      return value;
    }
  } catch {
    // The user-facing validation error below is intentionally shared.
  }
  throw new Error(`${fieldLabel} için geçerli bir site yolu veya http(s) bağlantısı girin.`);
}

export async function updateContentPageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const pageKey = String(formData.get("pageKey") ?? "").trim();
  const definition = CONTENT_PAGE_DEFINITION_BY_KEY.get(pageKey);
  if (!definition) throw new Error("Düzenlenecek içerik sayfası bulunamadı.");

  const db = await getDb();
  const existing = (await db.select().from(schema.contentPages).where(eq(schema.contentPages.pageKey, pageKey)))[0];
  const content: Record<string, string> = {};

  for (const item of definition.fields) {
    let value = String(formData.get(item.key) ?? "").trim();
    if (item.type === "structured-list") {
      const structuredDefinition = getContentPageStructuredField(pageKey, item.key);
      if (!structuredDefinition) throw new Error(`${pageKey}.${item.key} alan tanımı bulunamadı.`);
      const rows = parseContentPageStructuredRows(value, structuredDefinition).map((row) => ({
        ...row,
        values: Object.fromEntries(structuredDefinition.columns.map((column) => [
          column.key,
          column.type === "url"
            ? safeUrl(row.values[column.key] ?? "", `${item.label} / ${column.label}`)
            : row.values[column.key] ?? "",
        ])),
      }));
      value = serializeContentPageStructuredRows(
        rows,
        structuredDefinition,
      );
    }
    if (item.type === "image") {
      const uploadedFile = formData.get(`${item.key}File`);
      if (uploadedFile instanceof File && uploadedFile.size > 0) {
        value = await saveUploadedFile(uploadedFile);
      }
    }
    if (item.required && !value) throw new Error(`${item.label} alanı zorunludur.`);
    if (item.type === "url") value = safeUrl(value, item.label);
    content[item.key] = value;
  }

  const themeValue = String(formData.get("theme") ?? "original") as ContentPageTheme;
  const theme = CONTENT_PAGE_THEMES.includes(themeValue) ? themeValue : "original";
  const values = {
    displayName: definition.displayName,
    route: definition.route,
    category: definition.category,
    theme,
    content,
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    await db.update(schema.contentPages).set(values).where(eq(schema.contentPages.id, existing.id));
  } else {
    await db.insert(schema.contentPages).values({ pageKey, ...values });
  }

  revalidatePath("/", "layout");
  if (definition.route.startsWith("/")) revalidatePath(definition.route);
  redirect(`/admin/sayfalar/${pageKey}?saved=1`);
}
