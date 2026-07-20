"use server";

import { and, eq, gte } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasValidSession } from "@/lib/auth";
import { getDb, schema } from "@/lib/db/client";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/registration-applications";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";

const ALLOWED_GRADES = ["8. Sınıf", "9. Sınıf", "10. Sınıf", "11. Sınıf"] as const;
const ALLOWED_DEPARTMENTS = [
  "Kararsızım",
  "Kimya Teknolojileri",
  "Elektrik-Elektronik Teknolojileri",
  "Biyomedikal Cihaz Teknolojileri",
] as const;
type SubmissionResult = { success: true } | { success: false; message: string };

function textField(formData: FormData, name: string, maxLength: number): string {
  return String(formData.get(name) ?? "").trim().slice(0, maxLength);
}

function formatTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

export async function createRegistrationApplicationAction(formData: FormData): Promise<SubmissionResult> {
  if (textField(formData, "website", 200)) return { success: true };

  const studentName = textField(formData, "studentName", 80);
  const parentName = textField(formData, "parentName", 80);
  const grade = textField(formData, "grade", 20);
  const phone = textField(formData, "phone", 20);
  const department = textField(formData, "department", 80);
  const sourceCandidate = textField(formData, "source", 120);
  const source = sourceCandidate.startsWith("/") && !sourceCandidate.startsWith("//") ? sourceCandidate : "/on-kayit";
  const privacyNoticeAcknowledged = formData.get("privacyNoticeAcknowledged") === "on";
  const submittedNoticeVersion = textField(formData, "privacyNoticeVersion", 20);
  const whatsappConsent = formData.get("whatsappConsent") === "on";

  if (studentName.length < 2 || parentName.length < 2) {
    return { success: false, message: "Öğrenci ve veli adını eksiksiz girin." };
  }
  if (!ALLOWED_GRADES.includes(grade as (typeof ALLOWED_GRADES)[number])) {
    return { success: false, message: "Geçerli bir sınıf seçin." };
  }
  if (!ALLOWED_DEPARTMENTS.includes(department as (typeof ALLOWED_DEPARTMENTS)[number])) {
    return { success: false, message: "Geçerli bir bölüm seçin." };
  }
  if (!/^[0-9+() -]{10,20}$/.test(phone)) {
    return { success: false, message: "Geçerli bir telefon numarası girin." };
  }
  if (!privacyNoticeAcknowledged || submittedNoticeVersion !== PRIVACY_NOTICE_VERSION) {
    return { success: false, message: "Başvurunun kaydedilmesi için KVKK aydınlatma metnini okuduğunuzu belirtmelisiniz." };
  }

  const db = await getDb();
  const duplicateThreshold = formatTimestamp(new Date(Date.now() - 5 * 60 * 1000));
  const duplicate = await db.select({ id: schema.registrationApplications.id })
    .from(schema.registrationApplications)
    .where(and(
      eq(schema.registrationApplications.studentName, studentName),
      eq(schema.registrationApplications.phone, phone),
      gte(schema.registrationApplications.createdAt, duplicateThreshold),
    ));

  if (duplicate.length === 0) {
    const now = formatTimestamp(new Date());
    await db.insert(schema.registrationApplications).values({
      studentName,
      parentName,
      grade,
      phone,
      department,
      source,
      status: "new",
      consentAccepted: true,
      privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      whatsappConsent,
      consentAcceptedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/basvurular");
  return { success: true };
}

export async function deleteRegistrationApplicationAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) throw new Error("Geçersiz başvuru bilgisi.");

  const db = await getDb();
  await db.delete(schema.registrationApplications)
    .where(eq(schema.registrationApplications.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/basvurular");
  redirect("/admin/basvurular?deleted=1");
}

export async function updateRegistrationApplicationAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const status = textField(formData, "status", 20) as ApplicationStatus;
  const notes = textField(formData, "notes", 2000);

  if (!Number.isInteger(id) || !APPLICATION_STATUSES.includes(status)) {
    throw new Error("Geçersiz başvuru bilgisi.");
  }

  const db = await getDb();
  await db.update(schema.registrationApplications).set({
    status,
    notes: notes || null,
    updatedAt: formatTimestamp(new Date()),
  }).where(eq(schema.registrationApplications.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/basvurular");
  revalidatePath(`/admin/basvurular/${id}`);
  redirect(`/admin/basvurular/${id}?saved=1`);
}
