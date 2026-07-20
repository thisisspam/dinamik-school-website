import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FlaskConical, GraduationCap, Medal, Sparkles, Trophy, Users } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Başarılarımız",
  description: "Dinamik Samsun'un akademik, mesleki, sportif, kültürel ve sosyal başarı yaklaşımı.",
  alternates: { canonical: "/basarilarimiz" },
};

export default function AchievementsPage() {
  const areas = [
    { icon: GraduationCap, title: "Akademik gelişim", text: "Öğrencinin kendi başlangıç noktasından ileriye taşıdığı her kalıcı bilgi ve öğrenme alışkanlığı." },
    { icon: FlaskConical, title: "Mesleki üretim", text: "Atölye ve laboratuvarda fikri doğru, güvenli ve uygulanabilir bir teknik çözüme dönüştürmek." },
    { icon: Trophy, title: "Spor ve takım ruhu", text: "Disiplin, dayanıklılık, adil oyun ve birlikte hedefe ilerleme kültürünü geliştirmek." },
    { icon: Sparkles, title: "Kültür ve sanat", text: "Sahnede, sergide ve yaratıcı üretimde özgün düşünceyi cesaretle görünür kılmak." },
    { icon: Users, title: "Sosyal sorumluluk", text: "Bilgiyi ve emeği toplum yararına kullanmak; dayanışma ve gönüllülük bilinci kazanmak." },
    { icon: Medal, title: "Kişisel gelişim", text: "Sorumluluk almak, iletişim kurmak, zorluklarla baş etmek ve kendi potansiyelini keşfetmek." },
  ];
  return (
    <InnerPageShell>
      <PageHero eyebrow="Başarının çok yönlü hâli" title="Her öğrencinin ilerleyişi, kutlanmaya değer bir başarıdır." description="Akademik sonuçların ötesinde; mesleki beceriyi, takım ruhunu, sanatı, sporu ve toplumsal katkıyı birlikte büyütüyoruz." image="/images/gallery-8.jpg" current="Başarılarımız" />
      <section className="inner-section inner-section--soft" aria-labelledby="achievement-title"><div className="container"><div className="inner-section-header"><div><p className="inner-eyebrow">Başarı kültürü</p><h2 id="achievement-title">Sonuçtan önce emeği, yarıştan önce gelişimi görüyoruz.</h2></div><p>Başarıyı tek bir sınav, derece veya sayı ile sınırlamıyor; öğrencinin bilgi, beceri ve karakter yolculuğunda gösterdiği ilerlemeyle değerlendiriyoruz.</p></div><div className="achievement-grid">{areas.map(({ icon: Icon, title, text }) => <article className="achievement-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="inner-section"><div className="container editorial-grid"><div className="editorial-visual"><div className="image-frame"><Image src="/images/gallery-7.jpg" alt="Dinamik öğrencileri birlikte" fill sizes="(max-width: 900px) calc(100vw - 48px), 46vw" /></div></div><div className="editorial-copy"><p className="inner-eyebrow">Birlikte büyümek</p><h2>Başarının arkasında güven, emek ve güçlü bir ekip vardır.</h2><p>Öğretmen rehberliği, aile iş birliği, öğrenci azmi ve destekleyici kampüs kültürü aynı hedefte buluştuğunda kalıcı gelişim mümkün olur.</p><div className="cta-panel-actions"><Link className="button button--primary" href="/galeri">Güncel çalışmaları gör <ArrowRight size={16} /></Link></div></div></div></section>
    </InnerPageShell>
  );
}
