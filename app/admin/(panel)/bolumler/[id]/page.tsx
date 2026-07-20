import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { updateDepartmentAction } from "@/lib/actions/departments";
import { AdminPageHeader } from "../../../AdminPageHeader";
import { DepartmentForm, type DepartmentFormValue } from "../../../DepartmentForm";

export default async function AdminDepartmentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const row = (await db.select().from(schema.departments).where(eq(schema.departments.id, Number(id))))[0];
  if (!row) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow={row.isDeletable ? "Özel bölüm" : "Kurumsal bölüm"}
        title={row.title}
        description="Bölüm içeriğini, görünürlüğünü ve ziyaretçi tarafında kullanılan renk temasını düzenleyin."
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/bolumler"><ArrowLeft aria-hidden="true" size={16} /> Bölümlere dön</Link>}
      />
      <div className="admin-card">
        <DepartmentForm action={updateDepartmentAction} department={row as DepartmentFormValue} submitLabel="Değişiklikleri kaydet" />
      </div>
    </>
  );
}
