export type HomepageStructuredColumnType = "text" | "textarea" | "url" | "image" | "list";

export type HomepageStructuredColumn = {
  key: string;
  label: string;
  type: HomepageStructuredColumnType;
  placeholder?: string;
};

export type HomepageStructuredField = {
  singularLabel: string;
  addLabel: string;
  columns: HomepageStructuredColumn[];
};

export type HomepageStructuredRow = {
  id: string;
  values: Record<string, string>;
};

export const HOMEPAGE_STRUCTURED_FIELDS: Record<string, HomepageStructuredField> = {
  "benefits.items": {
    singularLabel: "Avantaj kartı",
    addLabel: "Avantaj ekle",
    columns: [
      { key: "title", label: "Büyük ifade", type: "text", placeholder: "Örn. 4 Yıl" },
      { key: "description", label: "Kısa açıklama", type: "text", placeholder: "Örn. Ücretsiz Eğitim" },
    ],
  },
  "gallery.images": {
    singularLabel: "Galeri görseli",
    addLabel: "Görsel ekle",
    columns: [
      { key: "image", label: "Görsel yolu", type: "image", placeholder: "/images/..." },
      { key: "imageAlt", label: "Görsel açıklaması", type: "text", placeholder: "Görselde ne olduğunu açıklayın" },
    ],
  },
  "programs.cards": {
    singularLabel: "Program kartı",
    addLabel: "Program ekle",
    columns: [
      { key: "branch", label: "Dal", type: "text" },
      { key: "title", label: "Program adı", type: "text" },
      { key: "description", label: "Açıklama", type: "textarea" },
      { key: "items", label: "Öne çıkan maddeler", type: "list", placeholder: "Her satıra bir madde yazın" },
    ],
  },
  "guidance.links": {
    singularLabel: "Yönlendirme kartı",
    addLabel: "Kart ekle",
    columns: [
      { key: "title", label: "Başlık", type: "text" },
      { key: "description", label: "Açıklama", type: "textarea" },
      { key: "href", label: "Bağlantı", type: "url", placeholder: "/sayfa veya https://..." },
    ],
  },
  "registration.benefits": {
    singularLabel: "Bilgilendirme maddesi",
    addLabel: "Madde ekle",
    columns: [
      { key: "text", label: "Madde", type: "text" },
    ],
  },
  "quick-links.links": {
    singularLabel: "Hızlı bağlantı",
    addLabel: "Bağlantı ekle",
    columns: [
      { key: "label", label: "Başlık", type: "text" },
      { key: "href", label: "Bağlantı", type: "url", placeholder: "/sayfa veya https://..." },
    ],
  },
};

export function getHomepageStructuredField(sectionKey: string, fieldKey: string): HomepageStructuredField | undefined {
  return HOMEPAGE_STRUCTURED_FIELDS[`${sectionKey}.${fieldKey}`];
}

function normalizedId(value: unknown, index: number): string {
  if (typeof value !== "string") return `structured-row-${index + 1}`;
  const id = value.trim().replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return id || `structured-row-${index + 1}`;
}

export function parseHomepageStructuredRows(
  value: string | undefined,
  definition: HomepageStructuredField,
): HomepageStructuredRow[] {
  if (!value?.trim()) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 30).map((row, index) => {
        const candidate = row && typeof row === "object"
          ? row as { id?: unknown; values?: unknown }
          : {};
        const candidateValues = candidate.values && typeof candidate.values === "object"
          ? candidate.values as Record<string, unknown>
          : {};
        return {
          id: normalizedId(candidate.id, index),
          values: Object.fromEntries(definition.columns.map((column) => {
            const columnValue = candidateValues[column.key];
            return [column.key, typeof columnValue === "string" ? columnValue.trim() : ""];
          })),
        };
      });
    }
  } catch {
    // Existing records use pipe-separated columns and one record per line.
  }

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((line, index) => {
      const columns = line.split("|").map((column) => column.trim());
      return {
        id: `structured-row-${index + 1}`,
        values: Object.fromEntries(definition.columns.map((column, columnIndex) => [
          column.key,
          column.type === "list"
            ? (columns[columnIndex] ?? "").split(";").map((item) => item.trim()).filter(Boolean).join("\n")
            : columns[columnIndex] ?? "",
        ])),
      };
    });
}

function serializedValue(value: string, type: HomepageStructuredColumnType): string {
  if (type === "list") {
    return value.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean).join("; ");
  }
  return value.replace(/\r?\n/g, " ").replace(/\|/g, " ").trim();
}

export function serializeHomepageStructuredRows(
  rows: HomepageStructuredRow[],
  definition: HomepageStructuredField,
): string {
  return rows
    .slice(0, 30)
    .map((row) => definition.columns.map((column) => serializedValue(row.values[column.key] ?? "", column.type)).join(" | "))
    .filter((line) => line.replace(/[|\s]/g, "").length > 0)
    .join("\n");
}
