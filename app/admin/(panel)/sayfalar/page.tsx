import Link from "next/link";
import { ArrowRight, FileText, Palette } from "lucide-react";
import { getContentPages } from "@/lib/cms/content";
import { CONTENT_PAGE_DEFINITION_BY_KEY } from "@/lib/cms/page-definitions";
import { AdminPageHeader } from "../../AdminPageHeader";

export default async function AdminContentPagesPage() {
  const pages = await getContentPages();
  const categories = ["Genel", "Kurumsal", "Öğrenci", "Medya", "Yasal"];

  return (
    <>
      <AdminPageHeader
        eyebrow="Merkezi içerik yönetimi"
        title="Site Sayfaları"
        description="Header ve footer’dan kurumsal sayfalara, öğrenci içeriklerinden galeri tanıtımlarına kadar sitedeki sabit metinleri ve görselleri yönetin."
        actions={<Link className="admin-btn" href="/admin/tema"><Palette aria-hidden="true" size={16} /> Genel temayı düzenle</Link>}
      />

      {categories.map((category) => {
        const categoryPages = pages.filter((page) => page.category === category);
        if (categoryPages.length === 0) return null;
        return (
          <section className="admin-section" key={category}>
            <div className="admin-section-header">
              <div><span className="admin-eyebrow">İçerik grubu</span><h2>{category}</h2></div>
              <span className="admin-section-note">{categoryPages.length} düzenlenebilir alan</span>
            </div>
            <div className="admin-page-list">
              {categoryPages.map((page) => {
                const definition = CONTENT_PAGE_DEFINITION_BY_KEY.get(page.pageKey);
                return (
                  <Link className="admin-page-list-card" href={`/admin/sayfalar/${page.pageKey}`} key={page.pageKey}>
                    <span className="admin-quick-icon"><FileText aria-hidden="true" size={22} /></span>
                    <span>
                      <strong>{page.displayName}</strong>
                      <small>{definition?.description ?? page.route}</small>
                      <em>{page.route}</em>
                    </span>
                    <ArrowRight aria-hidden="true" size={18} />
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
