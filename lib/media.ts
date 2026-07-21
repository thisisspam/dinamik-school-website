import { put } from "@vercel/blob";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

/** Uploads a file to Vercel Blob and returns its public URL. */
export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Yalnızca JPEG, PNG veya WebP görselleri yüklenebilir.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Görsel dosyası 8 MB sınırını aşamaz.");
  }

  const fileName = `${Date.now()}-${sanitizeFileName(file.name || "gorsel")}`;
  const blob = await put(fileName, file, { access: "public", addRandomSuffix: false });
  return blob.url;
}
