export const CONTENT_PAGE_THEMES = ["original", "light", "navy", "red"] as const;

export type ContentPageTheme = (typeof CONTENT_PAGE_THEMES)[number];

export type ContentFieldType = "text" | "textarea" | "url" | "image" | "lines" | "feature-cards" | "hero-tiles" | "structured-list";

export type ContentFieldDefinition = {
  key: string;
  label: string;
  group: string;
  type: ContentFieldType;
  defaultValue: string;
  help?: string;
  required?: boolean;
};

export type ContentPageDefinition = {
  key: string;
  displayName: string;
  route: string;
  category: "Genel" | "Kurumsal" | "Öğrenci" | "Medya" | "Yasal";
  description: string;
  fields: ContentFieldDefinition[];
};

export type ContentPageDocument = {
  id: number;
  pageKey: string;
  displayName: string;
  route: string;
  category: string;
  theme: ContentPageTheme;
  content: Record<string, string>;
  updatedAt: string;
};
