import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createHomepageSectionAction } from "@/lib/actions/homepage-sections";
import { AdminPageHeader } from "../../../AdminPageHeader";
import { HomepageSectionForm } from "../../../HomepageSectionForm";

export default function AdminNewHomepageSectionPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Yeni ana sayfa alanı"
        title="Bileşen ekle"
        description="Hazır bir bileşen türü seçin, içeriğini girin ve kurumsal temalardan biriyle yayınlayın."
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/bilesenler"><ArrowLeft aria-hidden="true" size={16} /> Bileşenlere dön</Link>}
      />
      <div className="admin-card">
        <HomepageSectionForm action={createHomepageSectionAction} submitLabel="Bileşeni ekle" />
      </div>
    </>
  );
}
