"use client";

import { upload } from "@vercel/blob/client";
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addPhotosToActivityAlbumAction,
  createActivityAlbumAction,
  type UploadedActivityPhoto,
} from "@/lib/actions/activity-albums";
import type { ActivityCollectionKey } from "@/lib/cms/media-definitions";

const MAX_FILES = 40;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type DepartmentOption = { slug: string; title: string; branch: string };

type SelectedImage = {
  id: string;
  file: File;
};

function safeFileName(name: string): string {
  return name
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-90) || "fotograf.webp";
}

function validateAndCreateSelection(files: File[], currentCount: number): { images: SelectedImage[]; error?: string } {
  if (currentCount + files.length > MAX_FILES) {
    return { images: [], error: `Bir albüme tek seferde en fazla ${MAX_FILES} fotoğraf seçebilirsiniz.` };
  }
  const invalidType = files.find((file) => !ALLOWED_TYPES.has(file.type));
  if (invalidType) return { images: [], error: `${invalidType.name}: yalnızca JPEG, PNG veya WebP yüklenebilir.` };
  const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
  if (oversized) return { images: [], error: `${oversized.name}: dosya boyutu 8 MB sınırını aşıyor.` };
  return {
    images: files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
    })),
  };
}

async function uploadSelectedImages(
  images: SelectedImage[],
  onProgress: (progress: number) => void,
): Promise<UploadedActivityPhoto[]> {
  const progressById = new Map(images.map((image) => [image.id, 0]));
  const results: UploadedActivityPhoto[] = new Array(images.length);
  let nextIndex = 0;

  const updateCombinedProgress = (id: string, percentage: number) => {
    progressById.set(id, percentage);
    const total = [...progressById.values()].reduce((sum, value) => sum + value, 0);
    onProgress(Math.round(total / images.length));
  };

  const worker = async () => {
    while (nextIndex < images.length) {
      const index = nextIndex;
      nextIndex += 1;
      const image = images[index];
      const pathname = `cms/activities/${Date.now()}-${index}-${safeFileName(image.file.name)}`;
      const blob = await upload(pathname, image.file, {
        access: "public",
        handleUploadUrl: "/api/media/upload",
        clientPayload: JSON.stringify({ intent: "activity-album" }),
        multipart: image.file.size > 4 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => updateCombinedProgress(image.id, percentage),
      });
      results[index] = { url: blob.url, originalName: image.file.name };
      updateCombinedProgress(image.id, 100);
    }
  };

  await Promise.all(Array.from({ length: Math.min(3, images.length) }, () => worker()));
  return results;
}

function SelectedImageGrid({
  images,
  onRemove,
  onMove,
}: {
  images: SelectedImage[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  const previews = useMemo(
    () => images.map((image) => ({ ...image, previewUrl: URL.createObjectURL(image.file) })),
    [images],
  );

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.previewUrl)), [previews]);

  if (previews.length === 0) return null;
  return (
    <div className="album-upload-previews" aria-label="Yüklenecek fotoğraflar">
      {previews.map((image, index) => (
        <article key={image.id}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview before upload */}
          <img src={image.previewUrl} alt="" />
          <div>
            <strong>{index + 1}. {image.file.name}</strong>
            <small>{(image.file.size / 1024 / 1024).toFixed(1)} MB</small>
          </div>
          <span className="album-upload-preview-actions">
            <button type="button" onClick={() => onMove(image.id, -1)} disabled={index === 0} aria-label={`${image.file.name} dosyasını sola taşı`}><ArrowLeft size={14} /></button>
            <button type="button" onClick={() => onMove(image.id, 1)} disabled={index === previews.length - 1} aria-label={`${image.file.name} dosyasını sağa taşı`}><ArrowRight size={14} /></button>
            <button type="button" onClick={() => onRemove(image.id)} aria-label={`${image.file.name} dosyasını seçimden kaldır`}><Trash2 size={14} /></button>
          </span>
        </article>
      ))}
    </div>
  );
}

function ImageBatchPicker({
  images,
  setImages,
  disabled,
}: {
  images: SelectedImage[];
  setImages: React.Dispatch<React.SetStateAction<SelectedImage[]>>;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pickerError, setPickerError] = useState("");
  const addFiles = (files: File[]) => {
    const result = validateAndCreateSelection(files, images.length);
    if (result.error) {
      setPickerError(result.error);
      return;
    }
    setPickerError("");
    setImages((current) => [...current, ...result.images]);
  };

  return (
    <div className="album-batch-picker">
      <button
        className="album-drop-zone"
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles([...event.dataTransfer.files]);
        }}
      >
        <UploadCloud aria-hidden="true" size={31} />
        <strong>Fotoğrafları buraya sürükleyin</strong>
        <span>veya bilgisayarınızdan toplu olarak seçin</span>
        <small>JPEG, PNG, WebP · fotoğraf başına en fazla 8 MB · en fazla {MAX_FILES} fotoğraf</small>
      </button>
      <input
        className="album-file-input"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled}
        onChange={(event) => {
          addFiles([...(event.target.files ?? [])]);
          event.target.value = "";
        }}
      />
      {pickerError ? <p className="album-upload-error">{pickerError}</p> : null}
      <SelectedImageGrid
        images={images}
        onRemove={(id) => setImages((current) => current.filter((image) => image.id !== id))}
        onMove={(id, direction) => setImages((current) => {
          const index = current.findIndex((image) => image.id === id);
          const nextIndex = index + direction;
          if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
          const next = [...current];
          [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
          return next;
        })}
      />
    </div>
  );
}

export function ActivityAlbumUploader({
  mode,
  departments,
}: {
  mode: "general" | "department";
  departments: DepartmentOption[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectionKey, setCollectionKey] = useState<ActivityCollectionKey>("activities-social");
  const [departmentSlug, setDepartmentSlug] = useState(departments[0]?.slug ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string }>();

  const submit = async () => {
    if (!title.trim() || !description.trim() || images.length === 0) {
      setMessage({ type: "error", text: "Başlık, açıklama ve en az bir fotoğraf ekleyin." });
      return;
    }
    if (mode === "department" && !departmentSlug) {
      setMessage({ type: "error", text: "Albümün yayınlanacağı bölümü seçin." });
      return;
    }
    setIsUploading(true);
    setProgress(0);
    setMessage(undefined);
    try {
      const uploadedPhotos = await uploadSelectedImages(images, setProgress);
      const result = await createActivityAlbumAction({
        scope: mode,
        collectionKey: mode === "general" ? collectionKey : undefined,
        departmentSlug: mode === "department" ? departmentSlug : undefined,
        title,
        description,
        photos: uploadedPhotos,
      });
      if (!result.ok) throw new Error(result.message);
      setMessage({ type: "success", text: result.message });
      setImages([]);
      setTitle("");
      setDescription("");
      router.push(`/admin/faaliyetler/${result.albumId}?created=1`);
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Albüm yüklenemedi." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="activity-album-uploader">
      <div className="activity-album-fields">
        {mode === "general" ? (
          <label>
            Faaliyet türü
            <select value={collectionKey} onChange={(event) => setCollectionKey(event.target.value as ActivityCollectionKey)} disabled={isUploading}>
              <option value="activities-social">Sosyal faaliyet</option>
              <option value="activities-cultural">Kültürel faaliyet</option>
              <option value="activities-sport">Sportif faaliyet</option>
            </select>
          </label>
        ) : (
          <label>
            Yayınlanacağı bölüm
            <select value={departmentSlug} onChange={(event) => setDepartmentSlug(event.target.value)} disabled={isUploading}>
              {departments.map((department) => <option value={department.slug} key={department.slug}>{department.title} · {department.branch}</option>)}
            </select>
          </label>
        )}
        <label>
          Faaliyet / albüm başlığı
          <input value={title} onChange={(event) => setTitle(event.target.value)} disabled={isUploading} placeholder="Örn. Kimya Bölümü TÜBİTAK Proje Çalışması" />
        </label>
        <label className="admin-form-full">
          Kısa açıklama
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} disabled={isUploading} rows={3} placeholder="Faaliyetin amacını ve albümde neler görüleceğini yazın." />
        </label>
      </div>
      <ImageBatchPicker images={images} setImages={setImages} disabled={isUploading} />
      {message ? <p className={message.type === "error" ? "album-upload-error" : "album-upload-success"}>{message.text}</p> : null}
      {isUploading ? (
        <div className="album-upload-progress" aria-live="polite">
          <span><i style={{ width: `${progress}%` }} /></span>
          <strong><LoaderCircle className="is-spinning" size={16} /> Fotoğraflar yükleniyor · %{progress}</strong>
        </div>
      ) : null}
      <button className="admin-btn album-create-button" type="button" onClick={submit} disabled={isUploading || images.length === 0}>
        {isUploading ? <LoaderCircle className="is-spinning" aria-hidden="true" size={17} /> : <ImagePlus aria-hidden="true" size={17} />}
        {mode === "department" ? "Bölüm faaliyet albümünü yayınla" : "Yeni faaliyeti ve albümü yayınla"}
      </button>
    </div>
  );
}

export function ActivityAlbumPhotoAppender({ albumId }: { albumId: number }) {
  const router = useRouter();
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string }>();

  const submit = async () => {
    if (images.length === 0) return;
    setIsUploading(true);
    setProgress(0);
    setMessage(undefined);
    try {
      const photos = await uploadSelectedImages(images, setProgress);
      const result = await addPhotosToActivityAlbumAction({ albumId, photos });
      if (!result.ok) throw new Error(result.message);
      setMessage({ type: "success", text: result.message });
      setImages([]);
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Fotoğraflar eklenemedi." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="activity-album-uploader activity-album-uploader--append">
      <ImageBatchPicker images={images} setImages={setImages} disabled={isUploading} />
      {message ? (
        <p className={message.type === "error" ? "album-upload-error" : "album-upload-success"}>
          {message.type === "success" ? <CheckCircle2 aria-hidden="true" size={15} /> : null}{message.text}
        </p>
      ) : null}
      {isUploading ? <div className="album-upload-progress"><span><i style={{ width: `${progress}%` }} /></span><strong>%{progress}</strong></div> : null}
      <button className="admin-btn" type="button" onClick={submit} disabled={isUploading || images.length === 0}>
        <UploadCloud aria-hidden="true" size={16} /> Seçilen fotoğrafları albüme ekle
      </button>
    </div>
  );
}
