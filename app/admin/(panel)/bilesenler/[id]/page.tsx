import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDb, schema } from "@/lib/db/client";
import { updateHomepageSectionAction } from "@/lib/actions/homepage-sections";
import type { HomepageSection, HomepageSectionTheme } from "@/lib/content";
import { AdminPageHeader } from "../../../AdminPageHeader";
import { HomepageSectionForm } from "../../../HomepageSectionForm";

export default async function AdminEditHomepageSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const row = (await db.select().from(schema.homepageSections).where(eq(schema.homepageSections.id, Number(id))))[0];
  if (!row) notFound();

  const section: HomepageSection = {
    ...row,
    eyebrow: row.eyebrow ?? undefined,
    description: row.description ?? undefined,
    ctaLabel: row.ctaLabel ?? undefined,
    ctaHref: row.ctaHref ?? undefined,
    theme: row.theme as HomepageSectionTheme,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow={section.isDeletable ? "Özel bileşen" : "Kurumsal bileşen"}
        title={section.displayName}
        description="İçeriği, görünürlüğü ve tema seçimini güncelleyin."
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/bilesenler"><ArrowLeft aria-hidden="true" size={16} /> Bileşenlere dön</Link>}
      />
      <div className="admin-card">
        <HomepageSectionForm action={updateHomepageSectionAction} section={section} submitLabel="Değişiklikleri kaydet" />
      </div>
    </>
  );
}
