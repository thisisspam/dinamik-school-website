import type { LucideIcon } from "lucide-react";
import { Children, isValidElement, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, SiteFooter, SiteHeader } from "./components/SiteChrome";
import { RegistrationForm } from "./components/RegistrationForm";
import { getDepartments } from "./data/departments";
import { getHomepageSections, getSiteSettings, type HomepageSection } from "../lib/content";
import { createWhatsappHref } from "../lib/whatsapp";
import { parseContentList, parseContentRows, safeContentHref } from "@/lib/cms/helpers";
import { getContentPage } from "@/lib/cms/content";
import {
  parseHomepageFeatureCards,
  type HomepageFeatureIcon,
} from "@/lib/cms/homepage-feature-cards";
import { parseHomepageHeroTiles } from "@/lib/cms/homepage-hero-tiles";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Clock3,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  School,
  ShieldCheck,
  Trophy,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

// Homepage sections are ordered and edited from the database. Rendering this
// route dynamically prevents a production build snapshot from masking admin
// changes until the next deployment.
export const dynamic = "force-dynamic";

type LinkItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type Department = {
  slug: string;
  title: string;
  branch: string;
  description: string;
  image: string;
  icon: LucideIcon;
  accent: "teal" | "blue" | "green";
};

// Homepage teaser copy per department: the icon, accent color and short
// blurb are a homepage-only design choice, distinct from the fuller profile
// on the department detail page. Title/branch/image below are placeholders —
// they're overwritten with the admin-managed values in Home() below.
const departmentTeasers: Record<string, Omit<Department, "title" | "branch" | "image">> = {
  "kimya-teknolojileri": {
    slug: "kimya-teknolojileri",
    description:
      "Numune alma, klasik ve cihazlı analizler ile güvenli laboratuvar uygulamalarını bir araya getiren mesleki eğitim.",
    icon: FlaskConical,
    accent: "teal",
  },
  "elektrik-elektronik-teknolojileri": {
    slug: "elektrik-elektronik-teknolojileri",
    description:
      "Devre, simülasyon, tesisat projesi, kuvvet-kumanda panoları ve test uygulamalarına odaklanan program.",
    icon: CircuitBoard,
    accent: "blue",
  },
  "biyomedikal-cihaz-teknolojileri": {
    slug: "biyomedikal-cihaz-teknolojileri",
    description:
      "Tıbbi cihazların kurulumu, kullanımı, bakım süreçleri ve sağlık teknolojilerinin teknik altyapısına yönelik eğitim.",
    icon: HeartPulse,
    accent: "green",
  },
};

const benefitIcons = [GraduationCap, Wrench, School, Trophy] as const;
const quickLinkIcons = [School, GraduationCap, Users, CalendarDays, Building2, MessageCircle] as const;
const homepageFeatureIcons: Record<HomepageFeatureIcon, LucideIcon> = {
  flask: FlaskConical,
  building: Building2,
  wrench: Wrench,
  graduation: GraduationCap,
  shield: ShieldCheck,
  users: Users,
  trophy: Trophy,
  school: School,
  zap: Zap,
  heart: HeartPulse,
  circuit: CircuitBoard,
};

type HomepageSectionSlotProps = {
  sectionKey: string;
  children: ReactNode;
};

function HomepageSectionSlot({ children }: HomepageSectionSlotProps) {
  return children;
}

function OrderedHomepageSections({
  sections,
  children,
}: {
  sections: HomepageSection[];
  children: ReactNode;
}) {
  const sectionOrder = new Map(sections.map((section, index) => [section.sectionKey, index]));
  return Children.toArray(children).sort((left, right) => {
    const leftKey = isValidElement<HomepageSectionSlotProps>(left) ? left.props.sectionKey : "";
    const rightKey = isValidElement<HomepageSectionSlotProps>(right) ? right.props.sectionKey : "";
    return (sectionOrder.get(leftKey) ?? Number.MAX_SAFE_INTEGER) - (sectionOrder.get(rightKey) ?? Number.MAX_SAFE_INTEGER);
  });
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

function DepartmentCard({ department, index, ctaLabel }: { department: Department; index: number; ctaLabel: string }) {
  const Icon = department.icon;

  return (
    <Link
      className={`department-card department-card--${department.accent}`}
      href={`/bolumler/${department.slug}`}
    >
      <span className="department-number" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Image
        src={department.image}
        alt=""
        fill
        sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 800px) 50vw, 30vw"
      />
      <span className="department-overlay" aria-hidden="true" />
      <span className="department-content">
        <span className="department-icon" aria-hidden="true">
          <Icon size={21} strokeWidth={1.8} />
        </span>
        <span className="department-branch">{department.branch}</span>
        <strong>{department.title}</strong>
        <span className="department-description">{department.description}</span>
        <span className="department-link">
          {ctaLabel} <ArrowRight size={15} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

function managedThemeClass(section: HomepageSection | undefined): string {
  return section && section.theme !== "original" ? ` homepage-theme-${section.theme}` : "";
}

function HeroTitle({ title }: { title: string }) {
  const highlightedWord = "Teknolojisini";
  const highlightIndex = title.indexOf(highlightedWord);
  if (highlightIndex < 0) return title;
  return (
    <>
      {title.slice(0, highlightIndex)}
      <em>{highlightedWord}</em>
      {title.slice(highlightIndex + highlightedWord.length)}
    </>
  );
}

function CustomHomepageSection({ section }: { section: HomepageSection }) {
  const hasLink = Boolean(section.ctaLabel && section.ctaHref);
  const className = `custom-home-section custom-home-section--${section.sectionType.replace("custom-", "")}${managedThemeClass(section)}`;

  return (
    <section className={className} aria-labelledby={`custom-section-${section.id}`}>
      <div className="container custom-home-section-inner">
        <div className="custom-home-section-copy">
          {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
          <h2 id={`custom-section-${section.id}`}>{section.title}</h2>
          {section.description ? <p>{section.description}</p> : null}
        </div>
        {hasLink ? (
          <a className="button button--primary" href={section.ctaHref}>
            {section.ctaLabel}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </section>
  );
}

export default async function Home() {
  const [canonicalDepartments, settings, homepageSections, registrationPage] = await Promise.all([
    getDepartments(),
    getSiteSettings(),
    getHomepageSections(),
    getContentPage("registration"),
  ]);
  const departmentAccentMap = {
    red: { accent: "teal", icon: FlaskConical },
    indigo: { accent: "blue", icon: CircuitBoard },
    cyan: { accent: "green", icon: HeartPulse },
  } as const;
  const departments: Department[] = canonicalDepartments.map((department) => {
    const teaser = departmentTeasers[department.slug];
    const theme = departmentAccentMap[department.accent] ?? departmentAccentMap.indigo;
    return {
      slug: department.slug,
      title: department.title,
      branch: department.branch,
      image: department.image,
      description: department.lead,
      icon: teaser?.icon ?? theme.icon,
      accent: teaser?.accent ?? theme.accent,
    };
  });
  const generalPhoneTel = `tel:+9${settings.generalPhone.replace(/\D/g, "")}`;
  const landlineTel = `tel:+9${settings.landlinePhone.replace(/\D/g, "")}`;
  const whatsappHref = createWhatsappHref(settings.whatsapp);
  const sectionByKey = new Map(homepageSections.map((section) => [section.sectionKey, section]));
  const heroSection = sectionByKey.get("hero");
  const benefitsSection = sectionByKey.get("benefits");
  const departmentsSection = sectionByKey.get("departments");
  const gallerySection = sectionByKey.get("gallery");
  const campusSection = sectionByKey.get("campus");
  const programsSection = sectionByKey.get("programs");
  const guidanceSection = sectionByKey.get("guidance");
  const registrationSection = sectionByKey.get("registration");
  const contactSection = sectionByKey.get("contact");
  const quickLinksSection = sectionByKey.get("quick-links");
  const benefits = parseContentRows(benefitsSection?.content.items, 2).map(([title, text], index) => ({
    title,
    text,
    icon: benefitIcons[index % benefitIcons.length],
  }));
  const gallery = parseContentRows(gallerySection?.content.images, 2).map(([src, alt]) => ({ src, alt }));
  const heroTiles = parseHomepageHeroTiles(heroSection?.content.tiles);
  const campusFeatures = parseHomepageFeatureCards(campusSection?.content.features);
  const programCards = parseContentRows(programsSection?.content.cards, 4);
  const guidanceLinks = parseContentRows(guidanceSection?.content.links, 3);
  const registrationBenefits = parseContentList(registrationSection?.content.benefits);
  const quickLinks: LinkItem[] = parseContentRows(quickLinksSection?.content.links, 2).map(([label, href], index) => ({
    label,
    href: safeContentHref(href, "/"),
    icon: quickLinkIcons[index % quickLinkIcons.length],
  }));
  const customSections = homepageSections.filter((section) => section.isDeletable && section.isVisible);
  const defaultDepartmentsTitle = "Teknolojiyi mesleğe dönüştüren üç alan";
  const managedDepartmentsTitle = departmentsSection?.title === defaultDepartmentsTitle && departments.length !== 3
    ? `Teknolojiyi mesleğe dönüştüren ${departments.length} mesleki alan`
    : departmentsSection?.title ?? defaultDepartmentsTitle;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        İçeriğe geç
      </a>

      <SiteHeader />

      <main id="main-content">
        <OrderedHomepageSections sections={homepageSections}>
        <HomepageSectionSlot sectionKey="hero">
        {heroSection?.isVisible !== false ? (
        <section className={`hero${managedThemeClass(heroSection)}`} id="anasayfa" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <Image
              src={heroSection?.content.image || "/images/homepage-campus-hero.png"}
              alt={heroSection?.content.imageAlt ?? ""}
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero-wash" aria-hidden="true" />

          <div className="container hero-layout">
            <div className="hero-stage">
              <div className="hero-copy">
                <p className="hero-eyebrow">
                  <span aria-hidden="true" />
                  {heroSection?.eyebrow ?? "Senin mesleğin, senin geleceğin"}
                </p>
                <h1 id="hero-title">
                  <HeroTitle title={heroSection?.title ?? "Geleceğin Teknolojisini Bugünden Öğren."} />
                </h1>
                <p className="hero-lead">
                  {heroSection?.description ?? "Mesleki bilgiyi gerçek uygulamalarla buluşturan, dört yıl ücretsiz ve güçlü bir lise deneyimi."}
                </p>

                <div className="hero-actions">
                  <a className="button button--primary" href={heroSection?.ctaHref ?? "#bolumler"}>
                    {heroSection?.ctaLabel ?? "Bölümleri İncele"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </a>
                  <a className="button button--secondary" href={safeContentHref(heroSection?.content.secondaryHref, "/okulumuz#okulumuzu-taniyin")}>
                    <Play size={16} fill="currentColor" aria-hidden="true" />
                    {heroSection?.content.secondaryLabel ?? "Okulumuzu Tanıyın"}
                  </a>
                </div>
              </div>

              <aside className="hero-rail" aria-label="Okuldan öne çıkanlar">
                {heroTiles.map((tile) => (
                  <a className={`hero-tile${tile.size === "featured" ? " hero-tile--large" : ""}`} href={safeContentHref(tile.href, "#anasayfa")} key={tile.id}>
                    <Image src={tile.image} alt={tile.imageAlt} fill sizes="184px" />
                    {tile.size === "featured" ? <span className="play-button" aria-hidden="true"><Play size={17} fill="currentColor" /></span> : null}
                    <strong>{tile.title}</strong>
                  </a>
                ))}
              </aside>
            </div>

            <div className="proof-grid" role="list" aria-label="Okulun öne çıkan bilgileri">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const accent = ["teal", "blue", "green"][index % 3];

                return (
                  <div className="proof-card" key={benefit.title} role="listitem">
                    <span className={`proof-icon proof-icon--${accent}`} aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span>
                      <strong>{benefit.title}</strong>
                      <small>{benefit.text}</small>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="benefits">
        {benefitsSection?.isVisible !== false ? (
        <section className={`benefit-strip${managedThemeClass(benefitsSection)}`} aria-labelledby="benefit-title">
          <div className="container benefit-grid">
            <div className="benefit-label">
              <strong id="benefit-title">{benefitsSection?.title ?? "Neden Dinamik?"}</strong>
              <span aria-hidden="true" />
            </div>
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div className="benefit-item" key={benefit.title}>
                  <Icon size={26} strokeWidth={1.7} aria-hidden="true" />
                  <span>
                    <strong>{benefit.title}</strong>
                    <small>{benefit.text}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="departments">
        {departmentsSection?.isVisible !== false ? (
        <section className={`department-news-section${managedThemeClass(departmentsSection)}`} id="bolumler" aria-labelledby="departments-title">
          <div className="container department-news-grid">
            <div className="departments-block">
              <SectionHeading
                id="departments-title"
                eyebrow={departmentsSection?.eyebrow ?? "Bölümlerimiz"}
                title={managedDepartmentsTitle}
                description={departmentsSection?.description ?? "Her program, güvenli çalışma kültürü ile teorik bilgiyi uygulamalı eğitimde buluşturur."}
              />
              <div className="department-grid">
                {departments.map((department, index) => (
                  <DepartmentCard
                    key={department.slug}
                    department={department}
                    index={index}
                    ctaLabel={departmentsSection?.content.cardButtonLabel ?? "Programı incele"}
                  />
                ))}
              </div>
              <Link className="departments-footer-link" href={departmentsSection?.ctaHref ?? "/bolumler"}>
                {departmentsSection?.ctaLabel ?? "Tüm bölümleri incele"}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="gallery">
        {gallerySection?.isVisible !== false ? (
        <section className={`gallery-section${managedThemeClass(gallerySection)}`} id="galeri" aria-labelledby="gallery-title">
          <div className="container gallery-layout">
            <div className="gallery-intro">
              <p className="eyebrow">{gallerySection?.eyebrow ?? "Başarılar"}</p>
              <h2 id="gallery-title">{gallerySection?.title ?? "Emekle büyüyen gurur tablomuz"}</h2>
              <p className="gallery-description">{gallerySection?.description ?? "Bilimden spora, öğrencilerimizin azimle ulaştığı dereceleri ve unutulmaz başarı anlarını birlikte kutluyoruz."}</p>
              <a
                className="button button--secondary button--small"
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon />
                {gallerySection?.ctaLabel ?? "Instagram'da Gör"}
              </a>
            </div>
            <div className="gallery-grid">
              {gallery.map((item, index) => (
                <figure key={item.src} className={`gallery-item gallery-item--${index + 1}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 600px) 78vw, (max-width: 1024px) 170px, 15vw"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="campus">
        {campusSection?.isVisible !== false ? (
        <section className={`campus-section${managedThemeClass(campusSection)}`} id="okulumuz" aria-labelledby="campus-title">
          <div className="container campus-grid">
            <div className="campus-media">
              <Image
                src={campusSection?.content.image || "/images/campus-meb-robot-yarismasi.webp"}
                alt={campusSection?.content.imageAlt ?? "Dinamik öğrencileri 18. Uluslararası MEB Robot Yarışması'nda"}
                fill
                sizes="(max-width: 800px) calc(100vw - 32px), 50vw"
              />
            </div>
            <div className="campus-copy">
              <p className="eyebrow">{campusSection?.eyebrow ?? "Neden Dinamik?"}</p>
              <h2 id="campus-title">{campusSection?.title ?? "Geleceği yalnızca anlatmıyor, öğrencilerimizle birlikte inşa ediyoruz."}</h2>
              <p>
                {campusSection?.description ?? "Modern teknik altyapıyı, uygulamalı eğitimi ve iş dünyasıyla kurulan güçlü bağları öğrencilerimizin geleceğine dönüştürüyoruz."}
              </p>
              <div className="campus-features" id="kampus">
                {campusFeatures.map((feature) => {
                  const Icon = homepageFeatureIcons[feature.icon];
                  return (
                    <div className={`campus-feature-card campus-feature-card--${feature.size}`} key={feature.id}>
                      <Icon size={21} aria-hidden="true" />
                      <span><strong>{feature.title}</strong><small>{feature.description}</small></span>
                    </div>
                  );
                })}
              </div>
              <a className="button button--light" href={campusSection?.ctaHref ?? "#iletisim"}>
                {campusSection?.ctaLabel ?? "Okulumuzu Keşfedin"}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="programs">
        {programsSection?.isVisible !== false ? (
        <section className={`program-section${managedThemeClass(programsSection)}`} id="ogrenci" aria-labelledby="programs-title">
          <div className="container">
            <SectionHeading
              id="programs-title"
              eyebrow={programsSection?.eyebrow ?? "Programlar"}
              title={programsSection?.title ?? "Mesleki yetkinliğe giden yol"}
              description={programsSection?.description ?? "Dört yıllık programlar; meslek etiği, iş sağlığı ve güvenliği, çevre bilinci, teknoloji ve uygulamayı birlikte ele alır."}
            />

            <div className="program-grid">
              {programCards.map(([branch, title, description, itemText], index) => {
                const Icon = [FlaskConical, Zap, HeartPulse][index % 3];
                const accent = ["teal", "blue", "green"][index % 3];
                return (
                  <article className="program-card" key={`${branch}-${title}`}>
                    <div className="program-card-heading">
                      <span className="program-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`program-icon program-icon--${accent}`} aria-hidden="true"><Icon size={24} /></span>
                      <div><small>{branch}</small><h3>{title}</h3></div>
                    </div>
                    <p>{description}</p>
                    <ul>
                      {itemText.split(";").map((item) => item.trim()).filter(Boolean).map((item) => (
                        <li key={item}><CheckCircle2 size={17} /> {item}</li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="guidance">
        {guidanceSection?.isVisible !== false ? (
        <section className={`guidance-section${managedThemeClass(guidanceSection)}`} aria-labelledby="guidance-title">
          <div className="container guidance-grid">
            <div className="guidance-copy">
              <p className="eyebrow">{guidanceSection?.eyebrow ?? "Öğrenci & Rehberlik"}</p>
              <h2 id="guidance-title">{guidanceSection?.title ?? "Sadece bir bölüm değil, güçlü bir gelecek seçimi."}</h2>
              <p>
                {guidanceSection?.description ?? "Öğrencilerimizin akademik, mesleki ve kişisel gelişimini; kariyer farkındalığı, rehberlik çalışmaları ve sosyal etkinliklerle destekliyoruz."}
              </p>
            </div>
            <div className="guidance-cards">
              {guidanceLinks.map(([title, text, href], index) => {
                const Icon = [ShieldCheck, Trophy, Users][index % 3];
                return (
                  <Link href={safeContentHref(href, "/")} key={`${title}-${href}`}>
                    <Icon size={24} aria-hidden="true" />
                    <span><strong>{title}</strong><small>{text}</small></span>
                    <ChevronRight size={17} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        {customSections.map((section) => (
          <HomepageSectionSlot key={section.id} sectionKey={section.sectionKey}>
            <CustomHomepageSection section={section} />
          </HomepageSectionSlot>
        ))}

        <HomepageSectionSlot sectionKey="registration">
        {registrationSection?.isVisible !== false ? (
        <section className={`registration-section${managedThemeClass(registrationSection)}`} id="on-kayit" aria-labelledby="registration-title">
          <div className="container registration-grid">
            <div className="registration-copy">
              <p className="eyebrow">{registrationSection?.eyebrow ?? "Ön Kayıt Talebi"}</p>
              <h2 id="registration-title">{registrationSection?.title ?? "Sizi tanıyalım, doğru programı birlikte seçelim."}</h2>
              <p>
                {registrationSection?.description ?? "Kısa formu doldurun; talebiniz okulun resmî WhatsApp hattına hazır mesaj olarak aktarılsın. Kayıt ekibimiz uygun olduğunda sizinle iletişime geçsin."}
              </p>
              <ul>
                {registrationBenefits.map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden="true" /> {item}</li>)}
              </ul>
            </div>
            <RegistrationForm whatsappNumber={settings.whatsapp} content={registrationPage.content} />
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="contact">
        {contactSection?.isVisible !== false ? (
        <section className={`contact-section${managedThemeClass(contactSection)}`} id="iletisim" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow eyebrow--light">{contactSection?.eyebrow ?? "Bize Ulaşın"}</p>
              <h2 id="contact-title">{contactSection?.title ?? "Geleceğin için ilk adımı bugün at."}</h2>
              <p>
                {contactSection?.description ?? "Bölümler, kayıt koşulları ve kampüs ziyareti hakkında bilgi almak için okulumuza ulaşın."}
              </p>
              <div className="contact-actions">
                <a className="button button--light" href={generalPhoneTel}>
                  <Phone size={17} aria-hidden="true" />
                  {contactSection?.content.phoneButtonLabel ? `${contactSection.content.phoneButtonLabel}: ${settings.generalPhone}` : settings.generalPhone}
                </a>
                <a
                  className="button button--whatsapp"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {contactSection?.content.whatsappButtonLabel ?? "WhatsApp"}
                </a>
              </div>
            </div>

            <address className="contact-card">
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-card-icon"><MapPin size={21} aria-hidden="true" /></span>
                <span><small>{contactSection?.content.addressLabel ?? "Adres"}</small><strong>{settings.addressLine}</strong></span>
                <ExternalLink size={15} aria-hidden="true" />
              </a>
              <a href={landlineTel}>
                <span className="contact-card-icon"><Phone size={21} aria-hidden="true" /></span>
                <span><small>{contactSection?.content.landlineLabel ?? "Sabit Hat"}</small><strong>{settings.landlinePhone}</strong></span>
                <ChevronRight size={15} aria-hidden="true" />
              </a>
              <div>
                <span className="contact-card-icon"><Clock3 size={21} aria-hidden="true" /></span>
                <span><small>{contactSection?.content.hoursLabel ?? "Çalışma Saatleri"}</small><strong>{settings.hours}</strong></span>
              </div>
            </address>
          </div>
        </section>
        ) : null}
        </HomepageSectionSlot>

        <HomepageSectionSlot sectionKey="quick-links">
          {quickLinksSection?.isVisible !== false ? <nav className={`quick-links${managedThemeClass(quickLinksSection)}`} aria-label="Hızlı erişim">
            <div className="container quick-links-grid">
              {quickLinks.map((item) => {
                const Icon = item.icon ?? ChevronRight;
                const external = item.href.startsWith("http");
                return (
                  <a
                    href={item.href}
                    key={item.label}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav> : null}
        </HomepageSectionSlot>
        </OrderedHomepageSections>
      </main>

      <SiteFooter />
    </div>
  );
}
