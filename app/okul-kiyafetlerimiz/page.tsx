import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shirt, Sparkles, ShieldCheck } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getContentPage } from "@/lib/cms/content";
import { parseContentList, parseContentRows } from "@/lib/cms/helpers";

export const metadata: Metadata = {
  title: "Okul Kıyafetlerimiz",
  description: "Dinamik Samsun 2025-2026 eğitim öğretim yılından itibaren geçerli okul kıyafeti bilgileri.",
  alternates: { canonical: "/okul-kiyafetlerimiz" },
};

export default async function SchoolUniformPage() {
  const page = await getContentPage("uniforms");
  const content = page.content;
  const items = parseContentList(content.items);
  const icons = [Shirt, ShieldCheck, Sparkles];
  const features = parseContentRows(content.features, 2).map(([title, text], index) => ({ title, text, icon: icons[index % icons.length] }));
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} description={content.heroDescription} image={content.heroImage} imageAlt={content.heroImageAlt} current="Okul Kıyafetlerimiz" size="slim" />
      <section className="inner-section inner-section--soft">
        <div className="container uniform-layout">
          <div className="uniform-image"><Image src={content.uniformImage} alt="Dinamik Okulları okul kıyafeti" fill sizes="(max-width: 900px) calc(100vw - 48px), 55vw" /></div>
          <div className="editorial-copy">
            <p className="inner-eyebrow">{content.contentEyebrow}</p>
            <h2>{content.contentTitle}</h2>
            <p>{content.contentDescription}</p>
            <ul className="check-list-grid">
              {items.map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}
            </ul>
            <p className="uniform-note">{content.note}</p>
            <div className="cta-panel-actions"><Link className="button button--primary" href="/iletisim">Bilgi alın <ArrowRight size={16} /></Link></div>
          </div>
        </div>
      </section>
      <section className="inner-section">
        <div className="container feature-card-grid">
          {features.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </InnerPageShell>
  );
}
