import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Compass, HeartHandshake, MessageCircleHeart, ShieldCheck, Target } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Rehberlik",
  description: "Dinamik Samsun rehberlik yaklaşımı; öğrenci, aile, kariyer ve sınav sürecine bütüncül destek.",
  alternates: { canonical: "/rehberlik" },
};

export default function GuidancePage() {
  const topics = [
    { icon: Compass, title: "Kariyer farkındalığı", text: "İlgi, yetenek ve hedefleri tanıyarak alan seçimini daha bilinçli bir karara dönüştürmek." },
    { icon: Brain, title: "Öğrenme becerileri", text: "Dikkat, çalışma düzeni, hedef belirleme ve zaman yönetimi alışkanlıklarını geliştirmek." },
    { icon: Target, title: "Sınav süreci", text: "Kaygıyı yönetmek, gerçekçi hedef kurmak ve sınava hazırlığı sürdürülebilir bir plana dönüştürmek." },
    { icon: MessageCircleHeart, title: "Ergenlik ve iletişim", text: "Öğrencinin kendini ifade etmesini, aile ve arkadaş ilişkilerinde sağlıklı iletişimi desteklemek." },
    { icon: HeartHandshake, title: "Okul-aile iş birliği", text: "Öğrencinin gelişimini düzenli iletişim ve ortak bir destek yaklaşımıyla izlemek." },
    { icon: ShieldCheck, title: "Güvenli okul iklimi", text: "Saygı, sorumluluk, aidiyet ve psikolojik güveni okul yaşamının merkezine taşımak." },
  ];

  return (
    <InnerPageShell>
      <PageHero eyebrow="Her adımda yanında" title="Kendini tanıyan öğrenci, geleceğini daha güçlü tasarlar." description="Rehberlik yaklaşımımız; akademik başarıyı, iyi oluşu, kariyer farkındalığını ve aile iletişimini tek bir gelişim yolculuğunda ele alır." image="/images/gallery-3.jpg" current="Rehberlik" />
      <section className="inner-section inner-section--soft" aria-labelledby="guidance-title"><div className="container"><div className="inner-section-header"><div><p className="inner-eyebrow">Bütüncül destek</p><h2 id="guidance-title">Sadece sınava değil, hayata hazırlayan rehberlik.</h2></div><p>Öğrencinin güçlü yanlarını keşfetmesi, zorlandığı alanlarda destek bulması ve kararlarını güvenle verebilmesi için yanında oluruz.</p></div><div className="support-grid">{topics.map(({ icon: Icon, title, text }) => <article className="support-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="inner-section inner-section--navy"><div className="container cta-panel"><div><h2>Doğru bölüm seçimi, kendini tanımakla başlar.</h2><p>Üç mesleki alanı birlikte değerlendirelim; ilgi ve hedeflerine uygun programı keşfet.</p></div><div className="cta-panel-actions"><Link className="button button--primary" href="/bolumler">Bölümleri incele <ArrowRight size={16} /></Link><Link className="button button--outline-light" href="/iletisim">Rehberlik birimine ulaş</Link></div></div></section>
    </InnerPageShell>
  );
}
