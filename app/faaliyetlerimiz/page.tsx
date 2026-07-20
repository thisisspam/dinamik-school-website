import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Drama, Dumbbell, FlaskConical, Music, Palette, Users } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Faaliyetlerimiz",
  description: "Dinamik Samsun'da sosyal, kültürel, bilimsel ve sportif öğrenci çalışmaları.",
  alternates: { canonical: "/faaliyetlerimiz" },
};

const activities = [
  { icon: FlaskConical, title: "Bilim ve teknoloji", text: "Atölye üretimleri, laboratuvar uygulamaları, proje günleri ve teknik geziler." },
  { icon: Drama, title: "Kültür ve sahne", text: "Törenler, tiyatro, söyleşi, şiir ve öğrencilerin kendini ifade ettiği sahne çalışmaları." },
  { icon: Dumbbell, title: "Spor ve takım ruhu", text: "Turnuvalar, hareketli yaşam etkinlikleri ve birlikte hedefe ilerleme kültürü." },
  { icon: Palette, title: "Sanat ve tasarım", text: "Görsel üretim, sergi, müzik ve öğrencilerin özgün fikirlerini görünür kılan çalışmalar." },
  { icon: Users, title: "Sosyal sorumluluk", text: "Topluma duyarlılık, paylaşma, gönüllülük ve dayanışmayı büyüten okul projeleri." },
  { icon: Music, title: "Kampüs yaşamı", text: "Öğrencilerin bir araya geldiği kutlamalar, kulüp günleri ve sosyal buluşmalar." },
];

export default function ActivitiesPage() {
  return (
    <InnerPageShell>
      <PageHero eyebrow="Sınıfın ötesinde öğrenme" title="Merakın, yeteneğin ve takım ruhunun kampüste hayat bulduğu anlar." description="Eğitim; bilim, sanat, spor, kültür ve sosyal sorumlulukla zenginleştiğinde kalıcı bir deneyime dönüşür." image="/images/gallery-7.jpg" current="Faaliyetlerimiz" />
      <section className="inner-section inner-section--soft" aria-labelledby="activity-title">
        <div className="container">
          <div className="inner-section-header"><div><p className="inner-eyebrow">Dinamik&apos;te yaşam</p><h2 id="activity-title">Her öğrenci için kendini gösterecek yeni bir alan.</h2></div><p>Faaliyetler; öğrencinin iletişim, sorumluluk, yaratıcılık ve ekip çalışması becerilerini günlük okul yaşamının doğal bir parçası hâline getirir.</p></div>
          <div className="support-grid">{activities.map(({ icon: Icon, title, text }) => <article className="support-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>
      <section className="inner-section">
        <div className="container editorial-grid">
          <div className="editorial-visual"><div className="image-frame"><Image src="/images/gallery-4.jpg" alt="Dinamik öğrencileri sosyal etkinlikte" fill sizes="(max-width: 900px) calc(100vw - 48px), 46vw" /></div><span className="image-frame-accent" /></div>
          <div className="editorial-copy"><p className="inner-eyebrow">Birlikte üretmek</p><h2>Okula ait hissetmek, birlikte yaşanan deneyimlerle güçlenir.</h2><p>Kulüpler, etkinlikler, geziler ve proje çalışmaları; öğrencilerin arkadaşlık kurmasını, sorumluluk almasını ve farklı yeteneklerini keşfetmesini destekler.</p><div className="cta-panel-actions"><Link className="button button--primary" href="/galeri">Galeriyi keşfet <ArrowRight size={16} /></Link></div></div>
        </div>
      </section>
    </InnerPageShell>
  );
}
