"use server";

import { and, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/auth";
import { getDb, schema } from "@/lib/db/client";
import { sendScholarshipApplicationEmail } from "@/lib/email/scholarship-notification";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";
import {
  SCHOLARSHIP_APPLICATION_STATUSES,
  SCHOLARSHIP_EXAM_SESSIONS,
  SCHOLARSHIP_TRANSPORT_OPTIONS,
  type ScholarshipApplicationStatus,
} from "@/lib/scholarship-applications";

type SubmissionResult =
  | { success: true; message: string }
  | { success: false; persisted?: boolean; message: string };

function textField(formData: FormData, name: string, maxLength: number): string {
  return String(formData.get(name) ?? "").trim().slice(0, maxLength);
}

function formatTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function safeSource(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/bursluluk-sinavi";
  return value.replace(/[^a-zA-Z0-9_?&=/.:-]/g, "").slice(0, 240);
}

function publicEmailError(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 500) : "Bilinmeyen e-posta hatası";
}

async function requireAdminSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/admin/login");
}

export async function createScholarshipApplicationAction(formData: FormData): Promise<SubmissionResult> {
  if (textField(formData, "website", 200)) {
    return { success: true, message: "Başvurunuz alınmıştır." };
  }

  const studentName = textField(formData, "studentName", 80);
  const guardianPhone = textField(formData, "guardianPhone", 20);
  const currentSchool = textField(formData, "currentSchool", 120);
  const examSession = textField(formData, "examSession", 32);
  const transportPreference = textField(formData, "transportPreference", 20);
  const source = safeSource(textField(formData, "source", 240));
  const privacyNoticeAcknowledged = formData.get("privacyNoticeAcknowledged") === "on";
  const submittedNoticeVersion = textField(formData, "privacyNoticeVersion", 20);

  if (studentName.length < 2) return { success: false, message: "Öğrencinin adını ve soyadını eksiksiz girin." };
  if (!/^[0-9+() -]{10,20}$/.test(guardianPhone)) return { success: false, message: "Geçerli bir veli cep telefonu girin." };
  if (currentSchool.length < 2) return { success: false, message: "Öğrencinin mevcut okulunu yazın." };
  if (!SCHOLARSHIP_EXAM_SESSIONS.some((session) => session.value === examSession)) {
    return { success: false, message: "Geçerli bir sınav oturumu seçin." };
  }
  if (!SCHOLARSHIP_TRANSPORT_OPTIONS.some((option) => option.value === transportPreference)) {
    return { success: false, message: "Servis tercihinizi seçin." };
  }
  if (!privacyNoticeAcknowledged || submittedNoticeVersion !== PRIVACY_NOTICE_VERSION) {
    return { success: false, message: "Başvurunun alınması için KVKK aydınlatma metnini okuduğunuzu belirtmelisiniz." };
  }

  const db = await getDb();
  const duplicateThreshold = formatTimestamp(new Date(Date.now() - 10 * 60 * 1000));
  const existing = (await db
    .select()
    .from(schema.scholarshipApplications)
    .where(and(
      eq(schema.scholarshipApplications.studentName, studentName),
      eq(schema.scholarshipApplications.guardianPhone, guardianPhone),
      eq(schema.scholarshipApplications.examSession, examSession),
      gte(schema.scholarshipApplications.createdAt, duplicateThreshold),
    )))[0];

  const now = formatTimestamp(new Date());
  const application = existing ?? (await db
    .insert(schema.scholarshipApplications)
    .values({
      studentName,
      guardianPhone,
      currentSchool,
      examSession,
      transportPreference,
      source,
      status: "new",
      emailDeliveryStatus: "pending",
      consentAccepted: true,
      privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      consentAcceptedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning())[0];

  if (application.emailDeliveryStatus !== "sent") {
    const settings = (await db.select().from(schema.siteSettings).limit(1))[0];
    try {
      await sendScholarshipApplicationEmail({
        applicationId: application.id,
        studentName: application.studentName,
        guardianPhone: application.guardianPhone,
        currentSchool: application.currentSchool,
        examSession: application.examSession,
        transportPreference: application.transportPreference,
        source: application.source,
        createdAt: application.createdAt,
      }, settings?.email ?? "");
      await db.update(schema.scholarshipApplications).set({
        emailDeliveryStatus: "sent",
        emailDeliveryError: null,
        emailDeliveredAt: now,
        updatedAt: now,
      }).where(eq(schema.scholarshipApplications.id, application.id));
    } catch (error) {
      const errorMessage = publicEmailError(error);
      console.error("Bursluluk başvurusu e-posta bildirimi gönderilemedi:", errorMessage);
      await db.update(schema.scholarshipApplications).set({
        emailDeliveryStatus: "failed",
        emailDeliveryError: errorMessage,
        updatedAt: now,
      }).where(eq(schema.scholarshipApplications.id, application.id));
      revalidatePath("/admin/bursluluk-basvurulari");
      return {
        success: false,
        persisted: true,
        message: "Başvurunuz kaydedildi; ancak e-posta bildirimi şu anda gönderilemedi. Okul ekibi başvurunuzu yönetim panelinde görebilir.",
      };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bursluluk-basvurulari");
  return { success: true, message: "Başvurunuz alındı. Seçtiğiniz oturum için okul ekibi gerektiğinde sizinle iletişime geçecektir." };
}

export async function updateScholarshipApplicationAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const status = textField(formData, "status", 20) as ScholarshipApplicationStatus;
  const notes = textField(formData, "notes", 2000);
  if (!Number.isInteger(id) || !SCHOLARSHIP_APPLICATION_STATUSES.includes(status)) {
    throw new Error("Geçersiz bursluluk başvurusu bilgisi.");
  }

  const db = await getDb();
  await db.update(schema.scholarshipApplications).set({
    status,
    notes: notes || null,
    updatedAt: formatTimestamp(new Date()),
  }).where(eq(schema.scholarshipApplications.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/bursluluk-basvurulari");
  revalidatePath(`/admin/bursluluk-basvurulari/${id}`);
  redirect(`/admin/bursluluk-basvurulari/${id}?saved=1`);
}

export async function deleteScholarshipApplicationAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) throw new Error("Geçersiz bursluluk başvurusu bilgisi.");

  const db = await getDb();
  await db.delete(schema.scholarshipApplications).where(eq(schema.scholarshipApplications.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/bursluluk-basvurulari");
  redirect("/admin/bursluluk-basvurulari?deleted=1");
}
