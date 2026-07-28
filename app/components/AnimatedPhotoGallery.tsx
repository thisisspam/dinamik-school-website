"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AnimatedGalleryPhoto } from "../data/animated-gallery";

export type { AnimatedGalleryPhoto } from "../data/animated-gallery";

type AnimatedPhotoGalleryProps = {
  sectionId: string;
  eyebrow: string;
  title: string;
  description: string;
  galleryLabel: string;
  thumbnailLabel: string;
  photos: AnimatedGalleryPhoto[];
  className?: string;
};

const AUTOPLAY_DELAY = 5_500;
const DEFAULT_ALBUM_ID = "gallery-album";

type GalleryAlbum = {
  id: string;
  title: string;
  photos: AnimatedGalleryPhoto[];
};

function groupPhotosByAlbum(photos: AnimatedGalleryPhoto[], galleryLabel: string): GalleryAlbum[] {
  const albums = new Map<string, GalleryAlbum>();

  photos.forEach((photo) => {
    const albumId = photo.albumId ?? DEFAULT_ALBUM_ID;
    const currentAlbum = albums.get(albumId);

    if (currentAlbum) {
      currentAlbum.photos.push(photo);
      return;
    }

    albums.set(albumId, {
      id: albumId,
      title: photo.albumTitle ?? galleryLabel,
      photos: [photo],
    });
  });

  return Array.from(albums.values());
}

export function AnimatedPhotoGallery({
  sectionId,
  eyebrow,
  title,
  description,
  galleryLabel,
  thumbnailLabel,
  photos,
  className,
}: AnimatedPhotoGalleryProps) {
  const albums = useMemo(() => groupPhotosByAlbum(photos, galleryLabel), [galleryLabel, photos]);
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);
  const albumListRef = useRef<HTMLDivElement>(null);
  const activeAlbumRef = useRef<HTMLButtonElement>(null);
  const activeAlbum = albums[activeAlbumIndex] ?? albums[0];
  const activePhotos = activeAlbum?.photos ?? [];
  const activePhoto = activePhotos[activeIndex] ?? activePhotos[0];
  const canAnimate = activePhotos.length > 1;
  const hasAlbumPlaylist = albums.length > 1;
  const stageImageSizes = hasAlbumPlaylist
    ? "(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) calc(100vw - 330px), 850px"
    : "(max-width: 760px) calc(100vw - 32px), (max-width: 1328px) calc(100vw - 48px), 1280px";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const galleryElement = galleryRef.current;
    if (!galleryElement || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(galleryElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isInView || isPointerOver || prefersReducedMotion || !canAnimate) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % activePhotos.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, activePhotos.length, canAnimate, isInView, isPlaying, isPointerOver, prefersReducedMotion]);

  useEffect(() => {
    const thumbnailStrip = thumbnailStripRef.current;
    const activeThumbnail = activeThumbnailRef.current;
    if (!thumbnailStrip || !activeThumbnail) return;

    const centeredPosition = activeThumbnail.offsetLeft
      - (thumbnailStrip.clientWidth - activeThumbnail.clientWidth) / 2;

    thumbnailStrip.scrollTo({
      left: Math.max(0, centeredPosition),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, prefersReducedMotion]);

  useEffect(() => {
    const albumList = albumListRef.current;
    const activeAlbumButton = activeAlbumRef.current;
    if (!albumList || !activeAlbumButton) return;

    const centeredPosition = activeAlbumButton.offsetTop
      - (albumList.clientHeight - activeAlbumButton.clientHeight) / 2;

    albumList.scrollTo({
      top: Math.max(0, centeredPosition),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeAlbumIndex, prefersReducedMotion]);

  if (!activeAlbum || !activePhoto) return null;

  const headingId = `${sectionId}-title`;
  const sectionClassName = ["biomedical-workshop-section", className].filter(Boolean).join(" ");
  const showPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + activePhotos.length) % activePhotos.length);
  };
  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % activePhotos.length);
  };
  const selectAlbum = (albumIndex: number) => {
    setActiveAlbumIndex(albumIndex);
    setActiveIndex(0);
  };

  return (
    <section className={sectionClassName} id={sectionId} aria-labelledby={headingId}>
      <div className="container">
        <div className="biomedical-workshop-heading">
          <div>
            <p className="inner-eyebrow inner-eyebrow--light">{eyebrow}</p>
            <h2 id={headingId}>{title}</h2>
          </div>
          <p>{description}</p>
        </div>

        <div
          className="biomedical-workshop-gallery"
          id={`${sectionId}-galeri`}
          ref={galleryRef}
          role="region"
          aria-roledescription="fotoğraf galerisi"
          aria-label={galleryLabel}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft") showPrevious();
            if (event.key === "ArrowRight") showNext();
          }}
          onPointerEnter={() => setIsPointerOver(true)}
          onPointerLeave={() => setIsPointerOver(false)}
        >
          <div className={`biomedical-workshop-player${hasAlbumPlaylist ? "" : " biomedical-workshop-player--single-album"}`}>
            <div className="biomedical-workshop-stage">
              {activePhoto.fit === "contain" ? (
                <Image
                  className="biomedical-workshop-backdrop"
                  key={`${activePhoto.src}-backdrop`}
                  src={activePhoto.src}
                  alt=""
                  fill
                  sizes={stageImageSizes}
                  aria-hidden="true"
                />
              ) : null}
              <Image
                className={`biomedical-workshop-image${activePhoto.fit === "contain" ? " biomedical-workshop-image--contain" : ""}`}
                key={activePhoto.src}
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                sizes={stageImageSizes}
                style={{ objectPosition: activePhoto.objectPosition }}
              />
              <span className="biomedical-workshop-shade" aria-hidden="true" />

              <div className="biomedical-workshop-controls">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label={`Önceki ${galleryLabel.toLocaleLowerCase("tr-TR")} fotoğrafı`}
                  disabled={!canAnimate}
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((currentValue) => !currentValue)}
                  aria-label={canAnimate ? (isPlaying ? "Otomatik geçişi durdur" : "Otomatik geçişi başlat") : "Bu albümde tek fotoğraf var"}
                  aria-pressed={!isPlaying}
                  disabled={!canAnimate}
                >
                  {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label={`Sonraki ${galleryLabel.toLocaleLowerCase("tr-TR")} fotoğrafı`}
                  disabled={!canAnimate}
                >
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="biomedical-workshop-caption" aria-live={isPlaying ? "off" : "polite"}>
                <span>{String(activeIndex + 1).padStart(2, "0")} / {String(activePhotos.length).padStart(2, "0")}</span>
                <h3>{activePhoto.title}</h3>
                <p>{activePhoto.description}</p>
              </div>

              <div className="biomedical-workshop-progress" aria-hidden="true">
                <span
                  key={`${activeAlbum.id}-${activePhoto.src}-${isPlaying}-${isPointerOver}`}
                  className={isPlaying && isInView && !isPointerOver && !prefersReducedMotion && canAnimate ? "is-running" : ""}
                />
              </div>
            </div>

            {hasAlbumPlaylist ? (
              <aside className="biomedical-workshop-albums" aria-label={`${galleryLabel} albümleri`}>
                <div className="biomedical-workshop-albums-heading">
                  <strong>Albümler</strong>
                  <span>{albums.length} albüm</span>
                </div>
                <div className="biomedical-workshop-album-list" ref={albumListRef}>
                  {albums.map((album, albumIndex) => {
                    const coverPhoto = album.photos[0];
                    const isActiveAlbum = albumIndex === activeAlbumIndex;

                    return (
                      <button
                        className={isActiveAlbum ? "is-active" : ""}
                        type="button"
                        key={album.id}
                        ref={isActiveAlbum ? activeAlbumRef : undefined}
                        onClick={() => selectAlbum(albumIndex)}
                        aria-label={`${album.title} albümünü seç, ${album.photos.length} fotoğraf`}
                        aria-pressed={isActiveAlbum}
                      >
                        <span className="biomedical-workshop-album-cover">
                          <Image
                            src={coverPhoto.src}
                            alt=""
                            fill
                            sizes="(max-width: 900px) 160px, 112px"
                            style={{ objectPosition: coverPhoto.objectPosition }}
                          />
                        </span>
                        <span className="biomedical-workshop-album-copy">
                          <strong>{album.title}</strong>
                          <small>{album.photos.length} fotoğraf</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            ) : null}
          </div>

          <div
            className="biomedical-workshop-thumbnails"
            role="group"
            aria-label={`${activeAlbum.title}: ${thumbnailLabel}`}
            ref={thumbnailStripRef}
          >
            {activePhotos.map((photo, index) => (
              <button
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                key={photo.src}
                ref={index === activeIndex ? activeThumbnailRef : undefined}
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}. fotoğraf: ${photo.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <span className="biomedical-workshop-thumbnail-image">
                  <Image src={photo.src} alt="" fill sizes="160px" style={{ objectPosition: photo.objectPosition }} />
                </span>
                <span>{photo.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
