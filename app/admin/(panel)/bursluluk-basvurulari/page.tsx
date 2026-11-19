import Link from "next/link";
import { and, desc, eq, like, or } from "drizzle-orm";
import { Award, CheckCircle2, Eye, Filter, Search } from "lucide-react";
import { AdminPageHeader } from "../../AdminPageHeader";
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
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(normalized));
}

export default async function AdminScholarshipApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; deleted?: string }>;
}) {
  const { status: rawStatus = "", q: rawQuery = "", deleted } = await searchParams;
  const status = isScholarshipApplicationStatus(rawStatus) ? rawStatus : "";
  const query = rawQuery.trim().slice(0, 80);
  const db = await getDb();
  const conditions = [];
  if (status) conditions.push(eq(schema.scholarshipApplications.status, status));
  if (query) {
    const pattern = `%${query}%`;
    conditions.push(or(
      like(schema.scholarshipApplications.studentName, pattern),
      like(schema.scholarshipApplications.guardianPhone, pattern),
      like(schema.scholarshipApplications.currentSchool, pattern),
    )!);
  }

  const applications = conditions.length > 0
    ? await db.select().from(schema.scholarshipApplications).where(and(...conditions)).orderBy(desc(schema.scholarshipApplications.createdAt))
    : await db.select().from(schema.scholarshipApplications).orderBy(desc(schema.scholarshipApplications.createdAt));

  return (
    <>
      <AdminPageHeader eyebrow="Sınav yönetimi" title="Bursluluk Sınavı Başvuruları" description="Web sitesinden gelen başvuruları, oturumları, servis tercihlerini ve e-posta bildirim durumunu takip edin." />
      {deleted === "1" ? <div className="admin-flash"><CheckCircle2 aria-hidden="true" size={17} /> Başvuru kalıcı olarak silindi.</div> : null}

      <div className="admin-card">
        <form className="admin-application-filters" method="get">
          <label><span className="sr-only">Bursluluk başvurularında ara</span><Search aria-hidden="true" size={16} /><input name="q" defaultValue={query} placeholder="Öğrenci, telefon veya okul ara" /></label>
          <label><span className="sr-only">Duruma göre filtrele</span><Filter aria-hidden="true" size={16} /><select name="status" defaultValue={status}><option value="">Tüm durumlar</option>{SCHOLARSHIP_APPLICATION_STATUSES.map((item) => <option value={item} key={item}>{SCHOLARSHIP_APPLICATION_STATUS_LABELS[item]}</option>)}</select></label>
          <button className="admin-btn" type="submit">Filtrele</button>
          {status || query ? <Link className="admin-btn admin-btn-secondary" href="/admin/bursluluk-basvurulari">Temizle</Link> : null}
        </form>

        {applications.length === 0 ? (
          <div className="admin-application-empty"><Award aria-hidden="true" size={27} /><strong>Başvuru bulunamadı</strong><span>{status || query ? "Filtreleri değiştirerek tekrar deneyin." : "Yeni bursluluk başvuruları burada görüntülenecek."}</span></div>
        ) : (
          <table className="admin-application-table">
            <thead><tr><th>Öğrenci / Okul</th><th>İletişim</th><th>Oturum</th><th>Servis</th><th>E-posta</th><th>Durum</th><th /></tr></thead>
            <tbody>
              {applications.map((application) => {
                const applicationStatus = isScholarshipApplicationStatus(application.status) ? application.status : "new";
                return (
                  <tr key={application.id}>
                    <td><strong>{application.studentName}</strong><small>{application.currentSchool} · {formatDate(application.createdAt)}</small></td>
                    <td><a href={`tel:${application.guardianPhone}`}>{application.guardianPhone}</a></td>
                    <td>{scholarshipSessionLabel(application.examSession)}</td>
                    <td>{scholarshipTransportLabel(application.transportPreference)}</td>
                    <td><span className={`admin-application-status is-${application.emailDeliveryStatus === "sent" ? "completed" : "contacted"}`}>{application.emailDeliveryStatus === "sent" ? "Gönderildi" : "Bekliyor"}</span></td>
                    <td><span className={`admin-application-status is-${applicationStatus}`}>{SCHOLARSHIP_APPLICATION_STATUS_LABELS[applicationStatus]}</span></td>
                    <td><Link className="admin-table-action" href={`/admin/bursluluk-basvurulari/${application.id}`}><Eye aria-hidden="true" size={15} /> İncele</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
