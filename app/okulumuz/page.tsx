import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, Shirt, Users } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { SchoolVideoGallery } from "../components/SchoolVideoGallery";
import { getContentPage } from "@/lib/cms/content";
import { parseContentRows, safeContentHref } from "@/lib/cms/helpers";

export const metadata: Metadata = {
  title: "Okulumuz",
  description:
    "Dinamik Mesleki ve Teknik Anadolu Lisesi Samsun kampüsü, eğitim yaklaşımı, kadrosu, rehberlik hizmetleri ve okul yaşamı.",
  alternates: { canonical: "/okulumuz" },
};

export default async function SchoolPage() {
  const page = await getContentPage("school");
  const content = page.content;
  const icons = [BookOpenCheck, Users, GraduationCap, Shirt];
  const schoolPages = parseContentRows(content.hubCards, 3).map(([title, text, href], index) => ({
    title,
    text,
    href: safeContentHref(href, "/"),
    icon: icons[index % icons.length],
  }));
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={content.heroImage}
        imageAlt={content.heroImageAlt}
        current="Okulumuz"
      />

      <SchoolVideoGallery content={content} />

      <section className="inner-section inner-section--soft" aria-labelledby="school-pages-title">
        <div className="container">
          <div className="inner-section-header">
            <div>
              <p className="inner-eyebrow">{content.hubEyebrow}</p>
              <h2 id="school-pages-title">{content.hubTitle}</h2>
            </div>
            <p>
              {content.hubDescription}
            </p>
          </div>
          <div className="school-hub-grid">
            {schoolPages.map(({ icon: Icon, title, text, href }) => (
              <Link className="school-hub-card" href={href} key={href}>
                <span className="school-hub-icon" aria-hidden="true"><Icon size={24} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="school-hub-link">
                  Sayfayı incele <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section" aria-labelledby="school-model-title">
        <div className="container editorial-grid">
          <div className="editorial-visual">
            <div className="image-frame">
              <Image
                src={content.modelImage}
                alt="Dinamik öğrencileri Kimya laboratuvarında analiz uygulaması yaparken"
                fill
                sizes="(max-width: 900px) calc(100vw - 48px), 46vw"
              />
            </div>
            <span className="image-frame-accent" aria-hidden="true" />
          </div>
          <div className="editorial-copy">
            <p className="inner-eyebrow">{content.modelEyebrow}</p>
            <h2 id="school-model-title">{content.modelTitle}</h2>
            <p>{content.modelDescription}</p>
            <div className="cta-panel-actions">
              <Link className="button button--primary" href="/bolumler">
                Bölümleri incele <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button button--secondary" href="/faaliyetlerimiz">
                Kampüs yaşamını keşfet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="inner-section inner-section--soft">
        <div className="container cta-panel">
          <div>
            <h2>{content.ctaTitle}</h2>
            <p>{content.ctaDescription}</p>
          </div>
          <div className="cta-panel-actions">
            <Link className="button button--primary" href={safeContentHref(content.ctaHref, "/on-kayit")}>
              {content.ctaLabel} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </InnerPageShell>
  );
}
