import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getDepartments } from "../data/departments";
import { getContentPage } from "@/lib/cms/content";
import { parseContentRows } from "@/lib/cms/helpers";

export const metadata: Metadata = {
  title: "Bölümlerimiz",
  description: "Dinamik Samsun'da eğitim verilen güncel mesleki ve teknik programları keşfedin.",
  alternates: { canonical: "/bolumler" },
};

function getDepartmentCardTitle(title: string) {
  return title.replace(/\s+BÖLÜMÜ$/i, "");
}

export default async function DepartmentsPage() {
  const [departments, page] = await Promise.all([getDepartments(), getContentPage("departments")]);
  const content = page.content;
  const modelIcons = [BookOpenCheck, GraduationCap, BriefcaseBusiness];
  const modelCards = parseContentRows(content.modelCards, 2).map(([title, text], index) => ({ title, text, icon: modelIcons[index % modelIcons.length] }));
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={content.heroImage}
        imageAlt={content.heroImageAlt}
        current="Bölümlerimiz"
      />

      <section className="inner-section" aria-labelledby="departments-index-title">
        <div className="container">
          <div className="inner-section-header">
            <div>
              <p className="inner-eyebrow">{content.introEyebrow}</p>
              <h2 id="departments-index-title">{content.introTitle}</h2>
            </div>
            <p>
              {content.introDescription}
            </p>
          </div>

          <div className="department-index-grid">
            {departments.map((department, index) => (
              <Link className={`department-index-card department-index-card--${department.accent}`} href={`/bolumler/${department.slug}`} key={department.slug}>
                <Image src={department.image} alt="" fill sizes="(max-width: 700px) calc(100vw - 48px), 32vw" />
                <span className="department-index-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="department-index-card-content">
                  <small>{department.branch}</small>
                  <h2>{getDepartmentCardTitle(department.title)}</h2>
                  <p>{department.lead}</p>
                  <span className="card-link">Programı keşfet <span><ArrowRight size={15} /></span></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section inner-section--soft" aria-labelledby="education-model-title">
        <div className="container">
          <div className="inner-section-header">
            <div><p className="inner-eyebrow">{content.modelEyebrow}</p><h2 id="education-model-title">{content.modelTitle}</h2></div>
            <p>{content.modelDescription}</p>
          </div>
          <div className="feature-card-grid">
            {modelCards.map(({ icon: Icon, title, text }) => (
              <article className="feature-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section inner-section--navy">
        <div className="container cta-panel">
          <div><h2>{content.ctaTitle}</h2><p>{content.ctaDescription}</p></div>
          <div className="cta-panel-actions"><Link className="button button--primary" href="/on-kayit">Ön kayıt talebi <ArrowRight size={16} /></Link><Link className="button button--outline-light" href="/iletisim">Bize ulaşın</Link></div>
        </div>
      </section>
    </InnerPageShell>
  );
}
