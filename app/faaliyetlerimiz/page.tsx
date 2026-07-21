import type { Metadata } from "next";
import { Drama, Dumbbell, FlaskConical, Music, Palette, Users } from "lucide-react";
import { InnerPageShell } from "../components/SiteChrome";
import { PageHero } from "../components/PageHero";
import { AnimatedPhotoGallery, type AnimatedGalleryPhoto } from "../components/AnimatedPhotoGallery";

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

const socialActivityPhotos: AnimatedGalleryPhoto[] = [
  {
    src: "/images/gallery-1.jpg",
    title: "Kış etkinliğinde birlikte",
    description: "Açık havada geçirilen keyifli zamanlar, arkadaşlığı ve okul yaşamına ait güzel anıları çoğaltır.",
    alt: "Dinamik öğrencilerinin açık havadaki kış etkinliği",
  },
  {
    src: "/images/gallery-2.jpg",
    title: "Kampüs dışında sosyal buluşma",
    description: "Geziler ve ortak etkinlikler, öğrencilerin farklı ortamlarda paylaşım kurmasına imkân verir.",
    alt: "Dinamik öğrencilerinin kış gezisindeki sosyal buluşması",
  },
  {
    src: "/images/gallery-4.jpg",
    title: "Paylaşılan anılar",
    description: "Birlikte planlanan etkinlikler, okul topluluğundaki dayanışmayı ve iletişimi güçlendirir.",
    alt: "Dinamik okul topluluğunun açık hava etkinliği",
  },
];

const culturalActivityPhotos: AnimatedGalleryPhoto[] = [
  {
    src: "/images/gallery-3.jpg",
    title: "Kültür gezisinden bir mola",
    description: "Gezi programları; yeni yerleri tanımayı, gözlem yapmayı ve ortak deneyimler biriktirmeyi destekler.",
    alt: "Dinamik okul topluluğunun kültür gezisindeki açık hava molası",
  },
  {
    src: "/images/gallery-7.jpg",
    title: "Fuar ve kültür gezisi",
    description: "Öğrencilerimiz okul dışındaki etkinliklerde yayıncılık, sanat ve farklı üretim alanlarıyla buluşur.",
    alt: "Dinamik öğrencilerinin Samsun Fuar ve Kongre Merkezi ziyareti",
  },
  {
    src: "/images/gallery-8.jpg",
    title: "Yeni dünyaları birlikte keşfetmek",
    description: "Kültürel buluşmalar, merakı beslerken öğrencilerin ilgi alanlarını zenginleştirir.",
    alt: "Dinamik öğrencilerinin kültürel fuar gezisindeki grup fotoğrafı",
  },
];

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
      <AnimatedPhotoGallery
        sectionId="sportif-faaliyetler"
        eyebrow="Sportif faaliyetler"
        title="Emek, disiplin ve takım ruhuyla gelen başarı."
        description="Judo ve futsal çalışmalarımızda öğrencilerimiz; teknik becerilerini geliştirirken dayanıklılık, öz güven ve birlikte mücadele etme kültürü kazanır."
        galleryLabel="Sportif faaliyetler"
        thumbnailLabel="Sportif faaliyet fotoğrafları"
        photos={sportingActivityPhotos}
        className="activity-gallery-section activity-gallery-section--sporting"
      />
      <AnimatedPhotoGallery
        sectionId="sosyal-faaliyetler"
        eyebrow="Sosyal faaliyetler"
        title="Arkadaşlık, paylaşım ve dayanışma okul yaşamının her anında."
        description="Gezi, buluşma ve ortak etkinlikler; öğrencilerimizin iletişim kurduğu, sorumluluk aldığı ve birlikte güzel anılar biriktirdiği sosyal alanlar oluşturur."
        galleryLabel="Sosyal faaliyetler"
        thumbnailLabel="Sosyal faaliyet fotoğrafları"
        photos={socialActivityPhotos}
        className="activity-gallery-section activity-gallery-section--social"
      />
      <AnimatedPhotoGallery
        sectionId="kulturel-faaliyetler"
        eyebrow="Kültürel faaliyetler"
        title="Merak, sanat ve kültürle beslenen yeni keşifler."
        description="Fuarlar, geziler ve kültürel buluşmalar; öğrencilerimizin dünyaya farklı açılardan bakmasına ve yeni ilgi alanları geliştirmesine katkı sağlar."
        galleryLabel="Kültürel faaliyetler"
        thumbnailLabel="Kültürel faaliyet fotoğrafları"
        photos={culturalActivityPhotos}
        className="activity-gallery-section activity-gallery-section--cultural"
      />
    </InnerPageShell>
  );
}
