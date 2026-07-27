import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/client";
import {
  getManagedMediaCollection,
  type ActivityCollectionKey,
  type ManagedMediaPhoto,
} from "@/lib/cms/media-collections";
import { ensureActivityAlbums } from "@/lib/cms/activity-album-core";

type AlbumRow = typeof schema.mediaAlbums.$inferSelect;
type ImageRow = typeof schema.galleryImages.$inferSelect;

export type ActivityAlbumSummary = AlbumRow & {
  photoCount: number;
  coverImage?: string;
};

function mapAlbumPhoto(image: ImageRow, album: AlbumRow): ManagedMediaPhoto {
  return {
    src: image.src,
    title: image.caption?.trim() || album.title,
    description: image.description?.trim() || album.description,
    alt: image.alt,
    albumId: album.albumKey,
    albumTitle: album.title,
    fit: image.fit === "contain" ? "contain" : "cover",
    objectPosition: image.objectPosition?.trim() || undefined,
  };
}

async function photosForAlbums(albums: AlbumRow[]): Promise<ManagedMediaPhoto[]> {
  if (albums.length === 0) return [];
  const albumKeys = albums.map((album) => album.albumKey);
  const db = await getDb();
  const images = await db
    .select()
    .from(schema.galleryImages)
    .where(inArray(schema.galleryImages.albumId, albumKeys))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));
  const imagesByAlbum = new Map<string, ImageRow[]>();

  for (const image of images) {
    if (!image.albumId) continue;
    const group = imagesByAlbum.get(image.albumId) ?? [];
    group.push(image);
    imagesByAlbum.set(image.albumId, group);
  }

  return albums.flatMap((album) =>
    (imagesByAlbum.get(album.albumKey) ?? []).map((image) => mapAlbumPhoto(image, album)),
  );
}

export async function getActivityCollectionPhotos(
  collectionKey: ActivityCollectionKey,
  initialPhotos: ManagedMediaPhoto[],
): Promise<ManagedMediaPhoto[]> {
  await getManagedMediaCollection(collectionKey, initialPhotos);
  const db = await getDb();
  await ensureActivityAlbums(db, [collectionKey]);
  const albums = await db
    .select()
    .from(schema.mediaAlbums)
    .where(and(
      eq(schema.mediaAlbums.collectionKey, collectionKey),
      eq(schema.mediaAlbums.isVisible, true),
    ))
    .orderBy(asc(schema.mediaAlbums.sortOrder), asc(schema.mediaAlbums.id));
  return photosForAlbums(albums);
}

export async function getDepartmentActivityPhotos(departmentSlug: string): Promise<ManagedMediaPhoto[]> {
  const db = await getDb();
  const albums = await db
    .select()
    .from(schema.mediaAlbums)
    .where(and(
      eq(schema.mediaAlbums.collectionKey, "department-activities"),
      eq(schema.mediaAlbums.departmentSlug, departmentSlug),
      eq(schema.mediaAlbums.isVisible, true),
    ))
    .orderBy(asc(schema.mediaAlbums.sortOrder), asc(schema.mediaAlbums.id));
  return photosForAlbums(albums);
}

export async function getActivityAlbumSummaries(): Promise<ActivityAlbumSummary[]> {
  const db = await getDb();
  await ensureActivityAlbums(db);
  const [albums, images] = await Promise.all([
    db
      .select()
      .from(schema.mediaAlbums)
      .orderBy(asc(schema.mediaAlbums.collectionKey), asc(schema.mediaAlbums.sortOrder), asc(schema.mediaAlbums.id)),
    db
      .select()
      .from(schema.galleryImages)
      .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id)),
  ]);

  return albums.map((album) => {
    const albumImages = images.filter((image) => image.albumId === album.albumKey);
    return {
      ...album,
      photoCount: albumImages.length,
      coverImage: albumImages[0]?.src,
    };
  });
}

export async function getActivityAlbumDetail(id: number): Promise<{
  album: AlbumRow;
  images: ImageRow[];
} | undefined> {
  const db = await getDb();
  const [album] = await db
    .select()
    .from(schema.mediaAlbums)
    .where(eq(schema.mediaAlbums.id, id))
    .limit(1);
  if (!album) return undefined;
  const images = await db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.albumId, album.albumKey))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));
  return { album, images };
}
