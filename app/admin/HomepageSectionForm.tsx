import { Eye, ImageIcon, Save } from "lucide-react";
import type { HomepageSection } from "@/lib/content";
import { HOMEPAGE_CONTENT_FIELDS } from "@/lib/cms/homepage-fields";
import { FeatureCardsEditor } from "./FeatureCardsEditor";
import { HeroTilesEditor } from "./HeroTilesEditor";
import { StructuredListEditor } from "./StructuredListEditor";

const THEME_OPTIONS = [
  { value: "original", label: "Özgün tasarım", description: "Bileşenin mevcut tasarımını korur" },
  { value: "light", label: "Açık", description: "Açık ve yumuşak gri zemin" },
  { value: "navy", label: "Lacivert", description: "Koyu kurumsal görünüm" },
  { value: "red", label: "Kırmızı", description: "Güçlü vurgu görünümü" },
] as const;

const TYPE_OPTIONS = [
  { value: "custom-content", label: "İçerik alanı" },
  { value: "custom-announcement", label: "Duyuru bandı" },
  { value: "custom-cta", label: "Çağrı alanı" },
] as const;

export function HomepageSectionForm({
  action,
  section,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  section?: HomepageSection;
  submitLabel: string;
}) {
  const isCustom = !section || section.isDeletable;
  const contentFields = section ? (HOMEPAGE_CONTENT_FIELDS[section.sectionKey] ?? []) : [];
  const contentGroups = [...new Set(contentFields.map((item) => item.group))];

  return (
    <form className="admin-form admin-component-form" action={action} encType="multipart/form-data">
      {section ? <input type="hidden" name="id" value={section.id} /> : null}

      {isCustom ? (
        <label>
          Bileşen türü
          <select name="sectionType" defaultValue={section?.sectionType ?? "custom-content"}>
            {TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <span className="admin-hint">Bileşenin ana sayfada nasıl görüneceğini belirler.</span>
        </label>
      ) : (
        <div className="admin-locked-field">
          <span>Bileşen türü</span>
          <strong>Kurumsal ana sayfa bileşeni</strong>
          <small>Bu bileşen silinemez; gerektiğinde gizlenebilir.</small>
        </div>
      )}

      <div className="admin-form-row">
        <label>
          Yönetim adı
          <input type="text" name="displayName" defaultValue={section?.displayName} required />
          <span className="admin-hint">Yalnızca yönetim panelinde görünür.</span>
        </label>
        <label>
          Üst etiket
          <input type="text" name="eyebrow" defaultValue={section?.eyebrow} placeholder="Örn. Kampüs & Yaşam" />
        </label>
      </div>

      {contentGroups.map((group) => (
        <section className="admin-editor-section" key={group}>
          <div className="admin-editor-section-heading"><span><Eye aria-hidden="true" size={16} /></span><h2>{group}</h2></div>
          <div className="admin-editor-fields">
            {contentFields.filter((item) => item.group === group).map((item) => {
              const value = section?.content[item.key] ?? item.defaultValue;
              if (item.type === "feature-cards") {
                return <FeatureCardsEditor key={item.key} name={`content_${item.key}`} value={value} />;
              }
              if (item.type === "hero-tiles") {
                return <HeroTilesEditor key={item.key} name={`content_${item.key}`} value={value} />;
              }
              if (item.type === "structured-list") {
                return (
                  <StructuredListEditor
                    key={item.key}
                    sectionKey={section?.sectionKey ?? ""}
                    fieldKey={item.key}
                    name={`content_${item.key}`}
                    value={value}
                  />
                );
              }
              if (item.type === "image") {
                return (
                  <div className="admin-media-field admin-content-media-field" key={item.key}>
                    <div className="admin-current-media">
                      {value ? (
                        // eslint-disable-next-line @next/next/no-img-element -- CMS image can be a Vercel Blob URL.
                        <img src={value} alt="" />
                      ) : <ImageIcon aria-hidden="true" size={28} />}
                    </div>
                    <div className="admin-media-inputs">
                      <label>{item.label}<input type="text" name={`content_${item.key}`} defaultValue={value} /></label>
                      <label>
                        Yeni görsel yükle
                        <input type="file" name={`content_${item.key}_file`} accept="image/jpeg,image/png,image/webp" />
                      </label>
                    </div>
                  </div>
                );
              }
              const multiline = item.type === "textarea" || item.type === "lines";
              return (
                <label key={item.key}>
                  {item.label}
                  {multiline ? (
                    <textarea name={`content_${item.key}`} defaultValue={value} rows={item.type === "lines" ? Math.min(12, Math.max(4, value.split(/\r?\n/).length + 1)) : 5} />
                  ) : (
                    <input type="text" name={`content_${item.key}`} defaultValue={value} />
                  )}
                  {item.help ? <span className="admin-hint">{item.help}</span> : null}
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <label>
        Başlık
        <input type="text" name="title" defaultValue={section?.title} required />
      </label>

      <label>
        Açıklama
        <textarea name="description" defaultValue={section?.description} rows={5} />
        <span className="admin-hint">Duyuru ve özel içeriklerde satır sonları korunur.</span>
      </label>

      <div className="admin-form-row">
        <label>
          Buton metni
          <input type="text" name="ctaLabel" defaultValue={section?.ctaLabel} placeholder="Örn. Detayları incele" />
        </label>
        <label>
          Buton bağlantısı
          <input type="text" name="ctaHref" defaultValue={section?.ctaHref} placeholder="/iletisim veya https://..." />
        </label>
      </div>

      <fieldset className="admin-theme-fieldset">
        <legend>Tema</legend>
        <div className="admin-theme-options">
          {THEME_OPTIONS.map((option) => (
            <label className={`admin-theme-option admin-theme-option--${option.value}`} key={option.value}>
              <input type="radio" name="theme" value={option.value} defaultChecked={(section?.theme ?? "original") === option.value} />
              <span className="admin-theme-swatch" aria-hidden="true" />
              <span><strong>{option.label}</strong><small>{option.description}</small></span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="admin-visibility-option">
        <input type="checkbox" name="isVisible" defaultChecked={section?.isVisible ?? true} />
        <span className="admin-visibility-icon"><Eye aria-hidden="true" size={18} /></span>
        <span><strong>Ana sayfada göster</strong><small>Kapatıldığında içerik silinmeden yayından kaldırılır.</small></span>
      </label>

      <div className="admin-actions">
        <button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> {submitLabel}</button>
      </div>
    </form>
  );
}
