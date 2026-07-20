import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UPLOAD_DIR = resolve(process.cwd(), "public", "uploads");

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

/** Saves an uploaded file to public/uploads and returns its public URL path. */
export async function saveUploadedFile(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${Date.now()}-${sanitizeFileName(file.name || "gorsel")}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(resolve(UPLOAD_DIR, fileName), buffer);
  return `/uploads/${fileName}`;
}
