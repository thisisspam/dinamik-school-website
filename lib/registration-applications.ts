export const APPLICATION_STATUSES = ["new", "contacted", "completed", "archived"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "Yeni",
  contacted: "İletişime geçildi",
  completed: "Tamamlandı",
  archived: "Arşivlendi",
};

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ApplicationStatus);
}
