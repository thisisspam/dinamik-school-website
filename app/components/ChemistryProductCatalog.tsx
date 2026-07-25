"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PRODUCT_GROUPS = [
  "Bulaşık deterjanı",
  "Sıvı el sabunu",
  "Çamaşır suyu",
  "Kıvamlı çamaşır suyu",
  "Köpük sabun",
  "Yüzey temizleyici",
  "Cam temizleme sıvısı",
  "Limon kolonyası",
  "Oda kokusu",
];

export function ChemistryProductCatalog() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isCatalogOpen) return;

    const previousOverflow = document.body.style.overflow;
    const openButton = openButtonRef.current;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCatalogOpen(false);
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      openButton?.focus();
    };
  }, [isCatalogOpen]);

  return (
    <>
      <section className="inner-section chemistry-product-catalog-section" aria-labelledby="chemistry-product-catalog-title">
        <div className="container chemistry-product-catalog-layout">
          <div className="chemistry-product-catalog-copy">
            <p className="inner-eyebrow">Üretimden markaya</p>
            <h2 id="chemistry-product-catalog-title">Uygulamalı üretim, gerçek ürünlere dönüşüyor.</h2>
            <p>
              DinamiKimya ürün kataloğu; Kimya Teknolojileri Bölümünde ele alınan formül hazırlama,
              üretim, kalite kontrol, dolum ve ambalajlama adımlarının ürün yelpazesindeki karşılığını
              bir arada gösteriyor.
            </p>
            <ul aria-label="Katalogdaki ürün grupları">
              {PRODUCT_GROUPS.map((productGroup) => <li key={productGroup}>{productGroup}</li>)}
            </ul>
          </div>

          <figure className="chemistry-product-catalog-figure">
            <button
              ref={openButtonRef}
              className="chemistry-product-catalog-link"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isCatalogOpen}
              onClick={() => setIsCatalogOpen(true)}
            >
              <Image
                src="/images/departments/chemistry/dinamikimya-urun-katalogu.webp"
                alt="DinamiKimya profesyonel temizlik çözümleri kataloğu; ürün grupları ve okul binası"
                width={1024}
                height={1536}
                sizes="(max-width: 900px) calc(100vw - 64px), 520px"
                quality={90}
              />
              <span><Maximize2 size={15} aria-hidden="true" /> Büyük boyutta incele</span>
            </button>
            <figcaption>DinamiKimya profesyonel temizlik çözümleri ve ürün grupları.</figcaption>
          </figure>
        </div>
      </section>

      {isCatalogOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="chemistry-catalog-lightbox"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setIsCatalogOpen(false);
              }}
            >
              <div
                className="chemistry-catalog-lightbox-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="chemistry-catalog-lightbox-title"
              >
                <div className="chemistry-catalog-lightbox-header">
                  <h2 id="chemistry-catalog-lightbox-title">DinamiKimya Ürün Kataloğu</h2>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Ürün kataloğunu kapat"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    <X size={22} aria-hidden="true" />
                  </button>
                </div>
                <div className="chemistry-catalog-lightbox-stage">
                  <Image
                    src="/images/departments/chemistry/dinamikimya-urun-katalogu.webp"
                    alt="DinamiKimya profesyonel temizlik çözümleri ürün kataloğunun büyük boy görünümü"
                    width={1024}
                    height={1536}
                    sizes="(max-width: 700px) calc(100vw - 48px), 1024px"
                    quality={92}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
