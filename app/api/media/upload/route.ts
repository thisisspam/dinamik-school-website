import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { hasValidSession } from "@/lib/auth";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

function isActivityUploadPath(pathname: string): boolean {
  return /^cms\/activities\/[a-z0-9][a-z0-9._/-]{1,180}$/i.test(pathname)
    && !pathname.includes("..");
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as HandleUploadBody;

  try {
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!(await hasValidSession())) {
          throw new Error("Yönetici oturumu gerekli.");
        }
        if (!isActivityUploadPath(pathname)) {
          throw new Error("Geçersiz medya yükleme yolu.");
        }
        const payload = clientPayload ? JSON.parse(clientPayload) as { intent?: string } : {};
        if (payload.intent !== "activity-album") {
          throw new Error("Geçersiz yükleme isteği.");
        }
        return {
          allowedContentTypes: ALLOWED_IMAGE_TYPES,
          maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ intent: "activity-album" }),
        };
      },
      onUploadCompleted: async () => {
        // Album metadata is persisted only after the client confirms every upload.
      },
    });
    return Response.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Medya yüklenemedi.";
    return Response.json({ error: message }, { status: message.includes("oturumu") ? 401 : 400 });
  }
}
