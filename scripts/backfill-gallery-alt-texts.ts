import { neon } from "@neondatabase/serverless";
import { galleryAltTextsFor } from "../app/data/gallery-alt-texts";

type GalleryRow = {
  id: number;
  collection_key: string;
  src: string;
  alt: string;
  album_id: string | null;
  sort_order: number;
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL ortam değişkeni tanımlı değil.");
}

const sql = neon(databaseUrl);
const rows = await sql(
  `SELECT id, collection_key, src, alt, album_id, sort_order
   FROM gallery_images
   ORDER BY collection_key, album_id, sort_order, id`,
  [],
) as GalleryRow[];

const managedCollections = new Set([
  "achievements",
  "activities-cultural",
  "activities-social",
]);
const genericAltPattern = / içeriğinden \d+\. fotoğraf$/;
const updates: Array<{ id: number; oldAlt: string; newAlt: string }> = [];

const rowsByAlbum = new Map<string, GalleryRow[]>();
for (const row of rows) {
  if (!managedCollections.has(row.collection_key) || !row.album_id) continue;
  const albumRows = rowsByAlbum.get(row.album_id) ?? [];
  albumRows.push(row);
  rowsByAlbum.set(row.album_id, albumRows);
}

for (const [albumId, albumRows] of rowsByAlbum) {
  const altTexts = galleryAltTextsFor(albumId, albumRows.length);
  albumRows.forEach((row, index) => {
    if (!genericAltPattern.test(row.alt)) return;
    updates.push({ id: row.id, oldAlt: row.alt, newAlt: altTexts[index] });
  });
}

const legacySiteGalleryAltTexts = new Map([
  [
    "/images/gallery-7.jpg",
    {
      oldAlt: "Okul etkinliğine katılan öğrenciler",
      newAlt: "Dinamik öğrencileri TÜYAP Samsun Fuar ve Kongre Merkezi girişinde",
    },
  ],
  [
    "/images/gallery-8.jpg",
    {
      oldAlt: "Dinamik öğrenci topluluğu",
      newAlt: "Dinamik öğrenci grubu TÜYAP Samsun Fuar ve Kongre Merkezi merdivenlerinde",
    },
  ],
]);

for (const row of rows) {
  const replacement = legacySiteGalleryAltTexts.get(row.src);
  if (!replacement || row.alt !== replacement.oldAlt) continue;
  updates.push({ id: row.id, oldAlt: row.alt, newAlt: replacement.newAlt });
}

if (updates.length > 0) {
  const updatedRows = await sql(
    `UPDATE gallery_images AS gallery
     SET alt = replacements.new_alt
     FROM jsonb_to_recordset($1::jsonb)
       AS replacements(id integer, old_alt text, new_alt text)
     WHERE gallery.id = replacements.id
       AND gallery.alt = replacements.old_alt
     RETURNING gallery.id, gallery.collection_key, gallery.src, gallery.alt`,
    [
      JSON.stringify(
        updates.map((update) => ({
          id: update.id,
          old_alt: update.oldAlt,
          new_alt: update.newAlt,
        })),
      ),
    ],
  ) as Array<{ id: number }>;

  if (updatedRows.length !== updates.length) {
    throw new Error(
      `Beklenen ${updates.length} kaydın yalnızca ${updatedRows.length} tanesi güncellendi.`,
    );
  }

  console.log(`${updatedRows.length} galeri alternatif metni güncellendi.`);
} else {
  console.log("Güncellenecek genel alternatif metin bulunamadı.");
}

const [verification] = await sql(
  `SELECT
     COUNT(*) FILTER (
       WHERE collection_key = ANY($1::text[])
         AND alt ~ ' içeriğinden [0-9]+[.] fotoğraf$'
     )::integer AS generic_count,
     COUNT(*) FILTER (WHERE alt = '')::integer AS empty_count
   FROM gallery_images`,
  [[...managedCollections]],
) as Array<{ generic_count: number; empty_count: number }>;

if (verification.generic_count !== 0 || verification.empty_count !== 0) {
  throw new Error(
    `Doğrulama başarısız: ${verification.generic_count} genel, ${verification.empty_count} boş alternatif metin kaldı.`,
  );
}

console.log("Doğrulandı: genel veya boş galeri alternatif metni kalmadı.");
