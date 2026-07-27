import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp, FolderPlus, Images, Layers3, School } from "lucide-react";
import { getDepartments } from "@/app/data/departments";
import { ActivityAlbumUploader } from "@/app/admin/ActivityAlbumUploader";
import { AdminPageHeader } from "@/app/admin/AdminPageHeader";
import { getActivityAlbumSummaries } from "@/lib/cms/activity-albums";
import { REFERENCE_ACTIVE_DEPARTMENT_SLUGS } from "@/lib/cms/department-programs";
import { mediaCollectionDefinition } from "@/lib/cms/media-definitions";
import { moveActivityAlbumAction } from "@/lib/actions/activity-albums";

function AlbumCard({
  album,
  departmentName,
  index,
  total,
}: {
  album: Awaited<ReturnType<typeof getActivityAlbumSummaries>>[number];
  departmentName?: string;
  index: number;
  total: number;
}) {
  const collection = mediaCollectionDefinition(album.collectionKey as Parameters<typeof mediaCollectionDefinition>[0]);
  return (
    <article className={`activity-album-card${album.isVisible ? "" : " is-hidden"}`}>
      <Link className="activity-album-card-cover" href={`/admin/faaliyetler/${album.id}`}>
        {album.coverImage ? (
          <Image src={album.coverImage} alt="" fill sizes="(max-width: 680px) calc(100vw - 64px), 280px" />
        ) : (
          <span><Images aria-hidden="true" size={28} />Henüz fotoğraf yok</span>
        )}
        <em>{album.photoCount} fotoğraf</em>
      </Link>
      <div className="activity-album-card-copy">
        <span>{departmentName ?? collection.displayName}</span>
        <h3>{album.title}</h3>
        <p>{album.description}</p>
        <div className="activity-album-card-footer">
          <small>{album.isVisible ? "Yayında" : "Gizli"}</small>
          <div className="activity-album-order-actions">
            <form action={moveActivityAlbumAction}>
              <input type="hidden" name="albumId" value={album.id} />
              <input type="hidden" name="direction" value="up" />
              <button type="submit" disabled={index === 0} aria-label={`${album.title} albümünü yukarı taşı`}><ArrowUp size={14} /></button>
            </form>
            <form action={moveActivityAlbumAction}>
              <input type="hidden" name="albumId" value={album.id} />
              <input type="hidden" name="direction" value="down" />
              <button type="submit" disabled={index === total - 1} aria-label={`${album.title} albümünü aşağı taşı`}><ArrowDown size={14} /></button>
            </form>
            <Link href={`/admin/faaliyetler/${album.id}`}>Düzenle <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;
  const [allDepartments, albums] = await Promise.all([getDepartments(), getActivityAlbumSummaries()]);
  const departments = allDepartments.filter((department) =>
    REFERENCE_ACTIVE_DEPARTMENT_SLUGS.includes(department.slug as (typeof REFERENCE_ACTIVE_DEPARTMENT_SLUGS)[number]),
  );
  const departmentOptions = departments.map(({ slug, title, branch }) => ({ slug, title, branch }));
  const departmentBySlug = new Map(departments.map((department) => [department.slug, department]));
  const generalAlbums = albums.filter((album) => album.collectionKey.startsWith("activities-"));
  const departmentAlbums = albums.filter((album) => album.collectionKey === "department-activities");
  const generalAlbumGroups = ["activities-social", "activities-cultural", "activities-sport"].map((collectionKey) => ({
    collectionKey,
    albums: generalAlbums.filter((album) => album.collectionKey === collectionKey),
  }));
  const departmentAlbumGroups = departments.map((department) => ({
    department,
    albums: departmentAlbums.filter((album) => album.departmentSlug === department.slug),
  }));

  return (
    <>
      <AdminPageHeader
        eyebrow="Toplu medya yönetimi"
        title="Faaliyet Albümleri"
        description="Yeni bir faaliyet oluşturun, fotoğrafları toplu yükleyin veya albümü doğrudan ilgili bölüm sayfasında yayınlayın."
      />
      {deleted ? <div className="admin-flash">Faaliyet albümü kaldırıldı.</div> : null}

      <section className="activity-admin-summary" aria-label="Faaliyet albümü özeti">
        <article><span><Layers3 size={20} /></span><div><strong>{generalAlbums.length}</strong><small>Genel faaliyet albümü</small></div></article>
        <article><span><School size={20} /></span><div><strong>{departmentAlbums.length}</strong><small>Bölüm faaliyet albümü</small></div></article>
        <article><span><Images size={20} /></span><div><strong>{albums.reduce((sum, album) => sum + album.photoCount, 0)}</strong><small>Toplam faaliyet fotoğrafı</small></div></article>
      </section>

      <section className="activity-create-panel" aria-labelledby="new-activity-title">
        <div className="activity-create-heading">
          <span><FolderPlus aria-hidden="true" size={23} /></span>
          <div><p className="admin-eyebrow">Yeni faaliyet</p><h2 id="new-activity-title">Toplu faaliyet albümü yükle</h2><p>Sosyal, kültürel veya sportif faaliyeti tek işlemde oluşturup bütün fotoğrafları birlikte yükleyin.</p></div>
        </div>
        <ActivityAlbumUploader mode="general" departments={departmentOptions} />
      </section>

      <section className="activity-create-panel activity-create-panel--department" aria-labelledby="department-activity-title">
        <div className="activity-create-heading">
          <span><School aria-hidden="true" size={23} /></span>
          <div><p className="admin-eyebrow">Bölüm faaliyetleri</p><h2 id="department-activity-title">Bölüme özel albüm yayınla</h2><p>Seçtiğiniz bölümün sayfasında yalnızca albüm varsa görünen animasyonlu faaliyet galerisi oluşturun.</p></div>
        </div>
        <ActivityAlbumUploader mode="department" departments={departmentOptions} />
      </section>

      <section className="admin-section activity-album-library" aria-labelledby="general-albums-title">
        <div className="admin-section-header"><div><span className="admin-eyebrow">Faaliyet arşivi</span><h2 id="general-albums-title">Genel faaliyet albümleri</h2></div></div>
        {generalAlbumGroups.map((group) => {
          const definition = mediaCollectionDefinition(group.collectionKey as Parameters<typeof mediaCollectionDefinition>[0]);
          return (
            <div className="activity-album-group" key={group.collectionKey}>
              <div className="activity-album-group-heading"><h3>{definition.displayName}</h3><span>{group.albums.length} albüm</span></div>
              <div className="activity-album-grid">
                {group.albums.map((album, index) => <AlbumCard album={album} index={index} total={group.albums.length} key={album.id} />)}
                {group.albums.length === 0 ? <p className="admin-empty">Bu faaliyet türünde henüz albüm yok.</p> : null}
              </div>
            </div>
          );
        })}
      </section>

      <section className="admin-section activity-album-library" aria-labelledby="department-albums-title">
        <div className="admin-section-header"><div><span className="admin-eyebrow">Bölüm faaliyetleri</span><h2 id="department-albums-title">Bölümlere bağlı albümler</h2></div></div>
        {departmentAlbumGroups.map(({ department, albums: departmentGroupAlbums }) => (
          <div className="activity-album-group" key={department.slug}>
            <div className="activity-album-group-heading"><h3>{department.title}</h3><span>{departmentGroupAlbums.length} albüm</span></div>
            <div className="activity-album-grid">
              {departmentGroupAlbums.map((album, index) => (
                <AlbumCard
                  album={album}
                  departmentName={departmentBySlug.get(album.departmentSlug ?? "")?.branch}
                  index={index}
                  total={departmentGroupAlbums.length}
                  key={album.id}
                />
              ))}
              {departmentGroupAlbums.length === 0 ? <p className="admin-empty">Bu bölümde yayınlanan faaliyet albümü yok.</p> : null}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
