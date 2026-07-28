import { galleryAltTextsFor } from "./gallery-alt-texts";

export type AnimatedGalleryPhoto = {
  src: string;
  title: string;
  description: string;
  alt: string;
  albumId?: string;
  albumTitle?: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
};

export type AnimatedGalleryAlbum = {
  slug: string;
  title: string;
  description: string;
  photoCount: number;
  fit?: "cover" | "contain";
  objectPosition?: string;
};

export function createAlbumPhotos(
  basePath: string,
  albums: AnimatedGalleryAlbum[],
): AnimatedGalleryPhoto[] {
  return albums.flatMap((album) => {
    const altTexts = galleryAltTextsFor(album.slug, album.photoCount);

    return Array.from({ length: album.photoCount }, (_, index) => {
      const photoNumber = index + 1;

      return {
        src: `${basePath}/${album.slug}/${album.slug}-${String(photoNumber).padStart(2, "0")}.webp`,
        title: album.title,
        description: album.description,
        alt: altTexts[index],
        albumId: album.slug,
        albumTitle: album.title,
        fit: album.fit ?? "contain",
        objectPosition: album.objectPosition,
      };
    });
  });
}
