import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createDepartmentAction } from "@/lib/actions/departments";
import { AdminPageHeader } from "../../../AdminPageHeader";
import { DepartmentForm } from "../../../DepartmentForm";

export default function AdminNewDepartmentPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Yeni aktif program"
        title="Bölüm ekle"
        description="Yeni bölümün ziyaretçi sayfalarında kullanılacak içeriğini, görselini ve temasını tanımlayın."
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/bolumler"><ArrowLeft aria-hidden="true" size={16} /> Bölümlere dön</Link>}
      />
      <div className="admin-card">
        <DepartmentForm action={createDepartmentAction} submitLabel="Bölümü ekle" />
      </div>
    </>
  );
}
