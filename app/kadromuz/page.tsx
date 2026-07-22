import type { Metadata } from "next";
import { GraduationCap, HeartHandshake, Sparkles } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { StaffDirectory } from "../components/StaffDirectory";
import { getStaffGroups, getStaffMembers } from "../data/staff";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kadromuz",
  description: "Dinamik Samsun'un mesleki alan, akademik branş ve rehberlik öğretmenlerinden oluşan eğitim kadrosu.",
  alternates: { canonical: "/kadromuz" },
};

export default async function StaffPage() {
  const [staffGroups, staffMembers] = await Promise.all([getStaffGroups(), getStaffMembers()]);
  return (
    <InnerPageShell>
      <PageHero
        eyebrow="Uzmanlık, deneyim, iş birliği"
        title="Her öğrencinin potansiyeline inanan güçlü bir eğitim ekibi."
        description="Mesleki alan öğretmenlerinden akademik branşlara, rehberlikten sanat ve spora uzanan çok yönlü bir kadro."
        image="/images/kadromuz-banner.png"
        imageAlt="Dinamik Okulları eğitim kadrosu okul binası önünde"
        imagePosition="center 15%"
        current="Kadromuz"
      />
      <section className="inner-section inner-section--soft" aria-labelledby="staff-title">
        <div className="container">
          <div className="inner-section-header"><div><p className="inner-eyebrow">Eğitim kadromuz</p><h2 id="staff-title">Farklı uzmanlıklar, ortak bir eğitim vizyonu.</h2></div><p>Öğretmen listesi, okulun güncel kurumsal kadro yayını temel alınarak branşlara göre düzenlenmiştir.</p></div>
          <div className="staff-intro-strip">
            <div><strong>{staffMembers.length}</strong><small>öğretmen</small></div>
            <div><strong>{staffGroups.length}</strong><small>uzmanlık grubu</small></div>
            <div><strong>3</strong><small>mesleki alan ekibi</small></div>
            <div><strong>1</strong><small>ortak eğitim kültürü</small></div>
          </div>
          <StaffDirectory staffGroups={staffGroups} staffMembers={staffMembers} />
        </div>
      </section>
      <section className="inner-section">
        <div className="container feature-card-grid">
          {[
            { icon: GraduationCap, title: "Alanında uzmanlık", text: "Mesleki ve akademik branşlarda öğrenciyi uygulamayla, araştırmayla ve güncel içerikle buluşturan ekip." },
            { icon: HeartHandshake, title: "Öğrenciyi tanıyan yaklaşım", text: "Akademik, sosyal ve duygusal gelişimi birlikte izleyen rehberlik ve sınıf kültürü." },
            { icon: Sparkles, title: "Birlikte gelişim", text: "Öğretmen iş birliği, disiplinler arası üretim ve güçlü okul-aile iletişimi." },
          ].map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </InnerPageShell>
  );
}
