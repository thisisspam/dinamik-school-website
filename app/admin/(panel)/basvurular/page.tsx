import Link from "next/link";
import { and, desc, eq, like, or } from "drizzle-orm";
import { CheckCircle2, ClipboardList, Eye, Filter, Search, UserRoundCheck } from "lucide-react";
import { AdminPageHeader } from "../../AdminPageHeader";
import { getDb, schema } from "@/lib/db/client";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  isApplicationStatus,
} from "@/lib/registration-applications";

function formatDate(value: string): string {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(normalized));
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; deleted?: string }>;
}) {
  const { status: rawStatus = "", q: rawQuery = "", deleted } = await searchParams;
  const status = isApplicationStatus(rawStatus) ? rawStatus : "";
  const query = rawQuery.trim().slice(0, 80);
  const db = getDb();
  const conditions = [];

  if (status) conditions.push(eq(schema.registrationApplications.status, status));
  if (query) {
    const pattern = `%${query}%`;
    conditions.push(or(
      like(schema.registrationApplications.studentName, pattern),
      like(schema.registrationApplications.parentName, pattern),
      like(schema.registrationApplications.phone, pattern),
    )!);
  }

  const applications = conditions.length > 0
    ? await db.select().from(schema.registrationApplications).where(and(...conditions)).orderBy(desc(schema.registrationApplications.createdAt))
    : await db.select().from(schema.registrationApplications).orderBy(desc(schema.registrationApplications.createdAt));
  const allStatuses = await db.select({ status: schema.registrationApplications.status }).from(schema.registrationApplications);
  const summary = {
    total: allStatuses.length,
    new: allStatuses.filter((item) => item.status === "new").length,
    contacted: allStatuses.filter((item) => item.status === "contacted").length,
    completed: allStatuses.filter((item) => item.status === "completed").length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Kayıt yönetimi"
        title="Ön Kayıt Başvuruları"
        description="Web sitesinden gelen öğrenci ve veli başvurularını inceleyin, iletişim sürecini takip edin."
      />
      {deleted === "1" ? <div className="admin-flash"><CheckCircle2 aria-hidden="true" size={17} /> Başvuru ve ilişkili yönetici notları kalıcı olarak silindi.</div> : null}

      <section className="admin-application-summary" aria-label="Başvuru özeti">
        <article><ClipboardList aria-hidden="true" size={20} /><span><strong>{summary.total}</strong><small>Toplam başvuru</small></span></article>
        <article><UserRoundCheck aria-hidden="true" size={20} /><span><strong>{summary.new}</strong><small>Yeni başvuru</small></span></article>
        <article><span className="admin-summary-dot is-contacted" /><span><strong>{summary.contacted}</strong><small>İletişime geçildi</small></span></article>
        <article><span className="admin-summary-dot is-completed" /><span><strong>{summary.completed}</strong><small>Tamamlandı</small></span></article>
      </section>

      <div className="admin-card">
        <form className="admin-application-filters" method="get">
          <label>
            <span className="sr-only">Başvurularda ara</span>
            <Search aria-hidden="true" size={16} />
            <input name="q" defaultValue={query} placeholder="Öğrenci, veli veya telefon ara" />
          </label>
          <label>
            <span className="sr-only">Duruma göre filtrele</span>
            <Filter aria-hidden="true" size={16} />
            <select name="status" defaultValue={status}>
              <option value="">Tüm durumlar</option>
              {APPLICATION_STATUSES.map((item) => <option key={item} value={item}>{APPLICATION_STATUS_LABELS[item]}</option>)}
            </select>
          </label>
          <button className="admin-btn" type="submit">Filtrele</button>
          {status || query ? <Link className="admin-btn admin-btn-secondary" href="/admin/basvurular">Temizle</Link> : null}
        </form>

        {applications.length === 0 ? (
          <div className="admin-application-empty">
            <ClipboardList aria-hidden="true" size={27} />
            <strong>Başvuru bulunamadı</strong>
            <span>{status || query ? "Filtreleri değiştirerek tekrar deneyin." : "Yeni başvurular burada görüntülenecek."}</span>
          </div>
        ) : (
          <table className="admin-application-table">
            <thead><tr><th>Öğrenci / Veli</th><th>İletişim</th><th>İlgilenilen alan</th><th>Tarih</th><th>Durum</th><th /></tr></thead>
            <tbody>
              {applications.map((application) => {
                const applicationStatus = isApplicationStatus(application.status) ? application.status : "new";
                return (
                  <tr key={application.id}>
                    <td><strong>{application.studentName}</strong><small>{application.parentName} · {application.grade}</small></td>
                    <td><a href={`tel:${application.phone}`}>{application.phone}</a></td>
                    <td>{application.department}</td>
                    <td><time dateTime={application.createdAt}>{formatDate(application.createdAt)}</time></td>
                    <td><span className={`admin-application-status is-${applicationStatus}`}>{APPLICATION_STATUS_LABELS[applicationStatus]}</span></td>
                    <td><Link className="admin-table-action" href={`/admin/basvurular/${application.id}`}><Eye aria-hidden="true" size={15} /> İncele</Link></td>
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
