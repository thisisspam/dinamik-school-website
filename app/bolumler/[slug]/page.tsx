import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleX, Compass, Gauge, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerPageShell } from "../../components/SiteChrome";
import { PageHero } from "../../components/PageHero";
import { getDepartment, getDepartments } from "../../data/departments";
import type { DepartmentContentBlock } from "@/lib/department-blocks";
import { linesToList, linesToPairs, linesToTitledPairs } from "@/lib/textformat";

type DepartmentPageProps = { params: Promise<{ slug: string }> };

const CONTENT_ICONS = [Compass, Gauge, ShieldCheck];

function DepartmentContentBlockView({ block, isFirst }: { block: DepartmentContentBlock; isFirst: boolean }) {
  const headingId = `department-block-${block.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  if (block.type === "info-cards") {
    const facts = linesToPairs(block.content);
    return (
      <section className={`department-content-block department-content-block--info${isFirst ? " is-first" : ""}`} aria-labelledby={headingId}>
        <div className="container department-block-heading department-block-heading--compact"><p className="inner-eyebrow">Program bilgileri</p><h2 id={headingId}>{block.title}</h2></div>
        <div className="container metric-band-grid">
          {facts.map((fact, index) => {
            const Icon = CONTENT_ICONS[index % CONTENT_ICONS.length];
            return <div className="metric-band-item" key={`${block.id}-${index}`}><span className="metric-band-icon"><Icon size={21} /></span><span><small>{fact.label}</small><strong>{fact.value}</strong></span></div>;
          })}
        </div>
      </section>
    );
  }

  if (block.type === "branch-list") {
    const branches = linesToList(block.content);
    return (
      <section className={`department-branch-section department-content-block${isFirst ? " is-first" : ""}`} aria-labelledby={headingId}>
        <div className="container">
          <div className="department-block-heading"><p className="inner-eyebrow">Alan programı</p><h2 id={headingId}>{block.title}</h2></div>
          {block.footer ? <p className="department-branch-intro">{block.footer}</p> : null}
          <div className={`department-branch-grid${branches.length === 4 ? " department-branch-grid--four" : ""}`} role="list">
            {branches.map((branch, index) => {
              const unavailable = branch.includes("VERİLMEMEKTEDİR");
              const Icon = unavailable ? CircleX : CheckCircle2;
              return (
                <article className={`department-branch-card${unavailable ? " is-unavailable" : " is-active"}`} key={`${block.id}-${index}`} role="listitem">
                  <span className="department-branch-icon"><Icon size={22} aria-hidden="true" /></span>
                  <span><small>{unavailable ? "Okulumuzda eğitim verilmeyen dal" : "Okulumuzda eğitim verilen dal"}</small><strong>{branch}</strong></span>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "skills") {
    return (
      <section className="inner-section department-content-block" aria-labelledby={headingId}>
        <div className="container department-list-block">
          <div className="department-block-heading"><p className="inner-eyebrow">Beceriler</p><h2 id={headingId}>{block.title}</h2></div>
          <ul className="check-list-grid">
            {linesToList(block.content).map((skill, index) => <li key={`${block.id}-${index}`}><CheckCircle2 size={17} aria-hidden="true" />{skill}</li>)}
          </ul>
          {block.footer ? <p className="department-list-footer">{block.footer}</p> : null}
        </div>
      </section>
    );
  }

  if (block.type === "learning-cards") {
    return (
      <section className="inner-section inner-section--soft department-content-block" aria-labelledby={headingId}>
        <div className="container">
          <div className="department-block-heading"><p className="inner-eyebrow">Öğrenme alanları</p><h2 id={headingId}>{block.title}</h2></div>
          <div className="detail-skill-grid">
            {linesToTitledPairs(block.content).map((area, index) => {
              const Icon = CONTENT_ICONS[index % CONTENT_ICONS.length];
              return <article className="detail-skill-card" key={`${block.id}-${index}`}><span><Icon size={23} /></span><h3>{area.title}</h3><p>{area.text}</p></article>;
            })}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "career-tags") {
    return (
      <section className="inner-section inner-section--navy department-content-block" aria-labelledby={headingId}>
        <div className="container editorial-grid editorial-grid--reverse">
          <div className="editorial-visual"><div className="image-frame image-frame--landscape"><Image src="/images/about-school-campus.png" alt="Dinamik Okulları kampüsü" fill sizes="(max-width: 900px) calc(100vw - 48px), 46vw" /></div></div>
          <div className="editorial-copy editorial-copy--light">
            <p className="inner-eyebrow inner-eyebrow--light">Kariyer rotası</p>
            <h2 id={headingId}>{block.title}</h2>
            <div className="career-cloud">{linesToList(block.content).map((area, index) => <span key={`${block.id}-${index}`}>{area}</span>)}</div>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "highlight") {
    return (
      <section className="inner-section department-content-block department-highlight-section" aria-labelledby={headingId}>
        <div className="container department-highlight-card">
          <span className="department-highlight-icon"><Gauge size={26} aria-hidden="true" /></span>
          <div><p className="inner-eyebrow">Program bilgisi</p><h2 id={headingId}>{block.title}</h2><p>{block.content}</p></div>
        </div>
      </section>
    );
  }

  return (
    <section className="inner-section department-content-block" aria-labelledby={headingId}>
      <div className="container department-text-block">
        <div className="department-block-heading"><p className="inner-eyebrow">Bilgiler</p><h2 id={headingId}>{block.title}</h2></div>
        <div className="department-text-block-copy">{linesToList(block.content).map((paragraph, index) => <p key={`${block.id}-${index}`}>{paragraph}</p>)}</div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map((department) => ({ slug: department.slug }));
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const department = await getDepartment(slug);
  if (!department) return {};
  return {
    title: department.title,
    description: `${department.title} - ${department.branch}. Programın uygulama alanlarını ve kazandırdığı yetkinlikleri keşfedin.`,
    alternates: { canonical: `/bolumler/${department.slug}` },
  };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = await getDepartment(slug);
  if (!department) notFound();
  const hasDetailedProgramContent = department.contentBlocks.some((block) => block.type === "branch-list");
  const heroIntroBlock = department.contentBlocks[0]?.id === "field-purpose" && department.contentBlocks[0].type === "text"
    ? department.contentBlocks[0]
    : undefined;
  const visibleContentBlocks = heroIntroBlock ? department.contentBlocks.slice(1) : department.contentBlocks;

  return (
    <InnerPageShell>
      <PageHero eyebrow={heroIntroBlock?.title ?? department.branch} title={department.title} description={heroIntroBlock?.content ?? department.lead} image={department.image} current={department.shortTitle} accent={department.accent} />

      {hasDetailedProgramContent ? (
        <div className="department-program-flow">
          {visibleContentBlocks.map((block, index) => <DepartmentContentBlockView block={block} isFirst={index === 0} key={block.id} />)}
        </div>
      ) : (
        <>
          {department.contentBlocks[0]?.type === "info-cards" ? <DepartmentContentBlockView block={department.contentBlocks[0]} isFirst /> : null}

          <section className="inner-section">
            <div className="container editorial-grid">
              <div className="editorial-visual">
                <div className="image-frame"><Image src={department.image} alt={`${department.title} uygulamalı eğitim ortamı`} fill sizes="(max-width: 900px) calc(100vw - 48px), 46vw" /></div>
                <span className="image-frame-accent" aria-hidden="true" />
              </div>
              <div className="editorial-copy">
                <p className="inner-eyebrow">Programın amacı</p>
                <h2>Teknik bilgiyi güvenli, dikkatli ve üretken bir çalışma kültürüne dönüştür.</h2>
                <p>{department.purpose}</p>
              </div>
            </div>
          </section>

          {department.contentBlocks.map((block, index) => (
            index === 0 && block.type === "info-cards" ? null : <DepartmentContentBlockView block={block} isFirst={false} key={block.id} />
          ))}

          <section className="inner-section">
            <div className="container cta-panel">
              <div><h2>{department.shortTitle} programını yerinde keşfet.</h2><p>Atölyeleri görmek, programla ilgili sorularını sormak ve kayıt sürecini öğrenmek için okulumuza ulaş.</p></div>
              <div className="cta-panel-actions"><Link className="button button--primary" href="/on-kayit">Ön kayıt <ArrowRight size={16} /></Link><Link className="button button--outline-light" href="/bolumler">Diğer bölümler</Link></div>
            </div>
          </section>
        </>
      )}
    </InnerPageShell>
  );
}
