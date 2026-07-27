import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/client";
import {
  MEDIA_COLLECTIONS,
  mediaCollectionDefinition,
  type ManagedMediaPhoto,
  type MediaCollectionKey,
} from "@/lib/cms/media-definitions";

export * from "@/lib/cms/media-definitions";

export async function getManagedMediaCollection(
  key: MediaCollectionKey,
  initialPhotos: ManagedMediaPhoto[],
): Promise<ManagedMediaPhoto[]> {
  const db = await getDb();
  const definition = mediaCollectionDefinition(key);
  const insertedCollection = await db
    .insert(schema.mediaCollections)
    .values({
      collectionKey: key,
      displayName: definition.displayName,
      description: definition.description,
      sortOrder: MEDIA_COLLECTIONS.findIndex((collection) => collection.key === key),
    })
    .onConflictDoNothing({ target: schema.mediaCollections.collectionKey })
    .returning({ id: schema.mediaCollections.id });

  if (insertedCollection.length > 0 && initialPhotos.length > 0) {
    await db.insert(schema.galleryImages).values(
      initialPhotos.map((photo, index) => ({
        collectionKey: key,
        src: photo.src,
        alt: photo.alt,
        caption: photo.title,
        description: photo.description,
        albumId: photo.albumId ?? null,
        albumTitle: photo.albumTitle ?? null,
        fit: photo.fit ?? "cover",
        objectPosition: photo.objectPosition ?? null,
        sortOrder: index,
      })),
    );
  }

  const rows = await db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.collectionKey, key))
    .orderBy(asc(schema.galleryImages.sortOrder), asc(schema.galleryImages.id));

  return rows.map((row) => ({
    src: row.src,
    title: row.caption?.trim() || row.alt,
    description: row.description?.trim() || row.caption?.trim() || row.alt,
    alt: row.alt,
    albumId: row.albumId?.trim() || undefined,
    albumTitle: row.albumTitle?.trim() || undefined,
    fit: row.fit === "contain" ? "contain" : "cover",
    objectPosition: row.objectPosition?.trim() || undefined,
  }));
}
