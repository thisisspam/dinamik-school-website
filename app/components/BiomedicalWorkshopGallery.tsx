import { AnimatedPhotoGallery, type AnimatedGalleryPhoto } from "./AnimatedPhotoGallery";

const WORKSHOP_PHOTOS: AnimatedGalleryPhoto[] = [
  {
    src: "/images/departments/biomedical/workshops/tibbi-goruntuleme-cihazlari-atolyesi.jpeg",
    title: "Tıbbi Görüntüleme Cihazları Atölyesi",
    description: "Görüntüleme cihazlarının bileşenlerini ve çalışma ilkelerini gerçek sistemler üzerinden tanıma alanı.",
    alt: "Tıbbi görüntüleme cihazları atölyesinde tomografi cihazı ve uygulama masaları",
  },
  {
    src: "/images/departments/biomedical/workshops/kalibrasyon-atolyesi.jpeg",
    title: "Kalibrasyon Atölyesi",
    description: "Ölçüm, test ve kalibrasyon süreçlerinin profesyonel cihazlarla uygulandığı teknik çalışma ortamı.",
    alt: "Kalibrasyon atölyesinde osiloskoplar, güç kaynakları ve lehimleme istasyonları",
  },
  {
    src: "/images/departments/biomedical/workshops/bilgisayar-laboratuvari.jpeg",
    title: "Bilgisayar Laboratuvarı",
    description: "Teknik dokümantasyon, cihaz yazılımları ve dijital analiz çalışmalarını destekleyen laboratuvar.",
    alt: "Bilgisayar laboratuvarında çalışma istasyonları ve yeşil öğrenci sandalyeleri",
  },
  {
    src: "/images/departments/biomedical/workshops/baski-devre-lehimleme-atolyesi.jpeg",
    title: "Baskı Devre ve Lehimleme Atölyesi",
    description: "Elektronik devrelerin hazırlanması, montajı ve temel arıza kontrolü için düzenlenen uygulama alanı.",
    alt: "Baskı devre ve lehimleme atölyesindeki çalışma masaları ve eğitim panoları",
  },
  {
    src: "/images/departments/biomedical/workshops/mesleki-fizyoloji-atolyesi.jpeg",
    title: "Mesleki Fizyoloji ve Terminoloji Atölyesi",
    description: "İnsan anatomisi ile tıbbi cihazlar arasındaki ilişkiyi modeller üzerinden kuran öğrenme ortamı.",
    alt: "Mesleki fizyoloji ve terminoloji atölyesinde anatomi modelleri ve uygulama masaları",
  },
  {
    src: "/images/departments/biomedical/workshops/tibbi-goruntuleme-sistemleri-atolyesi.jpeg",
    title: "Tıbbi Görüntüleme Sistemleri Atölyesi",
    description: "Röntgen, tomografi, MR ve ultrason sistemlerinin birlikte ele alındığı kapsamlı uygulama atölyesi.",
    alt: "Tıbbi görüntüleme sistemleri atölyesinde röntgen düzeneği ve sistem eğitim panosu",
  },
];

export function BiomedicalWorkshopGallery() {
  return (
    <AnimatedPhotoGallery
      sectionId="biomedical-workshop"
      eyebrow="Biyomedikal atölyeleri"
      title="Sağlık teknolojisinin geleceği, bu atölyelerde üretilir."
      description="Tıbbi görüntülemeden kalibrasyona, elektronik devrelerden mesleki fizyolojiye uzanan uygulama alanlarımızda teknik bilgi gerçek cihazlarla deneyime dönüşür."
      galleryLabel="Biyomedikal cihaz teknolojileri atölyeleri"
      thumbnailLabel="Atölye fotoğrafları"
      photos={WORKSHOP_PHOTOS}
    />
  );
}
