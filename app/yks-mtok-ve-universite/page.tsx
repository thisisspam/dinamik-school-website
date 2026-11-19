import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getContentPage } from "@/lib/cms/content";
import { parseContentRows, safeContentHref } from "@/lib/cms/helpers";
import { createPhoneHref } from "@/lib/phone";
import { InnerPageShell } from "../components/SiteChrome";
import "./yks-mtok.css";

export const metadata: Metadata = {
  title: "YKS - MTOK ve Üniversite",
  description:
    "MTOK kontenjanları, ön lisans ek puanı ve Dinamik Okulları’nın mesleki eğitimle üniversite hazırlığını buluşturan eğitim modeli.",
  alternates: { canonical: "/yks-mtok-ve-universite" },
};

const LANDLINE_DISPLAY = "0362 465 53 52-53";
const GENERAL_PHONE_DISPLAY = "0850 218 28 06";

export default async function YksMtokUniversityPage() {
  const page = await getContentPage("yks-mtok-university");
  const content = page.content;
  const activeFields = parseContentRows(content.activeFields, 3).map(
    ([title, description, href]) => ({
      title,
      description,
      href: safeContentHref(href, "/bolumler"),
    }),
  );
  const benefits = parseContentRows(content.benefits, 2).map(
    ([title, description]) => ({
      title,
      description,
    }),
  );
  const guideHref = safeContentHref(
    content.noticeLinkHref,
    "https://www.osym.gov.tr/",
  );
  const shouldRepeatProgramsPoster =
    content.heroImage !== content.programsImage;

  return (
    <InnerPageShell theme={page.theme}>
      <section className="mtok-hero" aria-labelledby="page-title">
        <div className="container mtok-hero-layout">
          <div className="mtok-hero-copy">
            <nav className="breadcrumbs" aria-label="Sayfa yolu">
              <Link href="/">Anasayfa</Link>
              <span aria-hidden="true">/</span>
              <span>YKS - MTOK ve Üniversite</span>
            </nav>
            <p className="inner-eyebrow inner-eyebrow--light">
              {content.heroEyebrow}
            </p>
            <h1 id="page-title">{content.heroTitle}</h1>
            <p>{content.heroDescription}</p>
            <div className="mtok-hero-actions">
              <a className="button button--primary" href="#mtok-programlari">
                Programları inceleyin
              </a>
              <Link className="mtok-hero-text-link" href="/on-kayit">
                Ön kayıt bilgisi <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <figure className="mtok-hero-poster">
            <Image
              src={content.heroImage}
              alt={content.heroImageAlt}
              width={1080}
              height={1080}
              priority
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 42vw, 490px"
            />
          </figure>
        </div>
      </section>

      <section className="inner-section mtok-intro" aria-labelledby="mtok-intro-title">
        <div className="container">
          <div className="mtok-intro-heading">
            <div>
              <p className="inner-eyebrow">{content.introEyebrow}</p>
              <h2 id="mtok-intro-title">{content.introTitle}</h2>
            </div>
            <p>{content.introDescription}</p>
          </div>

          <ol className="mtok-path" aria-label="Dinamik eğitim yolculuğu">
            <li>Mesleki yeterlilik</li>
            <li>YKS hazırlığı</li>
            <li>Üniversite hedefi</li>
          </ol>

          <div className="mtok-field-grid">
            {activeFields.map(({ title, description, href }) => (
              <Link
                className="mtok-field-card"
                href={href}
                key={title}
              >
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="mtok-field-link">
                  Alanı incele <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section inner-section--soft mtok-benefits" aria-labelledby="mtok-benefits-title">
        <div className="container">
          <div className="inner-section-header">
            <div>
              <p className="inner-eyebrow">{content.benefitsEyebrow}</p>
              <h2 id="mtok-benefits-title">{content.benefitsTitle}</h2>
            </div>
            <p>{content.benefitsDescription}</p>
          </div>

          <ul className="mtok-benefit-list">
            {benefits.map(({ title, description }) => (
              <li key={title}>
                <span className="mtok-benefit-mark" aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mtok-highlight">
            <small>Dinamik eğitim modeli</small>
            <strong>Hem güçlü bir meslek hem de üniversite hedefi aynı okulda!</strong>
          </div>
        </div>
      </section>

      <section
        className="inner-section mtok-visuals"
        id="mtok-programlari"
        aria-labelledby="mtok-visuals-title"
      >
        <div className="container">
          <div className="inner-section-header">
            <div>
              <p className="inner-eyebrow">{content.visualsEyebrow}</p>
              <h2 id="mtok-visuals-title">{content.visualsTitle}</h2>
            </div>
            <p>{content.visualsDescription}</p>
          </div>

          <div
            className={`mtok-poster-grid${shouldRepeatProgramsPoster ? "" : " mtok-poster-grid--single"}`}
          >
            <figure className="mtok-poster-card">
              <div className="mtok-poster-media">
                <Image
                  src={content.comparisonImage}
                  alt={content.comparisonImageAlt}
                  width={1080}
                  height={1080}
                  sizes="(max-width: 900px) calc(100vw - 40px), 46vw"
                />
              </div>
              <figcaption>
                <span>AYT karşılaştırması</span>
                <p>MTOK kontenjanlarının üniversite hedefindeki etkisini örnek netlerle inceleyin.</p>
              </figcaption>
            </figure>

            {shouldRepeatProgramsPoster ? (
              <figure className="mtok-poster-card">
                <div className="mtok-poster-media">
                  <Image
                    src={content.programsImage}
                    alt={content.programsImageAlt}
                    width={1080}
                    height={1080}
                    sizes="(max-width: 900px) calc(100vw - 40px), 46vw"
                  />
                </div>
                <figcaption>
                  <span>Lisans ve ön lisans programları</span>
                  <p>Üç eğitim alanıyla ilişkili MTOK ve ek puanlı programları bir arada görün.</p>
                </figcaption>
              </figure>
            ) : null}
          </div>

          <aside className="mtok-guide-note" aria-labelledby="mtok-guide-note-title">
            <div>
              <h3 id="mtok-guide-note-title">{content.noticeTitle}</h3>
              <p>{content.noticeDescription}</p>
            </div>
            <a href={guideHref} target="_blank" rel="noreferrer">
              {content.noticeLinkLabel} <ExternalLink size={15} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>

      <section className="inner-section inner-section--navy mtok-cta" aria-labelledby="mtok-cta-title">
        <div className="container mtok-cta-panel">
          <div className="mtok-cta-copy">
            <p className="inner-eyebrow inner-eyebrow--light">Özel Samsun Dinamik Mesleki ve Teknik Anadolu Lisesi</p>
            <h2 id="mtok-cta-title">{content.ctaTitle}</h2>
            <p>{content.ctaDescription}</p>
            <div className="cta-panel-actions">
              <Link className="button button--primary" href="/on-kayit">
                Ön kayıt talebi oluştur <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button button--outline-light" href="/iletisim">
                Okulumuzu ziyaret edin
              </Link>
            </div>
          </div>

          <address className="mtok-contact-card">
            <small>Bilgi ve kayıt için</small>
            <a href={createPhoneHref(LANDLINE_DISPLAY)}>{LANDLINE_DISPLAY}</a>
            <a href={createPhoneHref(GENERAL_PHONE_DISPLAY)}>{GENERAL_PHONE_DISPLAY}</a>
          </address>
        </div>
      </section>
    </InnerPageShell>
  );
}
