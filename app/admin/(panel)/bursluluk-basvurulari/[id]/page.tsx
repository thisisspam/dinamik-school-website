import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, Bus, CalendarClock, CheckCircle2, MailCheck, Phone, Save, School, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { AdminPageHeader } from "../../../AdminPageHeader";
import { ConfirmSubmitButton } from "../../../ConfirmSubmitButton";
import { deleteScholarshipApplicationAction, updateScholarshipApplicationAction } from "@/lib/actions/scholarship-applications";
import { getDb, schema } from "@/lib/db/client";
import {
  SCHOLARSHIP_APPLICATION_STATUSES,
  SCHOLARSHIP_APPLICATION_STATUS_LABELS,
  isScholarshipApplicationStatus,
  scholarshipSessionLabel,
  scholarshipTransportLabel,
} from "@/lib/scholarship-applications";

function formatDate(value: string): string {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(normalized));
}

export default async function AdminScholarshipApplicationDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const db = await getDb();
  const application = (await db.select().from(schema.scholarshipApplications).where(eq(schema.scholarshipApplications.id, Number(id))))[0];
  if (!application) notFound();
  const status = isScholarshipApplicationStatus(application.status) ? application.status : "new";

  return (
    <>
      <AdminPageHeader eyebrow="Bursluluk başvurusu" title={application.studentName} description={`${application.currentSchool} öğrencisi için gönderilen sınav başvurusu.`} actions={<Link className="admin-btn admin-btn-secondary" href="/admin/bursluluk-basvurulari"><ArrowLeft aria-hidden="true" size={16} /> Başvurulara dön</Link>} />
      {saved === "1" ? <div className="admin-flash"><CheckCircle2 aria-hidden="true" size={17} /> Başvuru durumu ve notlar kaydedildi.</div> : null}

      <div className="admin-application-detail-grid">
        <section className="admin-card admin-application-profile" aria-labelledby="scholarship-application-info-title">
          <div className="admin-detail-card-heading"><UserRound aria-hidden="true" size={20} /><div><span>Başvuru bilgileri</span><h2 id="scholarship-application-info-title">Öğrenci ve sınav</h2></div></div>
          <dl>
            <div><dt><UserRound size={16} />Öğrenci</dt><dd>{application.studentName}</dd></div>
            <div><dt><School size={16} />Mevcut okul</dt><dd>{application.currentSchool}</dd></div>
            <div><dt><Phone size={16} />Veli cep telefonu</dt><dd><a href={`tel:${application.guardianPhone}`}>{application.guardianPhone}</a></dd></div>
            <div><dt><CalendarClock size={16} />Oturum</dt><dd>{scholarshipSessionLabel(application.examSession)}</dd></div>
            <div><dt><Bus size={16} />Servis</dt><dd>{scholarshipTransportLabel(application.transportPreference)}</dd></div>
            <div><dt><CalendarClock size={16} />Başvuru tarihi</dt><dd>{formatDate(application.createdAt)}<small>{application.source}</small></dd></div>
            <div><dt><MailCheck size={16} />E-posta bildirimi</dt><dd>{application.emailDeliveryStatus === "sent" ? "Gönderildi" : "Gönderilemedi"}{application.emailDeliveredAt ? <small>{formatDate(application.emailDeliveredAt)}</small> : null}</dd></div>
          </dl>
          <div className="admin-application-contact-actions"><a className="admin-btn" href={`tel:${application.guardianPhone}`}><Phone aria-hidden="true" size={16} /> Telefon et</a></div>
        </section>

        <section className="admin-card" aria-labelledby="scholarship-management-title">
          <div className="admin-detail-card-heading"><Save aria-hidden="true" size={20} /><div><span>Başvuru takibi</span><h2 id="scholarship-management-title">Durum ve yönetici notu</h2></div></div>
          <form className="admin-form admin-application-management-form" action={updateScholarshipApplicationAction}>
            <input type="hidden" name="id" value={application.id} />
            <label>Başvuru durumu<select name="status" defaultValue={status}>{SCHOLARSHIP_APPLICATION_STATUSES.map((item) => <option value={item} key={item}>{SCHOLARSHIP_APPLICATION_STATUS_LABELS[item]}</option>)}</select></label>
            <label>Yönetici notu<span className="admin-hint">Görüşme sonucu, servis planlaması veya sınav süreciyle ilgili notlar.</span><textarea name="notes" defaultValue={application.notes ?? ""} maxLength={2000} placeholder="Bu not yalnızca yönetim panelinde görünür." /></label>
            <div className="admin-application-consent-note"><ShieldCheck aria-hidden="true" size={17} /><span><strong>KVKK aydınlatma kaydı mevcut</strong><small>Metin sürümü: {application.privacyNoticeVersion} · Bildirim zamanı: {formatDate(application.consentAcceptedAt)}</small>{application.emailDeliveryError ? <small>E-posta hatası: {application.emailDeliveryError}</small> : null}</span></div>
            <div className="admin-actions"><button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> Değişiklikleri kaydet</button></div>
          </form>
          <div className="admin-privacy-danger-zone">
            <div><strong>Başvuruyu kalıcı olarak sil</strong><small>İlgili kişi talebi veya saklama süresinin sona ermesi hâlinde kullanın. Bu işlem geri alınamaz.</small></div>
            <form action={deleteScholarshipApplicationAction}><input type="hidden" name="id" value={application.id} /><ConfirmSubmitButton className="admin-btn admin-btn-danger" confirmMessage={`${application.studentName} adlı öğrenciye ait bursluluk başvurusu kalıcı olarak silinsin mi?`}><Trash2 aria-hidden="true" size={15} /> Kalıcı sil</ConfirmSubmitButton></form>
          </div>
        </section>
      </div>
    </>
  );
}
