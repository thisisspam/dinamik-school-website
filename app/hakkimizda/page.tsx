import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  CircuitBoard,
  Factory,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { getDepartments } from "../data/departments";
import { getContentPage, contentPageThemeClass } from "@/lib/cms/content";
import { parseContentList, parseContentRows, safeContentHref } from "@/lib/cms/helpers";
import "./hakkimizda.css";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Dinamik Mesleki ve Teknik Anadolu Lisesi'nin eğitim yaklaşımı, vizyonu, misyonu ve kalite politikası.",
  alternates: { canonical: "/hakkimizda" },
};

export default async function AboutPage() {
  const [page, departments] = await Promise.all([getContentPage("about"), getDepartments()]);
  const content = page.content;
  const schoolStory = parseContentList(content.storyParagraphs);
  const modelIcons = [BookOpenCheck, Sparkles, Factory];
  const educationModel = parseContentRows(content.modelCards, 3).map(([tag, title, text], index) => ({
    number: String(index + 1).padStart(2, "0"),
    tag,
    title,
    text,
    icon: modelIcons[index % modelIcons.length],
  }));
  const fieldIcons = [FlaskConical, CircuitBoard, HeartPulse];
  const activeFields = departments.map((department, index) => ({
    title: department.shortTitle,
    branch: department.branch,
    icon: fieldIcons[index % fieldIcons.length],
    href: `/bolumler/${department.slug}`,
  }));
  const qualityPrinciples = parseContentList(content.qualityItems);
  const values = parseContentList(content.values);
  return (
    <div className={`about-shell${contentPageThemeClass(page.theme)}`}>
      <a className="skip-link" href="#about-content">İçeriğe geç</a>

      <SiteHeader />

      <main id="about-content">
        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-hero-media">
            <Image
              src={content.heroImage}
              alt={content.heroImageAlt}
              fill
              priority
              loading="eager"
              sizes="100vw"
            />
          </div>
          <div className="about-hero-wash" aria-hidden="true" />
          <div className="container about-hero-layout">
            <div className="about-hero-copy">
              <nav aria-label="Sayfa yolu" className="about-breadcrumbs">
                <Link href="/">Anasayfa</Link><span aria-hidden="true">/</span><span>Hakkımızda</span>
              </nav>
              <p className="about-kicker"><span aria-hidden="true" /> {content.heroEyebrow}</p>
              <h1 id="about-title">{content.heroTitle}</h1>
              <p className="about-hero-lead">{content.heroDescription}</p>
              <div className="about-hero-actions">
                <Link className="button button--primary" href={safeContentHref(content.heroPrimaryHref, "#egitim-yaklasimimiz")}>
                  {content.heroPrimaryLabel} <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link className="button about-button-outline" href={safeContentHref(content.heroSecondaryHref, "/bolumler")}>
                  {content.heroSecondaryLabel}
                </Link>
              </div>
            </div>

            <div className="about-hero-note">
              <span className="about-hero-note-icon"><ShieldCheck size={22} aria-hidden="true" /></span>
              <div><strong>{content.heroBadgeTitle}</strong><small>{content.heroBadgeText}</small></div>
            </div>
          </div>
        </section>

        <section className="about-profile" aria-labelledby="school-profile-title">
          <div className="container about-profile-grid">
            <div className="about-profile-heading">
              <p className="about-eyebrow">{content.storyEyebrow}</p>
              <h2 id="school-profile-title">{content.storyTitle}</h2>
              <div className="about-profile-meta" role="note" aria-label="Kuruluş bilgisi">
                <span>{content.storyYear}</span>
                <p>{content.storyYearText}</p>
              </div>
            </div>
            <div className="about-profile-content">
              {schoolStory.map((paragraph, index) => (
                <p className={index === 0 ? "about-profile-lead" : undefined} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="about-story" id="egitim-yaklasimimiz">
          <div className="container about-story-grid">
            <div className="about-story-visual">
              <div className="about-story-image about-story-image--main">
                <Image
                  src={content.approachImage}
                  alt="Kimya laboratuvarında analiz uygulaması yapan öğrenciler"
                  fill
                  sizes="(max-width: 800px) calc(100vw - 40px), 42vw"
                />
              </div>
              <div className="about-story-image about-story-image--secondary">
                <Image
                  src={content.approachSecondImage}
                  alt="Biyomedikal uygulama etkinliğinde devre üzerinde çalışan öğrenciler"
                  fill
                  sizes="(max-width: 600px) 42vw, 230px"
                />
              </div>
              <div className="about-story-badge">
                <span>3</span>
                <p>teknoloji alanında<br />uygulamalı eğitim</p>
              </div>
            </div>

            <div className="about-story-copy">
              <p className="about-eyebrow">{content.approachEyebrow}</p>
              <h2>{content.approachTitle}</h2>
              <p className="about-story-intro">{content.approachLead}</p>
              <p>{content.approachText}</p>

              <div className="about-field-list" role="group" aria-label="Eğitim verilen alan ve dallar">
                {activeFields.map(({ title, branch, icon: Icon, href }) => (
                  <Link href={href} className="about-field" key={title}>
                    <span><Icon size={19} aria-hidden="true" /></span>
                    <div><strong>{title}</strong><small>{branch}</small></div>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-model" aria-labelledby="model-title">
          <div className="container">
            <div className="about-model-heading">
              <div>
                <p className="about-eyebrow about-eyebrow--light">{content.modelEyebrow}</p>
                <h2 id="model-title">{content.modelTitle}</h2>
              </div>
              <p>
                {content.modelDescription}
              </p>
            </div>
            <div className="about-model-grid">
              {educationModel.map(({ number, tag, title, text, icon: Icon }) => (
                <article className="about-model-card" key={number}>
                  <span className="about-model-card-accent" aria-hidden="true" />
                  <div className="about-model-card-top">
                    <span><Icon size={23} aria-hidden="true" /></span><small>{number}</small>
                  </div>
                  <div className="about-model-card-body">
                    <span className="about-model-card-tag">{tag}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <div className="about-model-card-route" aria-hidden="true">
                    <span />
                    <ArrowRight size={15} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-purpose" aria-labelledby="purpose-title">
          <div className="container">
            <div className="about-purpose-heading">
              <div>
                <p className="about-eyebrow">{content.purposeEyebrow}</p>
                <h2 id="purpose-title">{content.purposeTitle}</h2>
              </div>
              <div className="about-purpose-intro">
                <p>
                  {content.purposeDescription}
                </p>
                <span><ShieldCheck size={18} aria-hidden="true" /> Değerlerle güçlenen eğitim</span>
              </div>
            </div>
            <div className="about-purpose-cards">
              <article className="about-purpose-card about-purpose-card--vision">
                <div className="about-purpose-card-top">
                  <span className="about-purpose-icon"><Target size={25} aria-hidden="true" /></span>
                  <span className="about-purpose-number" aria-hidden="true">01</span>
                </div>
                <p className="about-value-label">Vizyonumuz</p>
                <h3>{content.visionTitle}</h3>
                <p>{content.visionText}</p>
                <div className="about-purpose-card-footer">
                  <span>Geleceğe yön veren okul</span><ArrowUpRight size={17} aria-hidden="true" />
                </div>
              </article>
              <article className="about-purpose-card about-purpose-card--mission">
                <div className="about-purpose-card-top">
                  <span className="about-purpose-icon"><GraduationCap size={25} aria-hidden="true" /></span>
                  <span className="about-purpose-number" aria-hidden="true">02</span>
                </div>
                <p className="about-value-label">Misyonumuz</p>
                <h3>{content.missionTitle}</h3>
                <p>{content.missionText}</p>
                <div className="about-purpose-card-footer">
                  <span>Yetkin ve sorumlu bireyler</span><ArrowUpRight size={17} aria-hidden="true" />
                </div>
              </article>
            </div>
            <div className="about-purpose-values" role="list" aria-label="Eğitim kültürümüzün temel değerleri">
              {values.map((value) => (
                <span key={value} role="listitem"><Check size={14} aria-hidden="true" /> {value}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="about-quality" aria-labelledby="quality-title">
          <div className="container about-quality-grid">
            <div className="about-quality-copy">
              <p className="about-eyebrow">{content.qualityEyebrow}</p>
              <h2 id="quality-title">{content.qualityTitle}</h2>
              <p>{content.qualityDescription}</p>
              <div className="about-quality-signature">
                <ShieldCheck size={21} aria-hidden="true" />
                <span><strong>Öğrenci odaklı gelişim</strong><small>Kalıcı kalite, ortak sorumluluk</small></span>
              </div>
            </div>
            <ol className="about-quality-list">
              {qualityPrinciples.map((principle, index) => (
                <li key={principle}>
                  <span className="about-quality-number">{String(index + 1).padStart(2, "0")}</span>
                  <p>{principle}</p>
                  <span className="about-quality-check"><Check size={15} aria-hidden="true" /></span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="about-cta" aria-labelledby="about-cta-title">
          <div className="container about-cta-inner">
            <div className="about-cta-copy">
              <p className="about-eyebrow about-eyebrow--light">{content.ctaEyebrow}</p>
              <h2 id="about-cta-title">{content.ctaTitle}</h2>
              <p>{content.ctaDescription}</p>
              <div className="about-cta-actions">
                <Link className="button button--primary" href="/on-kayit">
                  Ön kayıt başvurusu <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link className="button about-button-light" href="/iletisim">Bize ulaşın</Link>
              </div>
            </div>
            <div className="about-cta-visual">
              <Image
                src={content.ctaImage}
                alt="Dinamik öğrencileri uygulamalı laboratuvar eğitiminde"
                fill
                sizes="(max-width: 900px) calc(100vw - 40px), 48vw"
              />
              <div className="about-cta-badge">
                <span><ShieldCheck size={21} aria-hidden="true" /></span>
                <div>
                  <small>Dinamik eğitim modeli</small>
                  <strong>4 yıl ücretsiz eğitim</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
