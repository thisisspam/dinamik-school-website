import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shirt, Sparkles, ShieldCheck } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Okul Kıyafetlerimiz",
  description: "Dinamik Samsun 2025-2026 eğitim öğretim yılından itibaren geçerli okul kıyafeti bilgileri.",
  alternates: { canonical: "/okul-kiyafetlerimiz" },
};

export default function SchoolUniformPage() {
  return (
    <InnerPageShell>
      <PageHero eyebrow="Kurumsal aidiyet" title="Sade, rahat ve Dinamik okul kültürüne ait." description="Öğrencilerimizin okul gününde düzenli, rahat ve ortak kimliği yansıtan bir görünümle hareket etmesi için belirlenen kıyafet düzeni." image="/images/gallery-2.jpg" current="Okul Kıyafetlerimiz" compact />
      <section className="inner-section inner-section--soft">
        <div className="container uniform-layout">
          <div className="uniform-image"><Image src="/images/school-uniforms.jpg" alt="Dinamik Okulları bordo polo yaka üst ve siyah pantolondan oluşan okul kıyafeti" fill sizes="(max-width: 900px) calc(100vw - 48px), 55vw" /></div>
          <div className="editorial-copy">
            <p className="inner-eyebrow">2025-2026 eğitim öğretim yılı</p>
            <h2>Okul kıyafetimiz.</h2>
            <p>Kısa veya uzun kollu bordo polo yaka üst, siyah pantolonla tamamlanır. Ortak kıyafet düzeni okul aidiyetini güçlendirirken öğrencinin gün boyu rahat hareket etmesini destekler.</p>
            <ul className="check-list-grid">
              <li><CheckCircle2 size={17} />Bordo polo yaka üst</li>
              <li><CheckCircle2 size={17} />Siyah pantolon</li>
              <li><CheckCircle2 size={17} />Kısa veya uzun kol seçeneği</li>
              <li><CheckCircle2 size={17} />Sade ve kurumsal görünüm</li>
            </ul>
            <p className="uniform-note">Beden, tedarik ve dönemsel uygulama ayrıntıları için kayıt birimimizle iletişime geçebilirsiniz.</p>
            <div className="cta-panel-actions"><Link className="button button--primary" href="/iletisim">Bilgi alın <ArrowRight size={16} /></Link></div>
          </div>
        </div>
      </section>
      <section className="inner-section">
        <div className="container feature-card-grid">
          {[
            { icon: Shirt, title: "Günlük rahatlık", text: "Okul, atölye ve sosyal etkinlik günlerinde düzenli ve rahat bir kullanım." },
            { icon: ShieldCheck, title: "Ortak okul kültürü", text: "Dinamik öğrencilerini bir araya getiren sade ve ayırt edici bir kurumsal görünüm." },
            { icon: Sparkles, title: "Temiz ve özenli görünüm", text: "Öğrenme ortamına uygun, dikkat dağıtmayan ve kolay kombinlenen parçalar." },
          ].map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </InnerPageShell>
  );
}
