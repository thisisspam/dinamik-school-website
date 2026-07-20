import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getDepartments } from "../data/departments";

export const metadata: Metadata = {
  title: "Bölümlerimiz",
  description: "Dinamik Samsun'da eğitim verilen güncel mesleki ve teknik programları keşfedin.",
  alternates: { canonical: "/bolumler" },
};

export default async function DepartmentsPage() {
  const departments = await getDepartments();
  return (
    <InnerPageShell>
      <PageHero
        eyebrow="Teknolojiden mesleğe"
        title="İlgi alanını, geleceğinin güçlü bir parçasına dönüştür."
        description="Aktif mesleki alanlar, farklı teknoloji dünyaları ve uygulamayla güçlenen tek bir eğitim yaklaşımı."
        image="/images/hero-banner.png"
        current="Bölümlerimiz"
      />

      <section className="inner-section" aria-labelledby="departments-index-title">
        <div className="container">
          <div className="inner-section-header">
            <div>
              <p className="inner-eyebrow">Aktif programlarımız</p>
              <h2 id="departments-index-title">Üreten, ölçen ve çözüm geliştiren mesleki alanlar.</h2>
            </div>
            <p>
              Her alan, okulda fiilen eğitim verilen dal üzerinden anlatılır. Program içerikleri,
              güvenli çalışma kültürünü gerçek atölye ve laboratuvar uygulamalarıyla birleştirir.
            </p>
          </div>

          <div className="department-index-grid">
            {departments.map((department, index) => (
              <Link className={`department-index-card department-index-card--${department.accent}`} href={`/bolumler/${department.slug}`} key={department.slug}>
                <Image src={department.image} alt="" fill sizes="(max-width: 700px) calc(100vw - 48px), 32vw" />
                <span className="department-index-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="department-index-card-content">
                  <small>{department.branch}</small>
                  <h2>{department.title}</h2>
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
            <div><p className="inner-eyebrow">Dinamik eğitim modeli</p><h2 id="education-model-title">Bilgiyi beceriye dönüştüren üç güçlü katman.</h2></div>
            <p>Akademik temel, gerçek ekipmanlarla uygulama ve kariyer farkındalığı aynı öğrenme yolculuğunda buluşur.</p>
          </div>
          <div className="feature-card-grid">
            {[
              { icon: BookOpenCheck, title: "Güçlü akademik temel", text: "Mesleki eğitimi temel bilimler, matematik, iletişim ve yabancı dil becerileriyle destekler." },
              { icon: GraduationCap, title: "Uygulamayla öğrenme", text: "Atölye ve laboratuvarlarda ölçme, analiz, tasarım, bakım ve problem çözme deneyimi kazandırır." },
              { icon: BriefcaseBusiness, title: "Kariyere hazırlık", text: "Sektörü tanıma, yükseköğretim seçenekleri ve çalışma kültürüyle geleceğe hazırlık sağlar." },
            ].map(({ icon: Icon, title, text }) => (
              <article className="feature-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section inner-section--navy">
        <div className="container cta-panel">
          <div><h2>Hangi bölümün sana uygun olduğunu birlikte keşfedelim.</h2><p>Programları yakından tanımak, kampüsü görmek ve kayıt sürecini konuşmak için okulumuza ulaş.</p></div>
          <div className="cta-panel-actions"><Link className="button button--primary" href="/on-kayit">Ön kayıt talebi <ArrowRight size={16} /></Link><Link className="button button--outline-light" href="/iletisim">Bize ulaşın</Link></div>
        </div>
      </section>
    </InnerPageShell>
  );
}
