import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, FlaskConical, GraduationCap, Medal, Sparkles, Trophy, Users } from "lucide-react";
import { AnimatedPhotoGallery } from "../components/AnimatedPhotoGallery";
import { ScrollToSectionLink } from "../components/ScrollToSectionLink";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { achievementPhotos } from "../data/achievements";
import { getContentPage } from "@/lib/cms/content";
import { parseContentRows } from "@/lib/cms/helpers";
import { getManagedMediaCollection } from "@/lib/cms/media-collections";

export const metadata: Metadata = {
  title: "Başarılarımız",
  description: "Dinamik Samsun'un akademik, mesleki, sportif, kültürel ve sosyal başarı yaklaşımı.",
  alternates: { canonical: "/basarilarimiz" },
};

export default async function AchievementsPage() {
  const [page, managedAchievementPhotos] = await Promise.all([
    getContentPage("achievements"),
    getManagedMediaCollection("achievements", achievementPhotos),
  ]);
  const content = page.content;
  const icons = [GraduationCap, FlaskConical, Trophy, Sparkles, Users, Medal];
  const areas = parseContentRows(content.areas, 2).map(([title, text], index) => ({ title, text, icon: icons[index % icons.length] }));
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} description={content.heroDescription} image={content.heroImage} imageAlt={content.heroImageAlt} current="Başarılarımız" />
      <section className="inner-section inner-section--soft" aria-labelledby="achievement-title"><div className="container"><div className="inner-section-header"><div><p className="inner-eyebrow">{content.introEyebrow}</p><h2 id="achievement-title">{content.introTitle}</h2></div><p>{content.introDescription}</p></div><div className="achievement-grid">{areas.map(({ icon: Icon, title, text }) => <article className="achievement-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <AnimatedPhotoGallery
        sectionId="basari-galerisi"
        eyebrow={content.galleryEyebrow}
        title={content.galleryTitle}
        description={content.galleryDescription}
        galleryLabel="Öğrenci başarıları"
        thumbnailLabel="Başarı fotoğrafları"
        photos={managedAchievementPhotos}
        className="achievement-gallery-section"
      />
      <section className="inner-section"><div className="container editorial-grid"><div className="editorial-visual"><div className="image-frame"><Image src={content.editorialImage} alt="Dinamik öğrencilerinin başarıları" fill sizes="(max-width: 900px) calc(100vw - 48px), 46vw" /></div></div><div className="editorial-copy"><p className="inner-eyebrow">{content.editorialEyebrow}</p><h2>{content.editorialTitle}</h2><p>{content.editorialDescription}</p><div className="cta-panel-actions"><ScrollToSectionLink className="button button--primary" targetId="basari-galerisi" scrollTargetId="basari-galerisi-galeri">Başarı galerimizi inceleyin <ArrowRight size={16} /></ScrollToSectionLink></div></div></div></section>
    </InnerPageShell>
  );
}
