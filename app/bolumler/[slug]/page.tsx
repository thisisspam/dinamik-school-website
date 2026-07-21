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

type HeadingImage = { src: string; alt: string };

// Per-department photos rendered as the background of each section heading,
// keyed by content-block id. Distributing the real workshop/lab photos behind
// the headings ties each program section to a genuine campus visual.
const departmentHeadingImages: Record<string, Record<string, HeadingImage>> = {
  "biyomedikal-cihaz-teknolojileri": {
    "field-definition": {
      src: "/images/departments/biomedical/xray-system.jpeg",
      alt: "Röntgen cihazının bulunduğu uygulama odası",
    },
    "imaging-definition": {
      src: "/images/departments/biomedical/imaging-corridor.jpeg",
      alt: "Tıbbi görüntüleme temalı duvar çizimleriyle atölye koridoru",
    },
    "duties": {
      src: "/images/departments/biomedical/measurement-equipment.jpeg",
      alt: "Güç kaynağı, osiloskop ve ölçüm cihazlarının bulunduğu laboratuvar masası",
    },
    "candidate-qualities": {
      src: "/images/departments/biomedical/applied-workshop.jpeg",
      alt: "Öğrencilerin lehimleme yaparak devre kartı hazırladığı atölye çalışması",
    },
  },
};

// Full-section background photo (behind the whole content block) with a dark
// overlay so the heading text and cards stay legible on top.
function SectionMedia({ image }: { image?: HeadingImage }) {
  if (!image) return null;
  return (
    <>
      <Image className="department-section-media-img" src={image.src} alt={image.alt} fill sizes="100vw" />
      <span className="department-section-media-overlay" aria-hidden="true" />
    </>
  );
}

function BlockHeading({
  eyebrow,
  title,
  headingId,
  light,
  compact,
}: {
  eyebrow: string;
  title: string;
  headingId: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`department-block-heading${compact ? " department-block-heading--compact" : ""}`}>
      <p className={`inner-eyebrow${light ? " inner-eyebrow--light" : ""}`}>{eyebrow}</p>
      <h2 id={headingId}>{title}</h2>
    </div>
  );
}

function DepartmentContentBlockView({ block, isFirst, headingImage }: { block: DepartmentContentBlock; isFirst: boolean; headingImage?: HeadingImage }) {
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
      <section className={`department-branch-section department-content-block${isFirst ? " is-first" : ""}${headingImage ? " department-content-block--media" : ""}`} aria-labelledby={headingId}>
        <SectionMedia image={headingImage} />
        <div className="container">
          <BlockHeading eyebrow="Alan programı" title={block.title} headingId={headingId} light={Boolean(headingImage)} />
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
      <section className={`inner-section department-content-block${headingImage ? " department-content-block--media" : ""}`} aria-labelledby={headingId}>
        <SectionMedia image={headingImage} />
        <div className="container department-list-block">
          <BlockHeading eyebrow="Beceriler" title={block.title} headingId={headingId} light={Boolean(headingImage)} />
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
    <section className={`inner-section department-content-block${headingImage ? " department-content-block--media" : ""}`} aria-labelledby={headingId}>
      <SectionMedia image={headingImage} />
      <div className="container department-text-block">
        <BlockHeading eyebrow="Bilgiler" title={block.title} headingId={headingId} light={Boolean(headingImage)} />
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
  const headingImages = departmentHeadingImages[department.slug];

  return (
    <InnerPageShell>
      <PageHero eyebrow={heroIntroBlock?.title ?? department.branch} title={department.title} description={heroIntroBlock?.content ?? department.lead} image={department.image} current={department.shortTitle} accent={department.accent} />

      {hasDetailedProgramContent ? (
        <div className="department-program-flow">
          {visibleContentBlocks.map((block, index) => <DepartmentContentBlockView block={block} isFirst={index === 0} headingImage={headingImages?.[block.id]} key={block.id} />)}
        </div>
      ) : (
        <>
          {department.contentBlocks[0]?.type === "info-cards" ? <DepartmentContentBlockView block={department.contentBlocks[0]} isFirst headingImage={headingImages?.[department.contentBlocks[0].id]} /> : null}

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
            index === 0 && block.type === "info-cards" ? null : <DepartmentContentBlockView block={block} isFirst={false} headingImage={headingImages?.[block.id]} key={block.id} />
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
