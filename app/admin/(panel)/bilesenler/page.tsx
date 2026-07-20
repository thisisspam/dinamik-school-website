import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, LayoutTemplate, Palette, Pencil, Plus, Trash2 } from "lucide-react";
import { getHomepageSections } from "@/lib/content";
import {
  deleteHomepageSectionAction,
  moveHomepageSectionAction,
  toggleHomepageSectionAction,
} from "@/lib/actions/homepage-sections";
import { AdminPageHeader } from "../../AdminPageHeader";
import { ConfirmSubmitButton } from "../../ConfirmSubmitButton";

const TYPE_LABELS: Record<string, string> = {
  hero: "Karşılama",
  benefits: "Avantaj şeridi",
  departments: "Bölüm kartları",
  gallery: "Galeri",
  campus: "Kampüs tanıtımı",
  programs: "Program kartları",
  guidance: "Rehberlik",
  registration: "Form",
  contact: "İletişim",
  "custom-content": "İçerik alanı",
  "custom-announcement": "Duyuru bandı",
  "custom-cta": "Çağrı alanı",
};

const THEME_LABELS: Record<string, string> = {
  original: "Özgün",
  light: "Açık",
  navy: "Lacivert",
  red: "Kırmızı",
};

export default async function AdminHomepageSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const sections = await getHomepageSections();
  const visibleCount = sections.filter((section) => section.isVisible).length;
  const customSections = sections.filter((section) => section.isDeletable);

  return (
    <>
      <AdminPageHeader
        eyebrow="Sayfa oluşturucu"
        title="Ana Sayfa Bileşenleri"
        description="Ana sayfadaki alanları düzenleyin, temalarını değiştirin, geçici olarak gizleyin veya yeni içerik bileşenleri ekleyin."
        actions={<Link className="admin-btn" href="/admin/bilesenler/yeni"><Plus aria-hidden="true" size={16} /> Yeni bileşen</Link>}
      />

      {saved ? <div className="admin-flash">Bileşen ayarları kaydedildi.</div> : null}

      <section className="admin-component-summary" aria-label="Bileşen özeti">
        <article><LayoutTemplate aria-hidden="true" size={20} /><span><strong>{sections.length}</strong><small>Toplam bileşen</small></span></article>
        <article><Eye aria-hidden="true" size={20} /><span><strong>{visibleCount}</strong><small>Yayında</small></span></article>
        <article><Plus aria-hidden="true" size={20} /><span><strong>{customSections.length}</strong><small>Özel bileşen</small></span></article>
      </section>

      <div className="admin-component-list">
        {sections.map((section, index) => {
          const customIndex = customSections.findIndex((item) => item.id === section.id);
          return (
            <article className={`admin-component-card${section.isVisible ? "" : " is-hidden"}`} key={section.id}>
              <div className={`admin-component-preview admin-component-preview--${section.theme}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <LayoutTemplate aria-hidden="true" size={22} />
              </div>
              <div className="admin-component-copy">
                <div className="admin-component-title-row">
                  <h2>{section.displayName}</h2>
                  <span className={`admin-status-badge ${section.isVisible ? "is-visible" : "is-hidden"}`}>
                    {section.isVisible ? <Eye aria-hidden="true" size={13} /> : <EyeOff aria-hidden="true" size={13} />}
                    {section.isVisible ? "Yayında" : "Gizli"}
                  </span>
                </div>
                <p>{section.title}</p>
                <div className="admin-component-meta">
                  <span>{TYPE_LABELS[section.sectionType] ?? section.sectionType}</span>
                  <span><Palette aria-hidden="true" size={13} /> {THEME_LABELS[section.theme]}</span>
                  <span>{section.isDeletable ? "Özel" : "Kurumsal"}</span>
                </div>
              </div>
              <div className="admin-component-actions">
                {section.isDeletable ? (
                  <div className="admin-order-actions" aria-label="Özel bileşen sıralaması">
                    <form action={moveHomepageSectionAction}>
                      <input type="hidden" name="id" value={section.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" disabled={customIndex <= 0} aria-label="Yukarı taşı"><ArrowUp size={15} /></button>
                    </form>
                    <form action={moveHomepageSectionAction}>
                      <input type="hidden" name="id" value={section.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" disabled={customIndex === customSections.length - 1} aria-label="Aşağı taşı"><ArrowDown size={15} /></button>
                    </form>
                  </div>
                ) : null}
                <form action={toggleHomepageSectionAction}>
                  <input type="hidden" name="id" value={section.id} />
                  <input type="hidden" name="nextVisible" value={String(!section.isVisible)} />
                  <button className="admin-btn admin-btn-secondary" type="submit">
                    {section.isVisible ? <EyeOff aria-hidden="true" size={14} /> : <Eye aria-hidden="true" size={14} />}
                    {section.isVisible ? "Gizle" : "Göster"}
                  </button>
                </form>
                <Link className="admin-btn admin-btn-secondary" href={`/admin/bilesenler/${section.id}`}>
                  <Pencil aria-hidden="true" size={14} /> Düzenle
                </Link>
                {section.isDeletable ? (
                  <form action={deleteHomepageSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <ConfirmSubmitButton className="admin-btn admin-btn-danger" confirmMessage={`${section.displayName} kalıcı olarak silinsin mi?`}>
                      <Trash2 aria-hidden="true" size={14} /> Sil
                    </ConfirmSubmitButton>
                  </form>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
