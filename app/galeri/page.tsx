import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getGalleryImages } from "../../lib/content";
import { getContentPage } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Fotoğraf Galerisi",
  description: "Dinamik Samsun kampüs, eğitim ve öğrenci yaşamından fotoğraflar.",
  alternates: { canonical: "/galeri" },
};

export default async function GalleryPage() {
  const [gallery, page] = await Promise.all([getGalleryImages(), getContentPage("gallery")]);
  const content = page.content;
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} description={content.heroDescription} image={content.heroImage} imageAlt={content.heroImageAlt} current="Galeri" />
      <section className="inner-section inner-section--soft" aria-labelledby="gallery-title">
        <div className="container">
          <div className="inner-section-header"><div><p className="inner-eyebrow">{content.introEyebrow}</p><h2 id="gallery-title">{content.introTitle}</h2></div><p>{content.introDescription}</p></div>
          <div className="gallery-masonry">{gallery.map((item) => <figure className="gallery-card" key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) calc(100vw - 48px), 45vw" /><figcaption>{item.caption ?? item.alt}</figcaption></figure>)}</div>
        </div>
      </section>
      <section className="inner-section"><div className="container cta-panel"><div><h2>{content.ctaTitle}</h2><p>{content.ctaDescription}</p></div><div className="cta-panel-actions"><Link className="button button--primary" href="/on-kayit">Ziyaret planla <ArrowRight size={16} /></Link></div></div></section>
    </InnerPageShell>
  );
}
