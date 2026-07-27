import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getDepartments } from "@/app/data/departments";
import { ActivityAlbumPhotoAppender } from "@/app/admin/ActivityAlbumUploader";
import { AdminPageHeader } from "@/app/admin/AdminPageHeader";
import { ConfirmSubmitButton } from "@/app/admin/ConfirmSubmitButton";
import {
  deleteActivityAlbumAction,
  deleteActivityPhotoAction,
  moveActivityPhotoAction,
  toggleActivityAlbumAction,
  updateActivityAlbumAction,
  updateActivityPhotoAction,
} from "@/lib/actions/activity-albums";
import { getActivityAlbumDetail } from "@/lib/cms/activity-albums";
import { REFERENCE_ACTIVE_DEPARTMENT_SLUGS } from "@/lib/cms/department-programs";

export default async function ActivityAlbumDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string }>;
}) {
  const [{ id }, query, allDepartments] = await Promise.all([params, searchParams, getDepartments()]);
  const albumId = Number(id);
  if (!Number.isInteger(albumId) || albumId <= 0) notFound();
  const detail = await getActivityAlbumDetail(albumId);
  if (!detail) notFound();
  const { album, images } = detail;
  const departments = allDepartments.filter((department) =>
    REFERENCE_ACTIVE_DEPARTMENT_SLUGS.includes(department.slug as (typeof REFERENCE_ACTIVE_DEPARTMENT_SLUGS)[number]),
  );
  const isDepartmentAlbum = album.collectionKey === "department-activities";

  return (
    <>
      <AdminPageHeader
        eyebrow={isDepartmentAlbum ? "Bölüm faaliyeti" : "Genel faaliyet"}
        title={album.title}
        description={`${images.length} fotoğraflı albümün yayın bilgilerini, sırasını ve görsellerini yönetin.`}
        actions={<Link className="admin-btn admin-btn-secondary" href="/admin/faaliyetler"><ArrowLeft size={15} /> Albümlere dön</Link>}
      />
      {query.saved || query.created ? <div className="admin-flash">{query.created ? "Faaliyet albümü oluşturuldu." : "Değişiklikler kaydedildi."}</div> : null}

      <div className="activity-album-detail-layout">
        <section className="admin-card activity-album-settings" aria-labelledby="album-settings-title">
          <div className="activity-album-detail-heading">
            <div><p className="admin-eyebrow">Albüm bilgileri</p><h2 id="album-settings-title">Yayın ve içerik ayarları</h2></div>
            <span className={album.isVisible ? "is-visible" : "is-hidden"}>{album.isVisible ? "Yayında" : "Gizli"}</span>
          </div>
          <form className="admin-form" action={updateActivityAlbumAction}>
            <input type="hidden" name="albumId" value={album.id} />
            <input type="hidden" name="scope" value={isDepartmentAlbum ? "department" : "general"} />
            {isDepartmentAlbum ? (
              <label>
                Yayınlanacağı bölüm
                <select name="departmentSlug" defaultValue={album.departmentSlug ?? ""} required>
                  {departments.map((department) => <option value={department.slug} key={department.slug}>{department.title} · {department.branch}</option>)}
                </select>
              </label>
            ) : (
              <label>
                Faaliyet türü
                <select name="collectionKey" defaultValue={album.collectionKey} required>
                  <option value="activities-social">Sosyal faaliyet</option>
                  <option value="activities-cultural">Kültürel faaliyet</option>
                  <option value="activities-sport">Sportif faaliyet</option>
                </select>
              </label>
            )}
            <label>Albüm başlığı<input type="text" name="title" defaultValue={album.title} required /></label>
            <label>Albüm açıklaması<textarea name="description" rows={4} defaultValue={album.description} required /></label>
            <div className="admin-actions">
              <button className="admin-btn" type="submit"><Save aria-hidden="true" size={15} /> Bilgileri kaydet</button>
            </div>
          </form>
          <div className="activity-album-danger-actions">
            <form action={toggleActivityAlbumAction}>
              <input type="hidden" name="albumId" value={album.id} />
              <button className="admin-btn admin-btn-secondary" type="submit">
                {album.isVisible ? <EyeOff aria-hidden="true" size={15} /> : <Eye aria-hidden="true" size={15} />}
                {album.isVisible ? "Albümü gizle" : "Albümü yayınla"}
              </button>
            </form>
            <form action={deleteActivityAlbumAction}>
              <input type="hidden" name="albumId" value={album.id} />
              <ConfirmSubmitButton
                className="admin-btn admin-btn-danger"
                confirmMessage="Bu faaliyet albümü ve albümdeki tüm fotoğraf kayıtları kaldırılsın mı?"
              >
                <Trash2 aria-hidden="true" size={15} /> Albümü sil
              </ConfirmSubmitButton>
            </form>
          </div>
        </section>

        <section className="admin-card activity-album-add-photos" aria-labelledby="add-photo-title">
          <div className="activity-album-detail-heading"><div><p className="admin-eyebrow">Toplu ekleme</p><h2 id="add-photo-title">Albüme fotoğraf ekle</h2></div></div>
          <ActivityAlbumPhotoAppender albumId={album.id} />
        </section>
      </div>

      <section className="admin-section activity-photo-library" aria-labelledby="album-photos-title">
        <div className="admin-section-header">
          <div><span className="admin-eyebrow">Albüm sırası</span><h2 id="album-photos-title">Fotoğraflar</h2></div>
          <span className="admin-section-note">{images.length} fotoğraf</span>
        </div>
        <div className="activity-photo-grid">
          {images.map((image, index) => (
            <article className="activity-photo-card" key={image.id}>
              <div className="activity-photo-card-image">
                <Image src={image.src} alt="" fill sizes="(max-width: 680px) calc(100vw - 64px), 300px" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <form action={updateActivityPhotoAction}>
                <input type="hidden" name="albumId" value={album.id} />
                <input type="hidden" name="photoId" value={image.id} />
                <label>Görsel açıklaması<input type="text" name="alt" defaultValue={image.alt} required /></label>
                <label>Fotoğraf başlığı<input type="text" name="caption" defaultValue={image.caption ?? album.title} /></label>
                <label>Açıklama<textarea name="description" rows={2} defaultValue={image.description ?? album.description} /></label>
                <div className="activity-photo-advanced-fields">
                  <label>Yerleşim<select name="fit" defaultValue={image.fit}><option value="cover">Alanı doldur</option><option value="contain">Tamamını göster</option></select></label>
                  <label>Odak konumu<input type="text" name="objectPosition" defaultValue={image.objectPosition ?? ""} placeholder="center 35%" /></label>
                </div>
                <button className="admin-btn admin-btn-secondary" type="submit"><Save size={14} /> Kaydet</button>
              </form>
              <div className="activity-photo-card-actions">
                <form action={moveActivityPhotoAction}>
                  <input type="hidden" name="albumId" value={album.id} /><input type="hidden" name="photoId" value={image.id} /><input type="hidden" name="direction" value="up" />
                  <button type="submit" disabled={index === 0} aria-label="Fotoğrafı önceki sıraya taşı"><ArrowUp size={14} /></button>
                </form>
                <form action={moveActivityPhotoAction}>
                  <input type="hidden" name="albumId" value={album.id} /><input type="hidden" name="photoId" value={image.id} /><input type="hidden" name="direction" value="down" />
                  <button type="submit" disabled={index === images.length - 1} aria-label="Fotoğrafı sonraki sıraya taşı"><ArrowDown size={14} /></button>
                </form>
                <form action={deleteActivityPhotoAction}>
                  <input type="hidden" name="albumId" value={album.id} /><input type="hidden" name="photoId" value={image.id} />
                  <ConfirmSubmitButton confirmMessage="Bu fotoğraf albümden kaldırılsın mı?"><Trash2 size={14} /> Sil</ConfirmSubmitButton>
                </form>
              </div>
            </article>
          ))}
          {images.length === 0 ? <p className="admin-empty">Albümde fotoğraf yok. Yukarıdaki toplu yükleme alanını kullanabilirsiniz.</p> : null}
        </div>
      </section>
    </>
  );
}
