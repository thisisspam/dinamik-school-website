import type { Metadata } from "next";
import { GraduationCap, HeartHandshake, Sparkles } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { StaffDirectory } from "../components/StaffDirectory";
import { getStaffGroups, getStaffMembers } from "../data/staff";
import { getContentPage } from "@/lib/cms/content";
import { parseContentRows } from "@/lib/cms/helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kadromuz",
  description: "Dinamik Samsun'un mesleki alan, akademik branş ve rehberlik öğretmenlerinden oluşan eğitim kadrosu.",
  alternates: { canonical: "/kadromuz" },
};

export default async function StaffPage() {
  const [staffGroups, staffMembers, page] = await Promise.all([getStaffGroups(), getStaffMembers(), getContentPage("staff")]);
  const content = page.content;
  const featureIcons = [GraduationCap, HeartHandshake, Sparkles];
  const features = parseContentRows(content.features, 2).map(([title, text], index) => ({ title, text, icon: featureIcons[index % featureIcons.length] }));
  const teachingGroups = staffGroups.filter((group) => group.category !== "İdari Kadro");
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={content.heroImage}
        imageAlt={content.heroImageAlt}
        imagePosition="center 70%"
        current="Kadromuz"
        size="slim"
      />
      <section className="inner-section inner-section--soft" aria-labelledby="staff-title">
        <div className="container">
          <div className="inner-section-header"><div><p className="inner-eyebrow">{content.introEyebrow}</p><h2 id="staff-title">{content.introTitle}</h2></div><p>{content.introDescription}</p></div>
          <div className="staff-intro-strip">
            <div><strong>{staffMembers.length}</strong><small>kadro üyesi</small></div>
            <div><strong>{teachingGroups.length}</strong><small>branş grubu</small></div>
            <div><strong>3</strong><small>mesleki alan ekibi</small></div>
            <div><strong>1</strong><small>ortak eğitim kültürü</small></div>
          </div>
          <StaffDirectory staffGroups={teachingGroups} staffMembers={staffMembers} />
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
