export const SCHOLARSHIP_EXAM_SESSIONS = [
  { value: "2027-01-09-10", label: "1. Oturum — 9 Ocak 2027 Cumartesi, 10.00" },
  { value: "2027-01-09-14", label: "2. Oturum — 9 Ocak 2027 Cumartesi, 14.00" },
  { value: "2027-01-10-10", label: "3. Oturum — 10 Ocak 2027 Pazar, 10.00" },
  { value: "2027-01-10-14", label: "4. Oturum — 10 Ocak 2027 Pazar, 14.00" },
] as const;

export const SCHOLARSHIP_TRANSPORT_OPTIONS = [
  { value: "use", label: "Servis kullanacağım" },
  { value: "not-use", label: "Servis kullanmayacağım" },
] as const;

export const SCHOLARSHIP_APPLICATION_STATUSES = ["new", "contacted", "completed", "archived"] as const;

export type ScholarshipApplicationStatus = (typeof SCHOLARSHIP_APPLICATION_STATUSES)[number];

export const SCHOLARSHIP_APPLICATION_STATUS_LABELS: Record<ScholarshipApplicationStatus, string> = {
  new: "Yeni",
  contacted: "İletişime geçildi",
  completed: "Tamamlandı",
  archived: "Arşivlendi",
};

export function scholarshipSessionLabel(value: string): string {
  return SCHOLARSHIP_EXAM_SESSIONS.find((session) => session.value === value)?.label ?? value;
}

export function scholarshipTransportLabel(value: string): string {
  return SCHOLARSHIP_TRANSPORT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function isScholarshipApplicationStatus(value: string): value is ScholarshipApplicationStatus {
  return SCHOLARSHIP_APPLICATION_STATUSES.includes(value as ScholarshipApplicationStatus);
}
