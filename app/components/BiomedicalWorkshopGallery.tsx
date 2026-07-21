"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type WorkshopPhoto = {
  src: string;
  title: string;
  description: string;
  alt: string;
};

const AUTOPLAY_DELAY = 5_500;

const WORKSHOP_PHOTOS: WorkshopPhoto[] = [
  {
    src: "/images/departments/biomedical/workshops/tibbi-goruntuleme-cihazlari-atolyesi.jpeg",
    title: "Tıbbi Görüntüleme Cihazları Atölyesi",
    description: "Görüntüleme cihazlarının bileşenlerini ve çalışma ilkelerini gerçek sistemler üzerinden tanıma alanı.",
    alt: "Tıbbi görüntüleme cihazları atölyesinde tomografi cihazı ve uygulama masaları",
  },
  {
    src: "/images/departments/biomedical/workshops/kalibrasyon-atolyesi.jpeg",
    title: "Kalibrasyon Atölyesi",
    description: "Ölçüm, test ve kalibrasyon süreçlerinin profesyonel cihazlarla uygulandığı teknik çalışma ortamı.",
    alt: "Kalibrasyon atölyesinde osiloskoplar, güç kaynakları ve lehimleme istasyonları",
  },
  {
    src: "/images/departments/biomedical/workshops/bilgisayar-laboratuvari.jpeg",
    title: "Bilgisayar Laboratuvarı",
    description: "Teknik dokümantasyon, cihaz yazılımları ve dijital analiz çalışmalarını destekleyen laboratuvar.",
    alt: "Bilgisayar laboratuvarında çalışma istasyonları ve yeşil öğrenci sandalyeleri",
  },
  {
    src: "/images/departments/biomedical/workshops/baski-devre-lehimleme-atolyesi.jpeg",
    title: "Baskı Devre ve Lehimleme Atölyesi",
    description: "Elektronik devrelerin hazırlanması, montajı ve temel arıza kontrolü için düzenlenen uygulama alanı.",
    alt: "Baskı devre ve lehimleme atölyesindeki çalışma masaları ve eğitim panoları",
  },
  {
    src: "/images/departments/biomedical/workshops/mesleki-fizyoloji-atolyesi.jpeg",
    title: "Mesleki Fizyoloji ve Terminoloji Atölyesi",
    description: "İnsan anatomisi ile tıbbi cihazlar arasındaki ilişkiyi modeller üzerinden kuran öğrenme ortamı.",
    alt: "Mesleki fizyoloji ve terminoloji atölyesinde anatomi modelleri ve uygulama masaları",
  },
  {
    src: "/images/departments/biomedical/workshops/tibbi-goruntuleme-sistemleri-atolyesi.jpeg",
    title: "Tıbbi Görüntüleme Sistemleri Atölyesi",
    description: "Röntgen, tomografi, MR ve ultrason sistemlerinin birlikte ele alındığı kapsamlı uygulama atölyesi.",
    alt: "Tıbbi görüntüleme sistemleri atölyesinde röntgen düzeneği ve sistem eğitim panosu",
  },
];

export function BiomedicalWorkshopGallery() {
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
    if (!isPlaying || !isInView || isPointerOver || prefersReducedMotion) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % WORKSHOP_PHOTOS.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isInView, isPlaying, isPointerOver, prefersReducedMotion]);

  const activePhoto = WORKSHOP_PHOTOS[activeIndex];
  const showPrevious = () => setActiveIndex((activeIndex - 1 + WORKSHOP_PHOTOS.length) % WORKSHOP_PHOTOS.length);
  const showNext = () => setActiveIndex((activeIndex + 1) % WORKSHOP_PHOTOS.length);

  return (
    <section className="biomedical-workshop-section" aria-labelledby="biomedical-workshop-title">
      <div className="container">
        <div className="biomedical-workshop-heading">
          <div>
            <p className="inner-eyebrow inner-eyebrow--light">Biyomedikal atölyeleri</p>
            <h2 id="biomedical-workshop-title">Sağlık teknolojisinin geleceği, bu atölyelerde üretilir.</h2>
          </div>
          <p>
            Tıbbi görüntülemeden kalibrasyona, elektronik devrelerden mesleki fizyolojiye uzanan
            uygulama alanlarımızda teknik bilgi gerçek cihazlarla deneyime dönüşür.
          </p>
        </div>

        <div
          className="biomedical-workshop-gallery"
          ref={galleryRef}
          role="region"
          aria-roledescription="fotoğraf galerisi"
          aria-label="Biyomedikal cihaz teknolojileri atölyeleri"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") showPrevious();
            if (event.key === "ArrowRight") showNext();
          }}
          onPointerEnter={() => setIsPointerOver(true)}
          onPointerLeave={() => setIsPointerOver(false)}
        >
          <div className="biomedical-workshop-stage">
            <Image
              className="biomedical-workshop-image"
              key={activePhoto.src}
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) calc(100vw - 48px), 1120px"
            />
            <span className="biomedical-workshop-shade" aria-hidden="true" />

            <div className="biomedical-workshop-controls">
              <button type="button" onClick={showPrevious} aria-label="Önceki atölye fotoğrafı">
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
              <button type="button" onClick={showNext} aria-label="Sonraki atölye fotoğrafı">
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="biomedical-workshop-caption" aria-live={isPlaying ? "off" : "polite"}>
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(WORKSHOP_PHOTOS.length).padStart(2, "0")}</span>
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

          <div className="biomedical-workshop-thumbnails" aria-label="Atölye fotoğrafları">
            {WORKSHOP_PHOTOS.map((photo, index) => (
              <button
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                key={photo.src}
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}. fotoğraf: ${photo.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <span className="biomedical-workshop-thumbnail-image">
                  <Image src={photo.src} alt="" fill sizes="160px" />
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
