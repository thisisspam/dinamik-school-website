export const REFERENCE_ACTIVE_DEPARTMENT_SLUGS = [
  "kimya-teknolojileri",
  "elektrik-elektronik-teknolojileri",
  "biyomedikal-cihaz-teknolojileri",
] as const;

export type ReferenceActiveDepartmentSlug = (typeof REFERENCE_ACTIVE_DEPARTMENT_SLUGS)[number];

export function isReferenceActiveDepartmentSlug(value: string): value is ReferenceActiveDepartmentSlug {
  return REFERENCE_ACTIVE_DEPARTMENT_SLUGS.includes(value as ReferenceActiveDepartmentSlug);
}
