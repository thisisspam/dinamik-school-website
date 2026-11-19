import nodemailer from "nodemailer";
import { scholarshipSessionLabel, scholarshipTransportLabel } from "@/lib/scholarship-applications";

type ScholarshipNotification = {
  applicationId: number;
  studentName: string;
  guardianPhone: string;
  currentSchool: string;
  examSession: string;
  transportPreference: string;
  source: string;
  createdAt: string;
};

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} ortam değişkeni tanımlı değil.`);
  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatApplicationDate(value: string): string {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(normalized));
}

export async function sendScholarshipApplicationEmail(
  application: ScholarshipNotification,
  defaultRecipient: string,
): Promise<void> {
  const host = requiredEnvironmentValue("SMTP_HOST");
  const user = requiredEnvironmentValue("SMTP_USER");
  const password = requiredEnvironmentValue("SMTP_PASSWORD");
  const from = process.env.SMTP_FROM?.trim() || user;
  const recipient = process.env.SCHOLARSHIP_NOTIFICATION_EMAIL?.trim() || defaultRecipient;
  const port = Number(process.env.SMTP_PORT || "587");

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT geçerli bir port numarası değil.");
  }
  if (!recipient) throw new Error("Bursluluk başvurusu bildirim adresi tanımlı değil.");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const details = [
    ["Öğrenci", application.studentName],
    ["Veli cep telefonu", application.guardianPhone],
    ["Mevcut okul", application.currentSchool],
    ["Sınav oturumu", scholarshipSessionLabel(application.examSession)],
    ["Servis tercihi", scholarshipTransportLabel(application.transportPreference)],
    ["Başvuru kaynağı", application.source],
    ["Başvuru tarihi", formatApplicationDate(application.createdAt)],
  ] as const;

  const text = [
    `Yeni bursluluk sınavı başvurusu (#${application.applicationId})`,
    "",
    ...details.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  const rows = details
    .map(([label, value]) => `<tr><th style="padding:10px 12px;text-align:left;border-bottom:1px solid #e5e7eb;color:#211e44">${escapeHtml(label)}</th><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`)
    .join("");

  await transporter.sendMail({
    from,
    to: recipient,
    subject: `Yeni bursluluk sınavı başvurusu — ${application.studentName}`,
    text,
    html: `<div style="font-family:Arial,sans-serif;color:#171a2d"><h1 style="font-size:22px;color:#211e44">Yeni bursluluk sınavı başvurusu</h1><p>Web sitesi üzerinden yeni bir başvuru alındı.</p><table style="width:100%;max-width:680px;border-collapse:collapse;border:1px solid #e5e7eb"><tbody>${rows}</tbody></table><p style="margin-top:18px;color:#626477">Başvuru numarası: #${application.applicationId}</p></div>`,
  });
}
