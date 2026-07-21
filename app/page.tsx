import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, SiteFooter, SiteHeader } from "./components/SiteChrome";
import { RegistrationForm } from "./components/RegistrationForm";
import { getDepartments } from "./data/departments";
import { getGalleryImages, getHomepageSections, getSiteSettings, type HomepageSection } from "../lib/content";
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

const benefits = [
  {
    icon: GraduationCap,
    title: "4 Yıl",
    text: "Ücretsiz Eğitim",
  },
  {
    icon: Wrench,
    title: "3 Alan",
    text: "Mesleki Program",
  },
];

const quickLinks: LinkItem[] = [
  { label: "e-Okul Girişi", href: "https://e-okul.meb.gov.tr/", icon: School },
  { label: "Bölümler", href: "/bolumler", icon: GraduationCap },
  { label: "Rehberlik", href: "/rehberlik", icon: Users },
  { label: "Etkinlikler", href: "/faaliyetlerimiz", icon: CalendarDays },
  { label: "Kampüs", href: "/hakkimizda", icon: Building2 },
  { label: "Bize Ulaşın", href: "/iletisim", icon: MessageCircle },
];

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

function DepartmentCard({ department, index }: { department: Department; index: number }) {
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
          Programı incele <ArrowRight size={15} aria-hidden="true" />
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
  const [canonicalDepartments, galleryImages, settings, homepageSections] = await Promise.all([
    getDepartments(),
    getGalleryImages(),
    getSiteSettings(),
    getHomepageSections(),
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
      description: teaser?.description ?? department.lead,
      icon: teaser?.icon ?? theme.icon,
      accent: teaser?.accent ?? theme.accent,
    };
  });
  const gallery = galleryImages.slice(0, 6);
  const generalPhoneTel = `tel:+9${settings.generalPhone.replace(/\D/g, "")}`;
  const landlineTel = `tel:+9${settings.landlinePhone.replace(/\D/g, "")}`;
  const whatsappHref = `https://wa.me/9${settings.whatsapp.replace(/\D/g, "")}`;
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
        {heroSection?.isVisible !== false ? (
        <section className={`hero${managedThemeClass(heroSection)}`} id="anasayfa" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <Image src="/images/hero-banner.png" alt="" fill priority sizes="100vw" />
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
                  <a className="button button--secondary" href="/okulumuz#okulumuzu-taniyin">
                    <Play size={16} fill="currentColor" aria-hidden="true" />
                    Okulumuzu Tanıyın
                  </a>
                </div>
              </div>

              <aside className="hero-rail" aria-label="Okuldan öne çıkanlar">
                <a
                  className="hero-tile hero-tile--large"
                  href="/okulumuz#okulumuzu-taniyin"
                >
                  <Image
                    src="/images/gallery-4.jpg"
                    alt="Dinamik Okulları tanıtımı"
                    fill
                    sizes="184px"
                  />
                  <span className="play-button" aria-hidden="true">
                    <Play size={17} fill="currentColor" />
                  </span>
                  <strong>Okulumuzu Tanıyın</strong>
                </a>
                <a className="hero-tile" href="#bolumler">
                  <Image
                    src="/images/electronics.jpg"
                    alt="Uygulamalı eğitim çalışması"
                    fill
                    sizes="184px"
                  />
                  <strong>Uygulamalı Eğitim</strong>
                </a>
                <a className="hero-tile" href="#galeri">
                  <Image
                    src="/images/gallery-7.jpg"
                    alt="Dinamik öğrenci etkinliği"
                    fill
                    sizes="184px"
                  />
                  <strong>Dinamik&apos;te Yaşam</strong>
                </a>
              </aside>
            </div>

            <div className="proof-grid" aria-label="Okulun öne çıkan bilgileri">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const accent = ["teal", "blue"][index];

                return (
                  <div className="proof-card" key={benefit.title}>
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
                  <DepartmentCard key={department.slug} department={department} index={index} />
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

        {gallerySection?.isVisible !== false ? (
        <section className={`gallery-section${managedThemeClass(gallerySection)}`} id="galeri" aria-labelledby="gallery-title">
          <div className="container gallery-layout">
            <div className="gallery-intro">
              <p className="eyebrow">{gallerySection?.eyebrow ?? "Kampüs & Yaşam"}</p>
              <h2 id="gallery-title">{gallerySection?.title ?? "Dinamik'te Yaşam"}</h2>
              <p className="gallery-description">{gallerySection?.description ?? "Eğitim sadece sınıfta değil, hayatın her anında."}</p>
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

        {campusSection?.isVisible !== false ? (
        <section className={`campus-section${managedThemeClass(campusSection)}`} id="okulumuz" aria-labelledby="campus-title">
          <div className="container campus-grid">
            <div className="campus-media">
              <Image
                src="/images/gallery-8.jpg"
                alt="Dinamik öğrencileri okul etkinliğinde"
                fill
                sizes="(max-width: 800px) calc(100vw - 32px), 50vw"
              />
              <div className="campus-stat campus-stat--top">
                <strong>400</strong>
                <span>Kişilik konferans salonu</span>
              </div>
              <div className="campus-stat campus-stat--bottom">
                <strong>1.400</strong>
                <span>Öğrenci kapasitesi</span>
              </div>
            </div>
            <div className="campus-copy">
              <p className="eyebrow">{campusSection?.eyebrow ?? "Neden Dinamik?"}</p>
              <h2 id="campus-title">{campusSection?.title ?? "Geleceği yalnızca anlatmıyor, öğrencilerimizle birlikte inşa ediyoruz."}</h2>
              <p>
                {campusSection?.description ?? "Modern teknik altyapıyı, uygulamalı eğitimi ve iş dünyasıyla kurulan güçlü bağları öğrencilerimizin geleceğine dönüştürüyoruz."}
              </p>
              <div className="campus-features" id="kampus">
                <div>
                  <FlaskConical size={21} aria-hidden="true" />
                  <span>
                    <strong>Modern ve Yüksek Teknolojili Atölyeler</strong>
                    <small>Her alan için güncel teknik altyapı ve uygulama ortamları</small>
                  </span>
                </div>
                <div>
                  <Building2 size={21} aria-hidden="true" />
                  <span>
                    <strong>Sanayi ile Güçlü İş Birlikleri</strong>
                    <small>Gerçek projeler, staj olanakları ve istihdam fırsatları</small>
                  </span>
                </div>
                <div>
                  <Wrench size={21} aria-hidden="true" />
                  <span>
                    <strong>Uygulamalı Eğitim Ağırlıklı Müfredat</strong>
                    <small>Teori ve pratiği birleştiren çağdaş eğitim modeli</small>
                  </span>
                </div>
                <div>
                  <GraduationCap size={21} aria-hidden="true" />
                  <span>
                    <strong>Üniversite ve Doğrudan İşe Geçiş</strong>
                    <small>İstediğin yolda güçlü bir gelecek için rehberlik</small>
                  </span>
                </div>
                <div>
                  <ShieldCheck size={21} aria-hidden="true" />
                  <span>
                    <strong>Güvenli ve Sosyal Kampüs</strong>
                    <small>Spor, kültür, sanat ve birlikte üretme kültürü</small>
                  </span>
                </div>
              </div>
              <a className="button button--light" href={campusSection?.ctaHref ?? "#iletisim"}>
                {campusSection?.ctaLabel ?? "Okulumuzu Keşfedin"}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        ) : null}

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
              <article className="program-card" id="program-kimya">
                <div className="program-card-heading">
                  <span className="program-number">01</span>
                  <span className="program-icon program-icon--teal" aria-hidden="true">
                    <FlaskConical size={24} />
                  </span>
                  <div>
                    <small>Kimya Laboratuvarı Dalı</small>
                    <h3>Kimya Teknolojileri</h3>
                  </div>
                </div>
                <p>
                  Temel kimyasal işlemlerden numune analizlerine, klasik analiz
                  yöntemlerinden laboratuvar cihazları ve kromatografik yöntemlere uzanan
                  uygulamalı eğitim.
                </p>
                <ul>
                  <li><CheckCircle2 size={17} /> Nitel ve nicel analiz uygulamaları</li>
                  <li><CheckCircle2 size={17} /> Numune alma ve atık yönetimi</li>
                  <li><CheckCircle2 size={17} /> GLP ve iş güvenliği yaklaşımı</li>
                  <li><CheckCircle2 size={17} /> Cihazlı analiz yöntemleri</li>
                </ul>
              </article>

              <article className="program-card" id="program-elektrik">
                <div className="program-card-heading">
                  <span className="program-number">02</span>
                  <span className="program-icon program-icon--blue" aria-hidden="true">
                    <Zap size={24} />
                  </span>
                  <div>
                    <small>Elektrik Tesisatları ve Dağıtımı Dalı</small>
                    <h3>Elektrik-Elektronik Teknolojileri</h3>
                  </div>
                </div>
                <p>
                  Temel elektrik-elektronik bilgisini ölçme, devre, proje, pano ve test
                  uygulamalarıyla birleştiren kapsamlı mesleki eğitim.
                </p>
                <ul>
                  <li><CheckCircle2 size={17} /> Devre hesaplama ve ölçme</li>
                  <li><CheckCircle2 size={17} /> Simülasyon ve baskı devre</li>
                  <li><CheckCircle2 size={17} /> Kuvvet ve kumanda panoları</li>
                  <li><CheckCircle2 size={17} /> Tesisat projesi ve test</li>
                </ul>
              </article>

              <article className="program-card" id="program-biyomedikal">
                <div className="program-card-heading">
                  <span className="program-number">03</span>
                  <span className="program-icon program-icon--green" aria-hidden="true">
                    <HeartPulse size={24} />
                  </span>
                  <div>
                    <small>Tıbbi Görüntüleme Sistemleri</small>
                    <h3>Biyomedikal Cihaz Teknolojileri</h3>
                  </div>
                </div>
                <p>
                  Sağlık teknolojileri alanında kullanılan cihazların teknik altyapısını,
                  güvenli kullanımını ve bakım süreçlerini tanıtan uygulama odaklı eğitim.
                </p>
                <ul>
                  <li><CheckCircle2 size={17} /> Tıbbi cihaz sistemleri</li>
                  <li><CheckCircle2 size={17} /> Kurulum ve güvenli kullanım</li>
                  <li><CheckCircle2 size={17} /> Ölçme, kontrol ve bakım</li>
                  <li><CheckCircle2 size={17} /> Teknik dokümantasyon</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
        ) : null}

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
              <Link href="/rehberlik">
                <ShieldCheck size={24} aria-hidden="true" />
                <span><strong>Rehberlik</strong><small>Öğrencinin yanında, aileyle birlikte</small></span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/bolumler">
                <Trophy size={24} aria-hidden="true" />
                <span><strong>Kariyer Planlama</strong><small>İlgi ve yeteneğe uygun alan seçimi</small></span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/faaliyetlerimiz">
                <Users size={24} aria-hidden="true" />
                <span><strong>Sosyal Yaşam</strong><small>Kültür, sanat, spor ve ekip ruhu</small></span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        ) : null}

        {customSections.map((section) => <CustomHomepageSection key={section.id} section={section} />)}

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
                <li><CheckCircle2 size={18} aria-hidden="true" /> Üç mesleki alan hakkında bilgi</li>
                <li><CheckCircle2 size={18} aria-hidden="true" /> Kampüs ziyareti planlama</li>
                <li><CheckCircle2 size={18} aria-hidden="true" /> Kayıt süreci ve koşulları</li>
              </ul>
            </div>
            <RegistrationForm />
          </div>
        </section>
        ) : null}

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
                  {settings.generalPhone}
                </a>
                <a
                  className="button button--whatsapp"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  WhatsApp
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
                <span><small>Adres</small><strong>{settings.addressLine}</strong></span>
                <ExternalLink size={15} aria-hidden="true" />
              </a>
              <a href={landlineTel}>
                <span className="contact-card-icon"><Phone size={21} aria-hidden="true" /></span>
                <span><small>Sabit Hat</small><strong>{settings.landlinePhone}</strong></span>
                <ChevronRight size={15} aria-hidden="true" />
              </a>
              <div>
                <span className="contact-card-icon"><Clock3 size={21} aria-hidden="true" /></span>
                <span><small>Çalışma Saatleri</small><strong>{settings.hours}</strong></span>
              </div>
            </address>
          </div>
        </section>
        ) : null}
      </main>

      <nav className="quick-links" aria-label="Hızlı erişim">
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
      </nav>

      <SiteFooter />
    </div>
  );
}
