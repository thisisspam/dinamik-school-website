import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, CheckCircle2, ExternalLink, GraduationCap, MessageCircle, Phone, Save, ShieldCheck, Trash2, UserRound, UsersRound } from "lucide-react";
import { AdminPageHeader } from "../../../AdminPageHeader";
import { ConfirmSubmitButton } from "../../../ConfirmSubmitButton";
import { getDb, schema } from "@/lib/db/client";
import { deleteRegistrationApplicationAction, updateRegistrationApplicationAction } from "@/lib/actions/registration-applications";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, isApplicationStatus } from "@/lib/registration-applications";

function formatDate(value: string): string {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(normalized));
}

function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `90${digits.slice(1)}` : digits;
  return `https://wa.me/${international}`;
}

export default async function AdminApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const application = (await getDb().select().from(schema.registrationApplications)
    .where(eq(schema.registrationApplications.id, Number(id))))[0];
  if (!application) notFound();

  const status = isApplicationStatus(application.status) ? application.status : "new";
  const sourceLabel = application.source === "/" ? "Ana sayfa formu" : "Ön kayıt sayfası";

  return (
    <>
      <AdminPageHeader
        eyebrow="Başvuru ayrıntısı"
        title={application.studentName}
        description={`${application.parentName} tarafından gönderilen ön kayıt başvurusu.`}
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/basvurular"><ArrowLeft aria-hidden="true" size={16} /> Başvurulara dön</Link>}
      />
      {saved === "1" ? <div className="admin-flash"><CheckCircle2 aria-hidden="true" size={17} /> Başvuru durumu ve notlar kaydedildi.</div> : null}

      <div className="admin-application-detail-grid">
        <section className="admin-card admin-application-profile" aria-labelledby="application-info-title">
          <div className="admin-detail-card-heading"><UserRound aria-hidden="true" size={20} /><div><span>Başvuru bilgileri</span><h2 id="application-info-title">Öğrenci ve veli</h2></div></div>
          <dl>
            <div><dt><GraduationCap size={16} />Öğrenci</dt><dd>{application.studentName}<small>{application.grade}</small></dd></div>
            <div><dt><UsersRound size={16} />Veli</dt><dd>{application.parentName}</dd></div>
            <div><dt><Phone size={16} />Telefon</dt><dd><a href={`tel:${application.phone}`}>{application.phone}</a></dd></div>
            <div><dt><GraduationCap size={16} />İlgilenilen alan</dt><dd>{application.department}</dd></div>
            <div><dt><CalendarClock size={16} />Başvuru tarihi</dt><dd>{formatDate(application.createdAt)}<small>{sourceLabel}</small></dd></div>
          </dl>
          <div className="admin-application-contact-actions">
            <a className="admin-btn" href={whatsappHref(application.phone)} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={16} /> WhatsApp’tan yaz <ExternalLink aria-hidden="true" size={13} /></a>
            <a className="admin-btn admin-btn-secondary" href={`tel:${application.phone}`}><Phone aria-hidden="true" size={16} /> Telefon et</a>
          </div>
        </section>

        <section className="admin-card" aria-labelledby="application-management-title">
          <div className="admin-detail-card-heading"><Save aria-hidden="true" size={20} /><div><span>Başvuru takibi</span><h2 id="application-management-title">Durum ve yönetici notu</h2></div></div>
          <form className="admin-form admin-application-management-form" action={updateRegistrationApplicationAction}>
            <input type="hidden" name="id" value={application.id} />
            <label>
              Başvuru durumu
              <select name="status" defaultValue={status}>
                {APPLICATION_STATUSES.map((item) => <option key={item} value={item}>{APPLICATION_STATUS_LABELS[item]}</option>)}
              </select>
            </label>
            <label>
              Yönetici notu
              <span className="admin-hint">Görüşme sonucu, geri dönüş zamanı veya kayıt süreciyle ilgili notlar.</span>
              <textarea name="notes" defaultValue={application.notes ?? ""} maxLength={2000} placeholder="Bu not yalnızca yönetim panelinde görünür." />
            </label>
            <div className="admin-application-consent-note"><ShieldCheck aria-hidden="true" size={17} /><span><strong>KVKK aydınlatma kaydı mevcut</strong><small>Metin sürümü: {application.privacyNoticeVersion} · Bildirim zamanı: {formatDate(application.consentAcceptedAt)}</small><small>WhatsApp hazır mesaj tercihi: {application.whatsappConsent ? "Onaylandı" : "Onaylanmadı"}</small></span></div>
            <div className="admin-actions"><button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> Değişiklikleri kaydet</button></div>
          </form>
          <div className="admin-privacy-danger-zone">
            <div><strong>Başvuruyu kalıcı olarak sil</strong><small>İlgili kişi talebi veya saklama süresinin sona ermesi hâlinde kullanın. Bu işlem geri alınamaz.</small></div>
            <form action={deleteRegistrationApplicationAction}>
              <input type="hidden" name="id" value={application.id} />
              <ConfirmSubmitButton className="admin-btn admin-btn-danger" confirmMessage={`${application.studentName} adlı öğrenciye ait başvuru ve yönetici notları kalıcı olarak silinsin mi?`}>
                <Trash2 aria-hidden="true" size={15} /> Kalıcı sil
              </ConfirmSubmitButton>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
