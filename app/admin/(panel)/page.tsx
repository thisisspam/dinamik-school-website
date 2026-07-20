import Link from "next/link";
import { ArrowRight, ClipboardList, ContactRound, Images, LayoutTemplate, Settings2, Shapes } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { AdminPageHeader } from "../AdminPageHeader";

const QUICK_LINKS = [
  {
    href: "/admin/bilesenler",
    title: "Sayfa Bileşenleri",
    description: "Ana sayfa alanlarını ekleyin, gizleyin, düzenleyin ve temalarını değiştirin.",
    icon: LayoutTemplate,
    tone: "indigo",
  },
  {
    href: "/admin/bolumler",
    title: "Bölümler",
    description: "Mesleki alanların tanıtım metinlerini ve görsellerini düzenleyin.",
    icon: Shapes,
    tone: "indigo",
  },
  {
    href: "/admin/basvurular",
    title: "Ön Kayıt Başvuruları",
    description: "Yeni öğrenci ve veli başvurularını inceleyin, iletişim durumunu takip edin.",
    icon: ClipboardList,
    tone: "red",
  },
  {
    href: "/admin/kadromuz",
    title: "Kadromuz",
    description: "Öğretmen ekleyin, bilgileri güncelleyin veya kayıt kaldırın.",
    icon: ContactRound,
    tone: "red",
  },
  {
    href: "/admin/galeri",
    title: "Galeri",
    description: "Kampüs ve etkinlik fotoğraflarını tek noktadan yönetin.",
    icon: Images,
    tone: "cyan",
  },
  {
    href: "/admin/ayarlar",
    title: "Site Ayarları",
    description: "İletişim, adres ve sosyal medya bilgilerini güncel tutun.",
    icon: Settings2,
    tone: "amber",
  },
] as const;

export default async function AdminHomePage() {
  const db = getDb();
  const [departments, staff, gallery, homepageSections, applications] = await Promise.all([
    db.select({ id: schema.departments.id }).from(schema.departments),
    db.select({ id: schema.staff.id }).from(schema.staff),
    db.select({ id: schema.galleryImages.id }).from(schema.galleryImages),
    db.select({ id: schema.homepageSections.id }).from(schema.homepageSections),
    db.select({ id: schema.registrationApplications.id, status: schema.registrationApplications.status }).from(schema.registrationApplications),
  ]);

  const stats = [
    { label: "Aktif bölüm", value: departments.length, icon: Shapes, tone: "indigo" },
    { label: "Kadro kaydı", value: staff.length, icon: ContactRound, tone: "red" },
    { label: "Galeri görseli", value: gallery.length, icon: Images, tone: "cyan" },
    { label: "Sayfa bileşeni", value: homepageSections.length, icon: LayoutTemplate, tone: "amber" },
    { label: "Yeni başvuru", value: applications.filter((item) => item.status === "new").length, icon: ClipboardList, tone: "red" },
  ] as const;

  return (
    <>
      <AdminPageHeader
        eyebrow="Genel bakış"
        title="Yönetim Paneli"
        description="Sitedeki içeriği buradan yönetin. Kaydettiğiniz değişiklikler canlı siteye anında yansır."
      />

      <section className="admin-stats-grid" aria-label="İçerik özeti">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className={`admin-stat-card admin-tone-${stat.tone}`} key={stat.label}>
              <span className="admin-stat-icon"><Icon aria-hidden="true" size={21} /></span>
              <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
            </article>
          );
        })}
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <span className="admin-eyebrow">Hızlı işlemler</span>
            <h2>İçerik alanları</h2>
          </div>
          <span className="admin-section-note">Güncellemek istediğiniz alanı seçin</span>
        </div>
        <div className="admin-quick-grid">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link className={`admin-quick-card admin-tone-${item.tone}`} href={item.href} key={item.href}>
                <span className="admin-quick-icon"><Icon aria-hidden="true" size={23} /></span>
                <div className="admin-quick-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="admin-quick-arrow" aria-hidden="true"><ArrowRight size={19} /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
