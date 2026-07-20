import { put } from "@vercel/blob";

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

/** Uploads a file to Vercel Blob and returns its public URL. */
export async function saveUploadedFile(file: File): Promise<string> {
  const fileName = `${Date.now()}-${sanitizeFileName(file.name || "gorsel")}`;
  const blob = await put(fileName, file, { access: "public", addRandomSuffix: false });
  return blob.url;
}
