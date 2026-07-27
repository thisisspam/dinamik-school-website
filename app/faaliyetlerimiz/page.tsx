import type { Metadata } from "next";
import { Drama, Dumbbell, FlaskConical, Music, Palette, Users } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { AnimatedPhotoGallery } from "../components/AnimatedPhotoGallery";
import { createAlbumPhotos, type AnimatedGalleryPhoto } from "../data/animated-gallery";
import { getContentPage } from "@/lib/cms/content";
import { parseContentRows } from "@/lib/cms/helpers";
import { getActivityCollectionPhotos } from "@/lib/cms/activity-albums";

export const metadata: Metadata = {
  title: "Faaliyetlerimiz",
  description: "Dinamik Samsun'da sosyal, kültürel, bilimsel ve sportif öğrenci çalışmaları.",
  alternates: { canonical: "/faaliyetlerimiz" },
};

const socialActivityPhotos = createAlbumPhotos("/images/activities/social", [
  {
    slug: "ahsap-workshop",
    title: "Ahşap Workshop",
    description: "Öğrencilerimiz el becerilerini, yaratıcılıklarını ve birlikte üretme deneyimini ahşap çalışmalarıyla geliştirdi.",
    photoCount: 5,
  },
  {
    slug: "barinak-etkinligi",
    title: "Barınak Etkinliği",
    description: "Barınak ziyaretiyle öğrencilerimiz hayvan sevgisini, gönüllülüğü ve toplumsal sorumluluğu birlikte deneyimledi.",
    photoCount: 9,
  },
  {
    slug: "battalks-etkinligi",
    title: "BatTalks Etkinliği",
    description: "Söyleşi ve paylaşım ortamı, öğrencilerimizin farklı deneyimleri dinlemesine ve yeni bakış açıları kazanmasına katkı sağladı.",
    photoCount: 5,
  },
  {
    slug: "bilim-senligi",
    title: "Bilim Şenliği",
    description: "Projeler, deneyler ve öğrenci sunumlarıyla bilimsel merakın üretime dönüştüğü kapsamlı bir şenlik gerçekleştirdik.",
    photoCount: 24,
  },
  {
    slug: "e-twinning-kalite-etiketi-toreni",
    title: "eTwinning Kalite Etiketi Töreni",
    description: "Uluslararası iş birliğini ve nitelikli proje çalışmalarını belgeleyen kalite etiketi başarısını öğrencilerimizle birlikte kutladık.",
    photoCount: 3,
  },
  {
    slug: "elektrik-bolumu-fabrika-gezileri",
    title: "Elektrik Bölümü Fabrika Gezileri",
    description: "Teknik gezilerde öğrencilerimiz üretim süreçlerini yerinde gözlemledi ve mesleki bilgilerini sektör deneyimiyle pekiştirdi.",
    photoCount: 13,
  },
  {
    slug: "fidan-dikimi",
    title: "Fidan Dikimi",
    description: "Doğaya karşı sorumluluk bilincini büyüten fidan dikimi etkinliğinde geleceğe birlikte nefes olduk.",
    photoCount: 7,
  },
  {
    slug: "meb-robot-yarismasi",
    title: "MEB Robot Yarışması",
    description: "Öğrencilerimiz tasarım, yazılım ve takım çalışması becerilerini robot projeleriyle yarışma heyecanına taşıdı.",
    photoCount: 10,
  },
  {
    slug: "okaf",
    title: "OKAF",
    description: "Orta Karadeniz Kariyer Fuarı ziyareti, öğrencilerimizin meslekleri ve kariyer olanaklarını yakından tanımasına imkân verdi.",
    photoCount: 7,
  },
  {
    slug: "okul-sporlari",
    title: "Okul Sporları",
    description: "Sportif karşılaşmalar, öğrencilerimizin disiplinini, dayanıklılığını ve takım ruhunu güçlendirdi.",
    photoCount: 7,
  },
  {
    slug: "piknik-ve-bowling",
    title: "Piknik ve Bowling",
    description: "Okul dışında birlikte geçirilen keyifli zamanlar, arkadaşlığı ve okul topluluğuna aidiyeti güçlendirdi.",
    photoCount: 10,
  },
  {
    slug: "seramik-workshop",
    title: "Seramik Workshop",
    description: "Seramik çalışmalarıyla öğrencilerimiz hayal güçlerini biçimlendirirken sabır, dikkat ve el becerilerini geliştirdi.",
    photoCount: 4,
  },
  {
    slug: "siber-zorbalik-farkindalik-etkinligi",
    title: "Siber Zorbalık Farkındalık Etkinliği",
    description: "Güvenli dijital iletişim ve siber zorbalık konusunda farkındalık oluşturan bilgilendirici bir buluşma gerçekleştirdik.",
    photoCount: 2,
  },
  {
    slug: "vision-board-etkinligi",
    title: "Vision Board Etkinliği",
    description: "Öğrencilerimiz hedeflerini ve hayallerini görsel bir anlatıma dönüştürerek gelecek planlarını yaratıcı biçimde ifade etti.",
    photoCount: 4,
  },
  {
    slug: "yil-sonu-ingilizce-zumresi-gosterisi",
    title: "Yıl Sonu İngilizce Zümresi Gösterisi",
    description: "İngilizce gösterileri, öğrencilerimizin dil becerilerini sahne deneyimi ve özgüvenle buluşturdu.",
    photoCount: 6,
  },
]);

const culturalActivityPhotos = createAlbumPhotos("/images/activities/cultural", [
  {
    slug: "18-mart-etkinligi",
    title: "18 Mart Etkinliği",
    description: "Çanakkale Zaferi ve şehitlerimizi anma programında tarih bilincini, saygıyı ve ortak hafızamızı sahneye taşıdık.",
    photoCount: 9,
  },
  {
    slug: "ankara-gezisi",
    title: "Ankara Gezisi",
    description: "Başkentimizin tarihî ve kültürel duraklarını yerinde tanıyan öğrencilerimiz birlikte yeni deneyimler biriktirdi.",
    photoCount: 6,
  },
  {
    slug: "erasmusdays-etkinligi",
    title: "ErasmusDays Etkinliği",
    description: "ErasmusDays kapsamında kültürler arası etkileşimi, uluslararası öğrenme fırsatlarını ve ortak proje deneyimlerini paylaştık.",
    photoCount: 8,
  },
  {
    slug: "eskisehir-gezisi",
    title: "Eskişehir Gezisi",
    description: "Eskişehir'in kültürel dokusunu ve kent yaşamını keşfeden öğrencilerimiz gezi boyunca gözlem ve paylaşım imkânı buldu.",
    photoCount: 7,
  },
  {
    slug: "kitap-fuari",
    title: "Kitap Fuarı",
    description: "Kitap fuarı ziyaretiyle öğrencilerimiz yazarlar, yayınlar ve yeni düşünce dünyalarıyla bir araya geldi.",
    photoCount: 6,
  },
  {
    slug: "mevlid-i-nebi-haftasi",
    title: "Mevlid-i Nebi Haftası",
    description: "Mevlid-i Nebi Haftası programında değerlerimizi, birlik duygusunu ve paylaşmanın anlamını birlikte yaşadık.",
    photoCount: 7,
  },
  {
    slug: "polonyadan-gelen-ogrenciler",
    title: "Polonya'dan Gelen Öğrenciler",
    description: "Polonya'dan gelen öğrencilerle gerçekleştirdiğimiz buluşma, kültürler arası iletişim ve dostluk için değerli bir ortam oluşturdu.",
    photoCount: 4,
  },
]);

const sportingActivityPhotos: AnimatedGalleryPhoto[] = [
  {
    src: "/images/activities/sports/judo-basari-takimi.jpeg",
    title: "Judo takımımızdan gurur tablosu",
    description: "Öğrencilerimizin azmi, antrenör desteği ve Dinamik takım ruhu aynı başarı karesinde buluşuyor.",
    alt: "Madalyalı judo sporcuları ve antrenörlerin Dinamik Okulları bayrağıyla grup fotoğrafı",
    fit: "contain",
    objectPosition: "center 42%",
  },
  {
    src: "/images/activities/sports/futsal-takimi-sahada.jpeg",
    title: "Futsal takımımız sahada",
    description: "Takımımız, disiplinli hazırlığını ve birlikte mücadele kültürünü sahaya taşıyor.",
    alt: "Dinamik futsal takımının spor salonundaki takım fotoğrafı",
    objectPosition: "center 46%",
  },
  {
    src: "/images/activities/sports/judo-sporcusu-ve-antrenorler.jpeg",
    title: "Başarıyı birlikte kutluyoruz",
    description: "Sporcu ve antrenör arasındaki güven, kararlı çalışmayı kalıcı bir başarı deneyimine dönüştürüyor.",
    alt: "Madalyalı Dinamik judo sporcusunun iki antrenörüyle fotoğrafı",
    fit: "contain",
  },
  {
    src: "/images/activities/sports/futsal-takimi-soyunma-odasi.jpeg",
    title: "Takım ruhu her an bizimle",
    description: "Maç öncesinden son düdüğe kadar birlik, motivasyon ve birbirine destek takımımızın gücünü oluşturuyor.",
    alt: "Dinamik futsal takımının soyunma odasındaki kutlama fotoğrafı",
    objectPosition: "center 40%",
  },
  {
    src: "/images/activities/sports/judo-musabaka-sporcusu.jpeg",
    title: "Müsabakaya tam odak",
    description: "Teknik hazırlık, öz disiplin ve cesaret; öğrencilerimizin sportif gelişiminin temelini oluşturuyor.",
    alt: "Müsabaka alanında mavi judogi giyen Dinamik judo sporcusu",
    objectPosition: "center 28%",
  },
  {
    src: "/images/activities/sports/futsal-takimi-turnuva.jpeg",
    title: "Birlikte mücadele, birlikte gelişim",
    description: "Turnuva deneyimi, öğrencilerimize dayanıklılık, sorumluluk ve ortak hedef bilinci kazandırıyor.",
    alt: "Dinamik futsal takımının turnuva salonundaki grup fotoğrafı",
    fit: "contain",
    objectPosition: "center 36%",
  },
  {
    src: "/images/activities/sports/judo-kursu-sporcusu.jpeg",
    title: "Kürsü heyecanı",
    description: "Emek ve istikrarla gelen her derece, yeni hedefler için güçlü bir motivasyona dönüşüyor.",
    alt: "Madalyası ve başarı belgesiyle kürsüde duran Dinamik judo sporcusu",
    fit: "contain",
    objectPosition: "center 34%",
  },
];

export default async function ActivitiesPage() {
  const [page, managedSportingPhotos, managedSocialPhotos, managedCulturalPhotos] = await Promise.all([
    getContentPage("activities"),
    getActivityCollectionPhotos("activities-sport", sportingActivityPhotos),
    getActivityCollectionPhotos("activities-social", socialActivityPhotos),
    getActivityCollectionPhotos("activities-cultural", culturalActivityPhotos),
  ]);
  const content = page.content;
  const icons = [FlaskConical, Drama, Dumbbell, Palette, Users, Music];
  const activities = parseContentRows(content.areas, 2).map(([title, text], index) => ({ title, text, icon: icons[index % icons.length] }));
  return (
    <InnerPageShell theme={page.theme}>
      <PageHero eyebrow={content.heroEyebrow} title={content.heroTitle} description={content.heroDescription} image={content.heroImage} imageAlt={content.heroImageAlt} current="Faaliyetlerimiz" />
      <section className="inner-section inner-section--soft" aria-labelledby="activity-title">
        <div className="container">
          <div className="inner-section-header"><div><p className="inner-eyebrow">{content.introEyebrow}</p><h2 id="activity-title">{content.introTitle}</h2></div><p>{content.introDescription}</p></div>
          <div className="support-grid">{activities.map(({ icon: Icon, title, text }) => <article className="support-card" key={title}><span><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>
      <AnimatedPhotoGallery
        sectionId="sportif-faaliyetler"
        eyebrow={content.sportEyebrow}
        title={content.sportTitle}
        description={content.sportDescription}
        galleryLabel="Sportif faaliyetler"
        thumbnailLabel="Sportif faaliyet fotoğrafları"
        photos={managedSportingPhotos}
        className="activity-gallery-section activity-gallery-section--sporting"
      />
      <AnimatedPhotoGallery
        sectionId="sosyal-faaliyetler"
        eyebrow={content.socialEyebrow}
        title={content.socialTitle}
        description={content.socialDescription}
        galleryLabel="Sosyal faaliyetler"
        thumbnailLabel="Sosyal faaliyet fotoğrafları"
        photos={managedSocialPhotos}
        className="activity-gallery-section activity-gallery-section--social"
      />
      <AnimatedPhotoGallery
        sectionId="kulturel-faaliyetler"
        eyebrow={content.culturalEyebrow}
        title={content.culturalTitle}
        description={content.culturalDescription}
        galleryLabel="Kültürel faaliyetler"
        thumbnailLabel="Kültürel faaliyet fotoğrafları"
        photos={managedCulturalPhotos}
        className="activity-gallery-section activity-gallery-section--cultural"
      />
    </InnerPageShell>
  );
}
