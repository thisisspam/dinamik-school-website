import { and, inArray, isNull, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { ACTIVITY_COLLECTION_KEYS, type ActivityCollectionKey } from "@/lib/cms/media-definitions";
import * as schema from "@/lib/db/schema";

const DEFAULT_ALBUMS: Record<ActivityCollectionKey, { key: string; title: string; description: string }> = {
  "activities-sport": {
    key: "sportif-faaliyetler",
    title: "Sportif Faaliyetler",
    description: "Öğrencilerimizin müsabaka, turnuva, takım ve kürsü deneyimleri.",
  },
  "activities-social": {
    key: "sosyal-faaliyetler",
    title: "Sosyal Faaliyetler",
    description: "Öğrencilerimizin birlikte ürettiği ve paylaştığı sosyal çalışmalar.",
  },
  "activities-cultural": {
    key: "kulturel-faaliyetler",
    title: "Kültürel Faaliyetler",
    description: "Gezi, anma ve kültürel paylaşım programlarımız.",
  },
};

export function isActivityCollectionKey(value: string): value is ActivityCollectionKey {
  return ACTIVITY_COLLECTION_KEYS.includes(value as ActivityCollectionKey);
}

export async function ensureActivityAlbums(
  db: NeonHttpDatabase<typeof schema>,
  requestedCollections: readonly ActivityCollectionKey[] = ACTIVITY_COLLECTION_KEYS,
): Promise<void> {
  if (requestedCollections.length === 0) return;

  const collectionKeys = [...requestedCollections];
  let images = await db
    .select()
    .from(schema.galleryImages)
    .where(inArray(schema.galleryImages.collectionKey, collectionKeys));

  for (const collectionKey of collectionKeys) {
    const defaultAlbum = DEFAULT_ALBUMS[collectionKey];
    const imagesWithoutAlbum = images.filter(
      (image) => image.collectionKey === collectionKey && !image.albumId?.trim(),
    );
    if (imagesWithoutAlbum.length === 0) continue;

    await db
      .update(schema.galleryImages)
      .set({ albumId: defaultAlbum.key, albumTitle: defaultAlbum.title })
      .where(and(
        eq(schema.galleryImages.collectionKey, collectionKey),
        isNull(schema.galleryImages.albumId),
      ));
  }

  images = await db
    .select()
    .from(schema.galleryImages)
    .where(inArray(schema.galleryImages.collectionKey, collectionKeys));

  const existingAlbums = await db
    .select({ albumKey: schema.mediaAlbums.albumKey })
    .from(schema.mediaAlbums)
    .where(inArray(schema.mediaAlbums.collectionKey, collectionKeys));
  const existingKeys = new Set(existingAlbums.map((album) => album.albumKey));
  const groupedImages = new Map<string, typeof images>();

  for (const image of images) {
    const albumKey = image.albumId?.trim();
    if (!albumKey) continue;
    const group = groupedImages.get(albumKey) ?? [];
    group.push(image);
    groupedImages.set(albumKey, group);
  }

  const now = new Date().toISOString();
  const missingAlbums = [...groupedImages.entries()]
    .filter(([albumKey]) => !existingKeys.has(albumKey))
    .map(([albumKey, albumImages]) => {
      const firstImage = [...albumImages].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)[0];
      const collectionKey = firstImage.collectionKey as ActivityCollectionKey;
      const fallback = DEFAULT_ALBUMS[collectionKey];
      return {
        albumKey,
        collectionKey,
        departmentSlug: null,
        title: firstImage.albumTitle?.trim() || fallback.title,
        description: firstImage.description?.trim() || fallback.description,
        isVisible: true,
        sortOrder: Math.min(...albumImages.map((image) => image.sortOrder)),
        createdAt: now,
        updatedAt: now,
      };
    });

  if (missingAlbums.length > 0) {
    await db
      .insert(schema.mediaAlbums)
      .values(missingAlbums)
      .onConflictDoNothing({ target: schema.mediaAlbums.albumKey });
  }
}
