import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Compass, HeartHandshake, MessageCircleHeart, ShieldCheck, Target } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getContentPage } from "@/lib/cms/content";
import { parseContentRows } from "@/lib/cms/helpers";

export const metadata: Metadata = {
  title: "Rehberlik",
  description: "Dinamik Samsun rehberlik yaklaşımı; öğrenci, aile, kariyer ve sınav sürecine bütüncül destek.",
  alternates: { canonical: "/rehberlik" },
};

export default async function GuidancePage() {
  const page = await getContentPage("guidance");
  const content = page.content;
  const icons = [Compass, Brain, Target, MessageCircleHeart, HeartHandshake, ShieldCheck];
  const topics = parseContentRows(content.topics, 2).map(([title, text], index) => ({ title, text, icon: icons[index % icons.length] }));

  return (
    <InnerPageShell theme={page.theme}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} description={content.heroDescription} image={content.heroImage} imageAlt={content.heroImageAlt} imagePosition="center 55%" current="Rehberlik" />
      <section className="inner-section inner-section--soft" aria-labelledby="guidance-title"><div className="container"><div className="inner-section-header"><div><p className="inner-eyebrow">{content.introEyebrow}</p><h2 id="guidance-title">{content.introTitle}</h2></div><p>{content.introDescription}</p></div><div className="support-grid">{topics.map(({ icon: Icon, title, text }) => <article className="support-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="inner-section inner-section--navy"><div className="container cta-panel"><div><h2>{content.ctaTitle}</h2><p>{content.ctaDescription}</p></div><div className="cta-panel-actions"><Link className="button button--primary" href="/bolumler">Bölümleri incele <ArrowRight size={16} /></Link><Link className="button button--outline-light" href="/iletisim">Rehberlik birimine ulaş</Link></div></div></section>
    </InnerPageShell>
  );
}
