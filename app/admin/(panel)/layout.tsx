import "../admin.css";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { AdminNav } from "../AdminNav";
import { count, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/client";

export const metadata = { title: "Dinamik Yönetim Paneli" };

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const [{ value: newApplicationCount }] = await getDb()
    .select({ value: count() })
    .from(schema.registrationApplications)
    .where(eq(schema.registrationApplications.status, "new"));

  return (
    <div className="admin-shell">
      <a className="admin-skip-link" href="#admin-main">Ana içeriğe geç</a>
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin" aria-label="Dinamik yönetim ana sayfası">
          <span className="admin-brand-mark">
            <Image src="/images/footer-logo-dinamik.png" alt="Dinamik Okulları" width={125} height={35} priority />
          </span>
          <span className="admin-brand-copy">
            <strong>Yönetim Paneli</strong>
            <small>Samsun kampüsü</small>
          </span>
        </Link>
        <AdminNav newApplicationCount={newApplicationCount} />
        <div className="admin-sidebar-footer">
          <div className="admin-session-info">
            <span className="admin-session-icon"><ShieldCheck aria-hidden="true" size={17} /></span>
            <span><strong>Admin</strong><small>Güvenli oturum</small></span>
          </div>
          <form className="admin-logout-form" action={logoutAction}>
            <button type="submit" aria-label="Oturumu kapat">
              <LogOut aria-hidden="true" size={18} />
              <span>Çıkış yap</span>
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-live-status"><span aria-hidden="true" /> İçerik yönetim merkezi</div>
          <Link href="/" target="_blank" rel="noreferrer" className="admin-site-link">
            Siteyi görüntüle <ExternalLink aria-hidden="true" size={15} />
          </Link>
        </header>
        <main id="admin-main" className="admin-content">{children}</main>
      </div>
    </div>
  );
}
