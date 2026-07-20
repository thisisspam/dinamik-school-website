import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { getSiteSettings } from "../../lib/content";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Dinamik Mesleki ve Teknik Anadolu Lisesi Samsun adres, telefon, e-posta ve çalışma saatleri.",
  alternates: { canonical: "/iletisim" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const generalPhoneTel = `tel:+9${settings.generalPhone.replace(/\D/g, "")}`;
  const landlinePhoneTel = `tel:+9${settings.landlinePhone.replace(/\D/g, "")}`;
  const whatsappHref = `https://wa.me/9${settings.whatsapp.replace(/\D/g, "")}`;

  return (
    <InnerPageShell>
      <PageHero eyebrow="Bize ulaşın" title="Sorularınızı dinleyelim, geleceğiniz için doğru adımı birlikte atalım." description="Bölümler, kayıt süreci ve kampüs ziyareti hakkında bilgi almak için okulumuza ulaşabilirsiniz." image="/images/about-school-campus.png" current="İletişim" />
      <section className="inner-section inner-section--soft">
        <div className="container contact-detail-grid">
          <div className="contact-detail-list">
            <a className="contact-detail-card" href={generalPhoneTel}><span><Phone size={22} /></span><div><small>Genel iletişim</small><strong>{settings.generalPhone}</strong></div></a>
            <a className="contact-detail-card" href={landlinePhoneTel}><span><Phone size={22} /></span><div><small>Sabit hat</small><strong>{settings.landlinePhone}</strong></div></a>
            <a className="contact-detail-card" href={whatsappHref} target="_blank" rel="noreferrer"><span><MessageCircle size={22} /></span><div><small>WhatsApp</small><strong>{settings.whatsapp}</strong></div></a>
            <a className="contact-detail-card" href={`mailto:${settings.email}`}><span><Mail size={22} /></span><div><small>E-posta</small><strong>{settings.email}</strong></div></a>
            <div className="contact-detail-card"><span><Clock3 size={22} /></span><div><small>Çalışma saatleri</small><strong>{settings.hours}</strong></div></div>
          </div>
          <a className="map-panel" href={settings.mapUrl} target="_blank" rel="noreferrer">
            <Image src="/images/about-school-campus.png" alt="Dinamik Okulları Samsun kampüsü" fill sizes="(max-width: 900px) calc(100vw - 48px), 55vw" />
            <span className="map-panel-content"><h2>Kampüsü yerinde keşfedin.</h2><p>{settings.addressLine}</p><span className="button button--primary">Haritada aç <ExternalLink size={15} /></span></span>
          </a>
        </div>
      </section>
      <section className="inner-section"><div className="container cta-panel"><div><h2>Kampüs ziyareti planlayın.</h2><p>Atölyeleri, laboratuvarları ve eğitim ortamını yakından görmek için ön kayıt talebinizi iletin.</p></div><div className="cta-panel-actions"><Link className="button button--primary" href="/on-kayit">Ön kayıt talebi <ArrowRight size={16} /></Link></div></div></section>
    </InnerPageShell>
  );
}
