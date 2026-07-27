export function parseContentRows(value: string | undefined, columnCount: number): string[][] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const columns = line.split("|").map((column) => column.trim());
      return Array.from({ length: columnCount }, (_, index) => columns[index] ?? "");
    });
}

export function parseContentList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function safeContentHref(value: string | undefined, fallback: string): string {
  const href = value?.trim();
  if (!href) return fallback;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : fallback;
  } catch {
    return fallback;
  }
}
