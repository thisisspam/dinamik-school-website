export type ContentPageStructuredColumn = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "select";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
};

export type ContentPageStructuredField = {
  singularLabel: string;
  addLabel: string;
  columns: ContentPageStructuredColumn[];
  hierarchyColumnKey?: string;
};

export type ContentPageStructuredRow = {
  id: string;
  values: Record<string, string>;
};

const LINK_COLUMNS: ContentPageStructuredColumn[] = [
  { key: "label", label: "Başlık", type: "text" },
  { key: "href", label: "Bağlantı", type: "url", placeholder: "/sayfa veya https://..." },
];

const TITLE_DESCRIPTION_COLUMNS: ContentPageStructuredColumn[] = [
  { key: "title", label: "Başlık", type: "text" },
  { key: "description", label: "Açıklama", type: "textarea" },
];

function titleDescriptionField(singularLabel: string, addLabel: string): ContentPageStructuredField {
  return { singularLabel, addLabel, columns: TITLE_DESCRIPTION_COLUMNS };
}

export const CONTENT_PAGE_STRUCTURED_FIELDS: Record<string, ContentPageStructuredField> = {
  "site-chrome.navigation": {
    singularLabel: "Menü bağlantısı",
    addLabel: "Bağlantı ekle",
    hierarchyColumnKey: "level",
    columns: [
      ...LINK_COLUMNS,
      {
        key: "level",
        label: "Menü seviyesi",
        type: "select",
        options: [
          { value: "main", label: "Ana menü" },
          { value: "child", label: "Alt menü" },
        ],
      },
    ],
  },
  "site-chrome.footerFirstLinks": {
    singularLabel: "Footer bağlantısı",
    addLabel: "Bağlantı ekle",
    columns: LINK_COLUMNS,
  },
  "site-chrome.footerSecondLinks": {
    singularLabel: "Footer bağlantısı",
    addLabel: "Bağlantı ekle",
    columns: LINK_COLUMNS,
  },
  "about.modelCards": {
    singularLabel: "Eğitim modeli kartı",
    addLabel: "Kart ekle",
    columns: [
      { key: "eyebrow", label: "Etiket", type: "text" },
      { key: "title", label: "Başlık", type: "text" },
      { key: "description", label: "Açıklama", type: "textarea" },
    ],
  },
  "school.hubCards": {
    singularLabel: "Yönlendirme kartı",
    addLabel: "Kart ekle",
    columns: [
      { key: "title", label: "Başlık", type: "text" },
      { key: "description", label: "Açıklama", type: "textarea" },
      { key: "href", label: "Bağlantı", type: "url", placeholder: "/sayfa veya https://..." },
    ],
  },
  "school.supportingVideos": {
    singularLabel: "Video kartı",
    addLabel: "Video ekle",
    columns: [
      { key: "category", label: "Kategori", type: "text" },
      { key: "title", label: "Başlık", type: "text" },
      { key: "description", label: "Açıklama", type: "textarea" },
      { key: "src", label: "Video yolu", type: "url", placeholder: "/uploads/videos/..." },
      { key: "duration", label: "Süre", type: "text", placeholder: "Örn. 1:26" },
    ],
  },
  "departments.modelCards": titleDescriptionField("Eğitim modeli kartı", "Kart ekle"),
  "guidance.topics": titleDescriptionField("Destek kartı", "Kart ekle"),
  "uniforms.features": titleDescriptionField("Özellik kartı", "Kart ekle"),
  "staff.features": titleDescriptionField("Yaklaşım kartı", "Kart ekle"),
  "achievements.areas": titleDescriptionField("Başarı alanı", "Alan ekle"),
  "activities.areas": titleDescriptionField("Faaliyet kartı", "Kart ekle"),
};

export function getContentPageStructuredField(
  pageKey: string,
  fieldKey: string,
): ContentPageStructuredField | undefined {
  return CONTENT_PAGE_STRUCTURED_FIELDS[`${pageKey}.${fieldKey}`];
}

function normalizedId(value: unknown, index: number): string {
  if (typeof value !== "string") return `page-structured-row-${index + 1}`;
  const id = value.trim().replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return id || `page-structured-row-${index + 1}`;
}

export function parseContentPageStructuredRows(
  value: string | undefined,
  definition: ContentPageStructuredField,
): ContentPageStructuredRow[] {
  if (!value?.trim()) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 60).map((row, index) => {
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
    .slice(0, 60)
    .map((line, index) => {
      const isChild = definition.hierarchyColumnKey ? /^-\s*/.test(line) : false;
      const normalizedLine = isChild ? line.replace(/^-\s*/, "") : line;
      const values = Object.fromEntries(definition.columns.map((column, columnIndex) => [
        column.key,
        column.key === definition.hierarchyColumnKey
          ? (isChild ? "child" : "main")
          : (normalizedLine.split("|")[columnIndex] ?? "").trim(),
      ]));
      return { id: `page-structured-row-${index + 1}`, values };
    });
}

function serializedValue(value: string): string {
  return value.replace(/\r?\n/g, " ").replace(/\|/g, " ").trim();
}

export function serializeContentPageStructuredRows(
  rows: ContentPageStructuredRow[],
  definition: ContentPageStructuredField,
): string {
  return rows
    .slice(0, 60)
    .map((row) => {
      const columns = definition.columns
        .filter((column) => column.key !== definition.hierarchyColumnKey)
        .map((column) => serializedValue(row.values[column.key] ?? ""));
      const prefix = definition.hierarchyColumnKey && row.values[definition.hierarchyColumnKey] === "child" ? "- " : "";
      return `${prefix}${columns.join(" | ")}`;
    })
    .filter((line) => line.replace(/[-|\s]/g, "").length > 0)
    .join("\n");
}
