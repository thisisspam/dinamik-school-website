import { getDb, schema } from "@/lib/db/client";
import { updateSettingsAction } from "@/lib/actions/settings";
import { Save } from "lucide-react";
import { AdminPageHeader } from "../../AdminPageHeader";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const db = await getDb();
  const row = (await db.select().from(schema.siteSettings))[0];

  return (
    <>
      <AdminPageHeader
        eyebrow="Kurumsal bilgiler"
        title="Site Ayarları"
        description="İletişim bilgileri, Instagram bağlantısı ve çalışma saatleri sitenin her yerinde bu değerleri kullanır."
      />
      {saved ? <div className="admin-flash">Kaydedildi.</div> : null}
      <div className="admin-card">
        <form className="admin-form" action={updateSettingsAction}>
          <div className="admin-form-row">
            <label>
              Genel iletişim telefonu
              <input type="text" name="generalPhone" defaultValue={row?.generalPhone} required />
            </label>
            <label>
              Sabit hat
              <input type="text" name="landlinePhone" defaultValue={row?.landlinePhone} required />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              WhatsApp numarası
              <input type="text" name="whatsapp" defaultValue={row?.whatsapp} required />
            </label>
            <label>
              E-posta
              <input type="email" name="email" defaultValue={row?.email} required />
            </label>
          </div>
          <label>
            Adres
            <input type="text" name="addressLine" defaultValue={row?.addressLine} required />
          </label>
          <label>
            Google Haritalar bağlantısı
            <input type="url" name="mapUrl" defaultValue={row?.mapUrl} required />
          </label>
          <label>
            Çalışma saatleri
            <input type="text" name="hours" defaultValue={row?.hours} required />
          </label>
          <label>
            Instagram bağlantısı
            <input type="url" name="instagramUrl" defaultValue={row?.instagramUrl} required />
          </label>
          <div className="admin-actions">
            <button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> Değişiklikleri kaydet</button>
          </div>
        </form>
      </div>
    </>
  );
}
