"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

export type AnimatedGalleryPhoto = {
  src: string;
  title: string;
  description: string;
  alt: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
};

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

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
    if (!isPlaying || !isInView || isPointerOver || prefersReducedMotion || photos.length < 2) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % photos.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isInView, isPlaying, isPointerOver, photos.length, prefersReducedMotion]);

  if (photos.length === 0) return null;

  const activePhoto = photos[activeIndex] ?? photos[0];
  const headingId = `${sectionId}-title`;
  const sectionClassName = ["biomedical-workshop-section", className].filter(Boolean).join(" ");
  const thumbnailGridStyle = { "--gallery-thumbnail-count": photos.length } as CSSProperties;
  const showPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + photos.length) % photos.length);
  };
  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % photos.length);
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
          ref={galleryRef}
          role="region"
          aria-roledescription="fotoğraf galerisi"
          aria-label={galleryLabel}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") showPrevious();
            if (event.key === "ArrowRight") showNext();
          }}
          onPointerEnter={() => setIsPointerOver(true)}
          onPointerLeave={() => setIsPointerOver(false)}
        >
          <div className="biomedical-workshop-stage">
            {activePhoto.fit === "contain" ? (
              <Image
                className="biomedical-workshop-backdrop"
                key={`${activePhoto.src}-backdrop`}
                src={activePhoto.src}
                alt=""
                fill
                sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) calc(100vw - 48px), 1120px"
                aria-hidden="true"
              />
            ) : null}
            <Image
              className={`biomedical-workshop-image${activePhoto.fit === "contain" ? " biomedical-workshop-image--contain" : ""}`}
              key={activePhoto.src}
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) calc(100vw - 48px), 1120px"
              style={{ objectPosition: activePhoto.objectPosition }}
            />
            <span className="biomedical-workshop-shade" aria-hidden="true" />

            <div className="biomedical-workshop-controls">
              <button type="button" onClick={showPrevious} aria-label={`Önceki ${galleryLabel.toLocaleLowerCase("tr-TR")} fotoğrafı`}>
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((currentValue) => !currentValue)}
                aria-label={isPlaying ? "Otomatik geçişi durdur" : "Otomatik geçişi başlat"}
                aria-pressed={!isPlaying}
              >
                {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
              </button>
              <button type="button" onClick={showNext} aria-label={`Sonraki ${galleryLabel.toLocaleLowerCase("tr-TR")} fotoğrafı`}>
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="biomedical-workshop-caption" aria-live={isPlaying ? "off" : "polite"}>
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
              <h3>{activePhoto.title}</h3>
              <p>{activePhoto.description}</p>
            </div>

            <div className="biomedical-workshop-progress" aria-hidden="true">
              <span
                key={`${activePhoto.src}-${isPlaying}-${isPointerOver}`}
                className={isPlaying && isInView && !isPointerOver && !prefersReducedMotion ? "is-running" : ""}
              />
            </div>
          </div>

          <div className="biomedical-workshop-thumbnails" aria-label={thumbnailLabel} style={thumbnailGridStyle}>
            {photos.map((photo, index) => (
              <button
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                key={photo.src}
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
