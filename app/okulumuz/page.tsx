import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, Shirt, Users } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Okulumuz",
  description:
    "Dinamik Mesleki ve Teknik Anadolu Lisesi Samsun kampüsü, eğitim yaklaşımı, kadrosu, rehberlik hizmetleri ve okul yaşamı.",
  alternates: { canonical: "/okulumuz" },
};

const schoolPages = [
  {
    icon: BookOpenCheck,
    title: "Hakkımızda",
    text: "Eğitim yaklaşımımızı, vizyonumuzu, misyonumuzu ve kalite anlayışımızı keşfedin.",
    href: "/hakkimizda",
  },
  {
    icon: Users,
    title: "Kadromuz",
    text: "Öğrencilerin akademik, mesleki ve kişisel gelişimine eşlik eden eğitim ekibimizi tanıyın.",
    href: "/kadromuz",
  },
  {
    icon: GraduationCap,
    title: "Rehberlik",
    text: "Kariyer planlama, sınav süreci ve öğrenci gelişimini destekleyen rehberlik çalışmalarını inceleyin.",
    href: "/rehberlik",
  },
  {
    icon: Shirt,
    title: "Okul Kıyafetlerimiz",
    text: "Okul kültürünü yansıtan güncel kıyafet düzeni ve kullanım bilgilerine ulaşın.",
    href: "/okul-kiyafetlerimiz",
  },
];

export default function SchoolPage() {
  return (
    <InnerPageShell>
      <PageHero
        eyebrow="Dinamik okul kültürü"
        title="Öğrenmenin, üretmenin ve birlikte gelişmenin güçlü kampüsü."
        description="Modern eğitim ortamlarını, uygulamalı mesleki eğitimi ve öğrenciyi merkeze alan okul yaşamını tek bir bütün olarak sunuyoruz."
        image="/images/about-school-campus.png"
        imageAlt="Dinamik Mesleki ve Teknik Anadolu Lisesi kampüsü ve öğrencileri"
        current="Okulumuz"
      />

      <section className="inner-section inner-section--soft" aria-labelledby="school-pages-title">
        <div className="container">
          <div className="inner-section-header">
            <div>
              <p className="inner-eyebrow">Okulumuzu keşfedin</p>
              <h2 id="school-pages-title">Dinamik&apos;te okul yaşamının her yönüne ulaşın.</h2>
            </div>
            <p>
              Kurumsal yaklaşımımızdan öğrenci rehberliğine kadar okul hakkında aradığınız
              her başlık, ayrıntılı ve bağımsız bir sayfada sunulur.
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
                src="/images/hero-lab.jpg"
                alt="Dinamik öğrencileri laboratuvar uygulamasında"
                fill
                sizes="(max-width: 900px) calc(100vw - 48px), 46vw"
              />
            </div>
            <span className="image-frame-accent" aria-hidden="true" />
          </div>
          <div className="editorial-copy">
            <p className="inner-eyebrow">Eğitim modelimiz</p>
            <h2 id="school-model-title">Teoriyi, uygulamayı ve kariyer hedefini aynı yolculukta buluşturuyoruz.</h2>
            <p>
              Üç aktif mesleki alanda güvenli çalışma kültürü, güncel teknik altyapı ve
              uygulamalı öğrenme yaklaşımıyla öğrencilerimizin yetkinliklerini geliştiriyoruz.
            </p>
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
            <h2>Okulumuzu yerinde tanıyın.</h2>
            <p>Atölyeleri, laboratuvarları ve kampüs ortamını görmek için ziyaret planlayın.</p>
          </div>
          <div className="cta-panel-actions">
            <Link className="button button--primary" href="/on-kayit">
              Ziyaret talebi oluştur <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </InnerPageShell>
  );
}
