import Image from "next/image";
import { Eye, Save, ShieldAlert } from "lucide-react";
import {
  createDefaultDepartmentBlocks,
  normalizeDepartmentBlocks,
  type DepartmentContentBlock,
} from "@/lib/department-blocks";
import { DepartmentBlocksEditor } from "./DepartmentBlocksEditor";

export type DepartmentFormValue = {
  id: number;
  slug: string;
  shortTitle: string;
  title: string;
  branch: string;
  image: string;
  accent: string;
  lead: string;
  purpose: string;
  facts: Array<{ label: string; value: string }>;
  skills: string[];
  learningAreas: Array<{ title: string; text: string }>;
  careerAreas: string[];
  contentBlocks: DepartmentContentBlock[] | null;
  isVisible: boolean;
  isDeletable: boolean;
};

const ACCENT_OPTIONS = [
  { value: "red", label: "Kırmızı", description: "Güçlü ve enerjik vurgu" },
  { value: "indigo", label: "Lacivert", description: "Teknik ve kurumsal görünüm" },
  { value: "cyan", label: "Camgöbeği", description: "Modern teknoloji vurgusu" },
] as const;

export function DepartmentForm({
  action,
  department,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  department?: DepartmentFormValue;
  submitLabel: string;
}) {
  const isNew = !department;
  const initialBlocks = department
    ? normalizeDepartmentBlocks(department.contentBlocks, department)
    : createDefaultDepartmentBlocks();

  return (
    <form className="admin-form admin-department-form" action={action} encType="multipart/form-data">
      {department ? <input type="hidden" name="id" value={department.id} /> : null}

      {isNew ? (
        <div className="admin-reference-warning">
          <ShieldAlert aria-hidden="true" size={20} />
          <span>
            <strong>Aktif program kontrolü</strong>
            <small>Yalnızca okulda fiilen eğitim verilen alan ve dalları yayınlayın. Referans PDF’de “eğitim verilmemektedir” denilen dalları eklemeyin.</small>
          </span>
        </div>
      ) : null}

      <div className="admin-form-row">
        <label>
          Kısa başlık
          <input type="text" name="shortTitle" defaultValue={department?.shortTitle} required placeholder="Örn. Kimya" />
        </label>
        {isNew ? (
          <label>
            Sayfa bağlantısı
            <input type="text" name="slug" required placeholder="örn. yazilim-teknolojileri" />
            <span className="admin-hint">Küçük harf ve kısa çizgi kullanın; kaydedildikten sonra değişmez.</span>
          </label>
        ) : (
          <div className="admin-locked-field">
            <span>Sayfa bağlantısı</span>
            <strong>/bolumler/{department.slug}</strong>
            <small>Mevcut bağlantıların bozulmaması için korunur.</small>
          </div>
        )}
      </div>

      <div className="admin-form-row">
        <label>
          Bölüm adı
          <input type="text" name="title" defaultValue={department?.title} required />
        </label>
        <label>
          Dal adı
          <input type="text" name="branch" defaultValue={department?.branch} required />
        </label>
      </div>

      <fieldset className="admin-theme-fieldset">
        <legend>Bölüm teması</legend>
        <div className="admin-department-theme-options">
          {ACCENT_OPTIONS.map((option) => (
            <label className={`admin-department-theme-option admin-department-theme-option--${option.value}`} key={option.value}>
              <input type="radio" name="accent" value={option.value} defaultChecked={(department?.accent ?? "red") === option.value} />
              <span className="admin-department-theme-swatch" aria-hidden="true" />
              <span><strong>{option.label}</strong><small>{option.description}</small></span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Tanıtım cümlesi
        <textarea name="lead" defaultValue={department?.lead} required />
      </label>
      <label>
        Amaç metni
        <textarea name="purpose" defaultValue={department?.purpose} required />
      </label>

      <div className="admin-media-field">
        {department?.image ? (
          <div className="admin-current-media">
            <Image src={department.image} alt="Mevcut bölüm görseli" width={220} height={130} />
          </div>
        ) : null}
        <div className="admin-media-inputs">
          <label>
            Görsel yolu
            <input type="text" name="imagePath" defaultValue={department?.image ?? "/images/hero-lab.jpg"} required />
            <span className="admin-hint">Hazır bir site görseli yolu kullanabilir veya aşağıdan yeni görsel yükleyebilirsiniz.</span>
          </label>
          <label>
            Yeni görsel yükle
            <input type="file" name="imageFile" accept="image/*" />
            <span className="admin-hint">Dosya seçilirse görsel yolunun yerine yüklenen dosya kullanılır.</span>
          </label>
        </div>
      </div>

      <DepartmentBlocksEditor initialBlocks={initialBlocks} />

      <label className="admin-visibility-option">
        <input type="checkbox" name="isVisible" defaultChecked={department?.isVisible ?? true} />
        <span className="admin-visibility-icon"><Eye aria-hidden="true" size={18} /></span>
        <span><strong>Site genelinde göster</strong><small>Kapatıldığında bölüm ana sayfa, bölüm listesi ve detay sayfasından kaldırılır.</small></span>
      </label>

      <div className="admin-actions">
        <button className="admin-btn" type="submit"><Save aria-hidden="true" size={16} /> {submitLabel}</button>
      </div>
    </form>
  );
}
