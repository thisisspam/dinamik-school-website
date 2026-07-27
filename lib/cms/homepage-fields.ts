import type { ContentFieldDefinition } from "./types";

function field(
  key: string,
  label: string,
  group: string,
  type: ContentFieldDefinition["type"],
  defaultValue: string,
  help?: string,
): ContentFieldDefinition {
  return { key, label, group, type, defaultValue, help };
}

export const HOMEPAGE_CONTENT_FIELDS: Record<string, ContentFieldDefinition[]> = {
  hero: [
    field("image", "Ana görsel", "Hero görseli", "image", "/images/homepage-campus-hero.png"),
    field("imageAlt", "Ana görsel açıklaması", "Hero görseli", "text", ""),
    field("secondaryLabel", "İkinci buton metni", "Butonlar", "text", "Okulumuzu Tanıyın"),
    field("secondaryHref", "İkinci buton bağlantısı", "Butonlar", "url", "/okulumuz#okulumuzu-taniyin"),
    field(
      "tiles",
      "Sağdaki tanıtım kartları",
      "Tanıtım kartları",
      "lines",
      [
        "Okulumuzu Tanıyın | /okulumuz#okulumuzu-taniyin | /images/okulumuzu-taniyin-thumb.webp | Dinamik Okulları tanıtım videosu",
        "Uygulamalı Eğitim | #bolumler | /images/uygulamali-egitim-kimya.webp | Kimya laboratuvarında uygulamalı analiz çalışması",
        "Dinamik'te Yaşam | #galeri | /images/activities/social/meb-robot-yarismasi/meb-robot-yarismasi-01.webp | Dinamik Okulları öğrencileri MEB Robot Yarışması'nda",
      ].join("\n"),
      "Her satıra “Başlık | bağlantı | görsel yolu | görsel açıklaması” yazın.",
    ),
  ],
  benefits: [
    field(
      "items",
      "Avantaj kartları",
      "Kartlar",
      "lines",
      "4 Yıl | Ücretsiz Eğitim\n3 Alan | Mesleki Program",
      "Her satıra “Büyük ifade | kısa açıklama” yazın.",
    ),
  ],
  departments: [
    field("cardButtonLabel", "Kart butonu metni", "Bölüm kartları", "text", "Programı incele"),
  ],
  gallery: [
    field(
      "images",
      "Ana sayfa galeri görselleri",
      "Görseller",
      "lines",
      [
        "/images/achievements/urfodu-bilim-yarismasi/urfodu-bilim-yarismasi-02.webp | URFODU bilim yarışması",
        "/images/achievements/codeweek-haftasi/codeweek-haftasi-01.webp | CodeWeek etkinliği",
        "/images/achievements/eren-genc-turkiye-judo-sampiyonu/eren-genc-turkiye-judo-sampiyonu-01.webp | Eren Genç judo başarısı",
        "/images/achievements/mono-palet-yuzme-samsun-dereceleri/mono-palet-yuzme-samsun-dereceleri-01.webp | Mono palet yüzme başarısı",
        "/images/achievements/tahir-oztunc-turkiye-judo-dorduncusu/tahir-oztunc-turkiye-judo-dorduncusu-02.webp | Tahir Öztunç judo başarısı",
        "/images/achievements/codeweek-haftasi/codeweek-haftasi-02.webp | CodeWeek belge töreni",
        "/images/achievements/eren-genc-turkiye-judo-sampiyonu/eren-genc-turkiye-judo-sampiyonu-03.webp | Judo şampiyonası",
        "/images/achievements/tahir-oztunc-turkiye-judo-dorduncusu/tahir-oztunc-turkiye-judo-dorduncusu-03.webp | Judo Türkiye derecesi",
      ].join("\n"),
      "Her satıra “Görsel yolu | görsel açıklaması” yazın.",
    ),
  ],
  campus: [
    field("image", "Bölüm görseli", "Görsel", "image", "/images/campus-meb-robot-yarismasi.webp"),
    field("imageAlt", "Görsel açıklaması", "Görsel", "text", "Dinamik öğrencileri 18. Uluslararası MEB Robot Yarışması'nda"),
    field(
      "features",
      "Öne çıkan özellikler",
      "Özellikler",
      "lines",
      [
        "Modern ve Yüksek Teknolojili Atölyeler | Her alan için güncel teknik altyapı ve uygulama ortamları",
        "Sanayi ile Güçlü İş Birlikleri | Gerçek projeler, staj olanakları ve istihdam fırsatları",
        "Uygulamalı Eğitim Ağırlıklı Müfredat | Teori ve pratiği birleştiren çağdaş eğitim modeli",
        "Üniversite ve Doğrudan İşe Geçiş | İstediğin yolda güçlü bir gelecek için rehberlik",
        "Güvenli ve Sosyal Kampüs | Spor, kültür, sanat ve birlikte üretme kültürü",
      ].join("\n"),
      "Her satıra “Başlık | açıklama” yazın.",
    ),
  ],
  programs: [
    field(
      "cards",
      "Program kartları",
      "Kartlar",
      "lines",
      [
        "Kimya Laboratuvarı Dalı | Kimya Teknolojileri | Temel kimyasal işlemlerden numune analizlerine, klasik analiz yöntemlerinden laboratuvar cihazları ve kromatografik yöntemlere uzanan uygulamalı eğitim. | Nitel ve nicel analiz uygulamaları; Numune alma ve atık yönetimi; GLP ve iş güvenliği yaklaşımı; Cihazlı analiz yöntemleri",
        "Elektrik Tesisatları ve Dağıtımı Dalı | Elektrik-Elektronik Teknolojileri | Temel elektrik-elektronik bilgisini ölçme, devre, proje, pano ve test uygulamalarıyla birleştiren kapsamlı mesleki eğitim. | Devre hesaplama ve ölçme; Simülasyon ve baskı devre; Kuvvet ve kumanda panoları; Tesisat projesi ve test",
        "Tıbbi Görüntüleme Sistemleri | Biyomedikal Cihaz Teknolojileri | Sağlık teknolojileri alanında kullanılan cihazların teknik altyapısını, güvenli kullanımını ve bakım süreçlerini tanıtan uygulama odaklı eğitim. | Tıbbi cihaz sistemleri; Kurulum ve güvenli kullanım; Ölçme, kontrol ve bakım; Teknik dokümantasyon",
      ].join("\n"),
      "Her satıra “Dal | program adı | açıklama | noktalı virgülle maddeler” yazın. Yalnızca okulda aktif eğitim verilen dalları yayınlayın.",
    ),
  ],
  guidance: [
    field(
      "links",
      "Yönlendirme kartları",
      "Kartlar",
      "lines",
      "Rehberlik | Öğrencinin yanında, aileyle birlikte | /rehberlik\nKariyer Planlama | İlgi ve yeteneğe uygun alan seçimi | /bolumler\nSosyal Yaşam | Kültür, sanat, spor ve ekip ruhu | /faaliyetlerimiz",
      "Her satıra “Başlık | açıklama | bağlantı” yazın.",
    ),
  ],
  registration: [
    field("benefits", "Bilgilendirme maddeleri", "Form tanıtımı", "lines", "Üç mesleki alan hakkında bilgi\nKampüs ziyareti planlama\nKayıt süreci ve koşulları"),
  ],
  contact: [
    field("phoneButtonLabel", "Telefon butonu etiketi", "Butonlar", "text", "Telefon"),
    field("whatsappButtonLabel", "WhatsApp butonu etiketi", "Butonlar", "text", "WhatsApp"),
    field("addressLabel", "Adres etiketi", "İletişim kartı", "text", "Adres"),
    field("landlineLabel", "Sabit hat etiketi", "İletişim kartı", "text", "Sabit Hat"),
    field("hoursLabel", "Çalışma saatleri etiketi", "İletişim kartı", "text", "Çalışma Saatleri"),
  ],
  "quick-links": [
    field(
      "links",
      "Hızlı bağlantılar",
      "Bağlantılar",
      "lines",
      "e-Okul Girişi | https://e-okul.meb.gov.tr/\nBölümler | /bolumler\nRehberlik | /rehberlik\nEtkinlikler | /faaliyetlerimiz\nKampüs | /hakkimizda\nBize Ulaşın | /iletisim",
      "Her satıra “Başlık | bağlantı” yazın.",
    ),
  ],
};

export function homepageDefaultContent(sectionKey: string): Record<string, string> {
  return Object.fromEntries((HOMEPAGE_CONTENT_FIELDS[sectionKey] ?? []).map((item) => [item.key, item.defaultValue]));
}
