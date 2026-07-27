import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { RegistrationForm } from "../components/RegistrationForm";
import { getSiteSettings } from "../../lib/content";
import { getContentPage } from "@/lib/cms/content";
import { parseContentList } from "@/lib/cms/helpers";

export const metadata: Metadata = {
  title: "Ön Kayıt",
  description: "Dinamik Samsun bölümleri, kampüs ziyareti ve kayıt süreci için WhatsApp üzerinden ön kayıt bilgi talebi.",
  alternates: { canonical: "/on-kayit" },
};

export default async function RegistrationPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getContentPage("registration")]);
  const content = page.content;
  const benefits = parseContentList(content.benefits);
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} description={content.heroDescription} image={content.heroImage} imageAlt={content.heroImageAlt} current="Ön Kayıt" size="slim" />
      <section className="inner-section inner-section--soft">
        <div className="container registration-page-panel">
          <div className="registration-page-copy">
            <p className="inner-eyebrow">{content.formEyebrow}</p>
            <h2>{content.formTitle}</h2>
            <p>{content.formDescription}</p>
            <ul>
              {benefits.map((benefit, index) => {
                const Icon = index === benefits.length - 1 ? ShieldCheck : CheckCircle2;
                return <li key={benefit}><Icon size={18} />{benefit}</li>;
              })}
            </ul>
          </div>
          <RegistrationForm whatsappNumber={settings.whatsapp} content={content} />
        </div>
      </section>
    </InnerPageShell>
  );
}
