import { Palette, Save, SlidersHorizontal } from "lucide-react";
import { getSiteTheme } from "@/lib/cms/content";
import { updateSiteThemeAction } from "@/lib/actions/site-theme";
import { AdminPageHeader } from "../../AdminPageHeader";

const COLOR_FIELDS = [
  ["brandNavy", "Kurumsal lacivert"],
  ["brandNavyDeep", "Koyu lacivert"],
  ["brandRed", "Kurumsal kırmızı"],
  ["brandRedDark", "Koyu kırmızı"],
  ["surface", "Ana sayfa zemini"],
  ["surfaceSoft", "Yumuşak bölüm zemini"],
  ["ink", "Ana metin rengi"],
  ["muted", "İkincil metin rengi"],
  ["border", "Çizgi ve çerçeve rengi"],
  ["headerBackground", "Header zemini"],
  ["footerBackground", "Footer zemini"],
] as const;

export default async function AdminThemePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const theme = await getSiteTheme();

  return (
    <>
      <AdminPageHeader
        eyebrow="Tasarım sistemi"
        title="Genel Site Teması"
        description="Kurumsal renkleri, içerik genişliğini, köşe yuvarlaklığını ve gölge yoğunluğunu site genelinde tek noktadan ayarlayın."
      />
      {saved ? <div className="admin-flash">Genel tema kaydedildi.</div> : null}
      <div className="admin-card">
        <form className="admin-form" action={updateSiteThemeAction}>
          <div className="admin-editor-section-heading"><span><Palette aria-hidden="true" size={17} /></span><h2>Kurumsal renkler</h2></div>
          <div className="admin-color-grid">
            {COLOR_FIELDS.map(([name, label]) => (
              <label className="admin-color-field" key={name}>
                {label}
                <span>
                  <input type="color" name={name} defaultValue={theme[name]} />
                  <input type="text" value={theme[name]} readOnly tabIndex={-1} aria-hidden="true" />
                </span>
              </label>
            ))}
          </div>

          <div className="admin-editor-section-heading"><span><SlidersHorizontal aria-hidden="true" size={17} /></span><h2>Ölçüler ve yoğunluk</h2></div>
          <div className="admin-form-row">
            <label>İçerik genişliği (px)<input type="number" name="containerWidth" min="960" max="1600" defaultValue={theme.containerWidth} required /></label>
            <label>Buton yuvarlaklığı (px)<input type="number" name="buttonRadius" min="0" max="999" defaultValue={theme.buttonRadius} required /></label>
          </div>
          <div className="admin-form-row">
            <label>Kart yuvarlaklığı (px)<input type="number" name="cardRadius" min="0" max="48" defaultValue={theme.cardRadius} required /></label>
            <label>Gölge yoğunluğu (%)<input type="number" name="shadowIntensity" min="0" max="150" defaultValue={theme.shadowIntensity} required /></label>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> Genel temayı kaydet</button>
          </div>
        </form>
      </div>
    </>
  );
}
