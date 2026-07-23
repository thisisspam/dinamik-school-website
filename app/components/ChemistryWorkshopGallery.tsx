import { AnimatedPhotoGallery, type AnimatedGalleryPhoto } from "./AnimatedPhotoGallery";

const WORKSHOP_PHOTOS: AnimatedGalleryPhoto[] = [
  {
    src: "/images/departments/chemistry/workshops/temel-kimya-laboratuvari.webp",
    title: "Temel Kimya Laboratuvarı",
    description: "Temel kimyasal işlemler, çözelti hazırlama ve güvenli laboratuvar çalışma alışkanlıklarının uygulandığı eğitim ortamı.",
    alt: "Temel kimya laboratuvarında deney masaları, cam malzemeler ve kimya temalı duvar görselleri",
  },
  {
    src: "/images/departments/chemistry/workshops/organik-kimya-laboratuvari.webp",
    title: "Organik Kimya Laboratuvarı",
    description: "Organik bileşiklerin özelliklerini incelemeye ve laboratuvar tekniklerini deneyimlemeye yönelik donanımlı çalışma alanı.",
    alt: "Organik kimya laboratuvarında çalışma masaları, laboratuvar malzemeleri ve molekül çizimleri",
  },
  {
    src: "/images/departments/chemistry/workshops/anorganik-analitik-kimya-laboratuvari.webp",
    title: "Anorganik ve Analitik Kimya Laboratuvarı",
    description: "Nitel ve nicel analizlerin, ölçüm süreçlerinin ve numune çalışmalarının güvenli biçimde yürütüldüğü laboratuvar.",
    alt: "Anorganik ve analitik kimya laboratuvarında deney tezgâhları, periyodik tablo ve cam malzemeler",
  },
  {
    src: "/images/departments/chemistry/workshops/uretimhane.webp",
    title: "Üretimhane",
    description: "Kimyasal proseslerin temel adımlarını ve üretim ölçeğindeki ekipmanları tanımaya imkân veren uygulama alanı.",
    alt: "Kimya üretimhanesinde paslanmaz çelik kazanlar, depolama tankları ve eğitim masası",
  },
  {
    src: "/images/departments/chemistry/workshops/ogrenciler-analiz-uygulamasi.jpeg",
    title: "Analiz Uygulaması",
    description: "Öğrencilerimiz, öğretmen rehberliğinde ölçüm ve çözelti hazırlama aşamalarını birlikte uyguluyor.",
    alt: "Kimya laboratuvarında cam malzemelerle analiz çalışması yapan iki öğrenci",
    fit: "contain",
    objectPosition: "center 42%",
  },
  {
    src: "/images/departments/chemistry/workshops/kimya-laboratuvari-ogrenci-grubu.jpeg",
    title: "Uygulamalı Kimya Eğitimi",
    description: "Laboratuvar çalışmaları; ekip çalışması, dikkat, sorumluluk ve mesleki güvenlik kültürünü güçlendiriyor.",
    alt: "Kimya laboratuvarında uygulama ürünleriyle birlikte duran öğretmen ve öğrenci grubu",
  },
  {
    src: "/images/departments/chemistry/workshops/ogretmen-rehberliginde-uygulama.jpeg",
    title: "Öğretmen Rehberliğinde Deney",
    description: "Deney süreçleri, doğru tekniklerin yerinde gösterildiği öğretmen rehberliğinde uygulamalı olarak öğreniliyor.",
    alt: "Kimya öğretmeninin laboratuvarda öğrencilere deney tekniği gösterdiği uygulama",
    fit: "contain",
    objectPosition: "center 58%",
  },
];

export function ChemistryWorkshopGallery() {
  return (
    <AnimatedPhotoGallery
      sectionId="chemistry-workshop"
      eyebrow="Kimya laboratuvarları"
      title="Bilimsel merak, laboratuvarda deneyime dönüşür."
      description="Temel, organik, anorganik ve analitik kimya laboratuvarlarından üretimhaneye uzanan uygulama alanlarımızda öğrencilerimiz güvenli çalışma, analiz ve üretim süreçlerini yaşayarak öğrenir."
      galleryLabel="Kimya teknolojileri laboratuvarları ve uygulama çalışmaları"
      thumbnailLabel="Kimya laboratuvarı fotoğrafları"
      photos={WORKSHOP_PHOTOS}
      className="chemistry-workshop-section"
    />
  );
}
