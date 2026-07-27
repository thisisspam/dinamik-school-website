import { Eye, ImageIcon, Save } from "lucide-react";
import type { ContentPageDefinition, ContentPageDocument } from "@/lib/cms/types";

const THEME_OPTIONS = [
  { value: "original", label: "Özgün", description: "Sayfanın mevcut kurumsal tasarımı" },
  { value: "light", label: "Açık", description: "Daha aydınlık ve sade vurgu" },
  { value: "navy", label: "Lacivert", description: "Kurumsal ve güçlü görünüm" },
  { value: "red", label: "Kırmızı", description: "Daha enerjik çağrı vurgusu" },
] as const;

export function ContentPageForm({
  action,
  definition,
  document,
}: {
  action: (formData: FormData) => void | Promise<void>;
  definition: ContentPageDefinition;
  document: ContentPageDocument;
}) {
  const groups = [...new Set(definition.fields.map((item) => item.group))];

  return (
    <form className="admin-form admin-content-page-form" action={action} encType="multipart/form-data">
      <input type="hidden" name="pageKey" value={definition.key} />

      <fieldset className="admin-theme-fieldset">
        <legend>Sayfa teması</legend>
        <div className="admin-theme-options">
          {THEME_OPTIONS.map((option) => (
            <label className={`admin-theme-option admin-theme-option--${option.value}`} key={option.value}>
              <input type="radio" name="theme" value={option.value} defaultChecked={document.theme === option.value} />
              <span className="admin-theme-swatch" aria-hidden="true" />
              <span><strong>{option.label}</strong><small>{option.description}</small></span>
            </label>
          ))}
        </div>
      </fieldset>

      {groups.map((group) => (
        <section className="admin-editor-section" key={group}>
          <div className="admin-editor-section-heading">
            <span><Eye aria-hidden="true" size={16} /></span>
            <h2>{group}</h2>
          </div>
          <div className="admin-editor-fields">
            {definition.fields.filter((item) => item.group === group).map((item) => {
              const value = document.content[item.key] ?? item.defaultValue;
              if (item.type === "image") {
                return (
                  <div className="admin-media-field admin-content-media-field" key={item.key}>
                    <div className="admin-current-media">
                      {value ? (
                        // eslint-disable-next-line @next/next/no-img-element -- CMS paths may point to Vercel Blob.
                        <img src={value} alt="" />
                      ) : <ImageIcon aria-hidden="true" size={28} />}
                    </div>
                    <div className="admin-media-inputs">
                      <label>
                        {item.label}
                        <input type="text" name={item.key} defaultValue={value} required={item.required} />
                        {item.help ? <span className="admin-hint">{item.help}</span> : null}
                      </label>
                      <label>
                        Yeni görsel yükle
                        <input type="file" name={`${item.key}File`} accept="image/jpeg,image/png,image/webp" />
                        <span className="admin-hint">Dosya seçilirse yukarıdaki yolun yerine yüklenen görsel kullanılır.</span>
                      </label>
                    </div>
                  </div>
                );
              }

              const isLongField = item.type === "textarea" || item.type === "lines";
              return (
                <label key={item.key}>
                  {item.label}
                  {isLongField ? (
                    <textarea
                      name={item.key}
                      defaultValue={value}
                      rows={item.type === "lines" ? Math.min(12, Math.max(4, value.split(/\r?\n/).length + 1)) : 5}
                      required={item.required}
                    />
                  ) : (
                    <input
                      type={item.type === "url" && value.startsWith("http") ? "url" : "text"}
                      name={item.key}
                      defaultValue={value}
                      required={item.required}
                    />
                  )}
                  {item.help ? <span className="admin-hint">{item.help}</span> : null}
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <div className="admin-actions admin-sticky-save">
        <button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> Tüm değişiklikleri kaydet</button>
      </div>
    </form>
  );
}
