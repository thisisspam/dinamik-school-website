import { AnimatedPhotoGallery, type AnimatedGalleryPhoto } from "./AnimatedPhotoGallery";

const WORKSHOP_PHOTOS: AnimatedGalleryPhoto[] = [
  {
    src: "/images/departments/electrical/workshops/tesisat-atolyesi.webp",
    title: "Tesisat Atölyesi",
    description: "Elektrik tesisat devrelerinin eğitim panoları üzerinde güvenli ve uygulamalı biçimde kurulduğu çalışma ortamı.",
    alt: "Tesisat atölyesinde elektrik devre eğitim panoları ve öğrenci çalışma alanları",
  },
  {
    src: "/images/departments/electrical/workshops/elektrik-tesisat-atolyesi.webp",
    title: "Elektrik Tesisat Atölyesi",
    description: "Temel elektrik devreleri, bağlantı teknikleri ve tesisat uygulamalarının bireysel çalışma istasyonlarında öğrenildiği atölye.",
    alt: "Elektrik tesisat atölyesinde bağlantı panoları, el aletleri ve öğrenci çalışma masaları",
  },
  {
    src: "/images/departments/electrical/workshops/zayif-akim-atolyesi.webp",
    title: "Zayıf Akım Atölyesi",
    description: "Ölçme, bağlantı ve düşük gerilimli sistem uygulamalarını destekleyen donanımlı eğitim alanı.",
    alt: "Zayıf akım atölyesinde elektrik eğitim panoları ve ölçüm çalışma masaları",
  },
  {
    src: "/images/departments/electrical/workshops/pano-atolyesi.webp",
    title: "Pano Atölyesi",
    description: "Kuvvet ve kontrol panolarının elemanlarını tanıma, bağlantılarını hazırlama ve test etme çalışmalarının yürütüldüğü atölye.",
    alt: "Pano atölyesinde kumanda elemanları, eğitim panoları ve çalışma masaları",
  },
  {
    src: "/images/departments/electrical/workshops/kumanda-atolyesi.webp",
    title: "Kumanda Atölyesi",
    description: "Motor kumanda devreleri ile yıldız-üçgen bağlantı uygulamalarının eğitim setleri üzerinde gerçekleştirildiği çalışma ortamı.",
    alt: "Kumanda atölyesinde motor kumanda eğitim setleri ve yıldız üçgen bağlantı şeması",
  },
];

export function ElectricalWorkshopGallery() {
  return (
    <AnimatedPhotoGallery
      sectionId="electrical-workshop"
      eyebrow="Elektrik atölyeleri"
      title="Teknik bilgi, atölyede güvenli uygulamaya dönüşür."
      description="Tesisat, zayıf akım, pano ve kumanda atölyelerimizde öğrencilerimiz bağlantı, ölçme, devre kurma ve test süreçlerini donanımlı eğitim ortamlarında deneyimler."
      galleryLabel="Elektrik elektronik teknolojileri atölyeleri"
      thumbnailLabel="Elektrik atölyesi fotoğrafları"
      photos={WORKSHOP_PHOTOS}
      className="electrical-workshop-section"
    />
  );
}
