import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/client";
import { CONTENT_PAGE_DEFINITION_BY_KEY, defaultContentForDefinition } from "./page-definitions";
import { CONTENT_PAGE_THEMES, type ContentPageDocument, type ContentPageTheme } from "./types";
import { DEFAULT_SITE_THEME, type SiteTheme } from "./theme";

export async function getContentPages(): Promise<ContentPageDocument[]> {
  const db = await getDb();
  const rows = await db.select().from(schema.contentPages).orderBy(asc(schema.contentPages.id));
  return rows.map((row) => ({
    ...row,
    theme: CONTENT_PAGE_THEMES.includes(row.theme as ContentPageTheme)
      ? (row.theme as ContentPageTheme)
      : "original",
  }));
}

export async function getContentPage(pageKey: string): Promise<ContentPageDocument> {
  const definition = CONTENT_PAGE_DEFINITION_BY_KEY.get(pageKey);
  if (!definition) throw new Error(`Bilinmeyen içerik sayfası: ${pageKey}`);

  const db = await getDb();
  const row = (await db.select().from(schema.contentPages).where(eq(schema.contentPages.pageKey, pageKey)))[0];
  const defaults = defaultContentForDefinition(definition);

  if (!row) {
    return {
      id: 0,
      pageKey,
      displayName: definition.displayName,
      route: definition.route,
      category: definition.category,
      theme: "original",
      content: defaults,
      updatedAt: "",
    };
  }

  return {
    ...row,
    theme: CONTENT_PAGE_THEMES.includes(row.theme as ContentPageTheme)
      ? (row.theme as ContentPageTheme)
      : "original",
    content: { ...defaults, ...row.content },
  };
}

export async function getSiteTheme(): Promise<SiteTheme> {
  const db = await getDb();
  const row = (await db.select().from(schema.siteTheme))[0];
  if (row) return row;
  return { id: 0, ...DEFAULT_SITE_THEME };
}

export function contentPageThemeClass(theme: ContentPageTheme): string {
  return theme === "original" ? "" : ` cms-page-theme-${theme}`;
}
