import type { ContentFieldDefinition, ContentPageDefinition } from "./types";

type FieldOptions = Pick<ContentFieldDefinition, "help" | "required">;

function field(
  key: string,
  label: string,
  group: string,
  type: ContentFieldDefinition["type"],
  defaultValue: string,
  options: FieldOptions = {},
): ContentFieldDefinition {
  const resolvedType = type === "lines" && defaultValue.includes("|") ? "structured-list" : type;
  return { key, label, group, type: resolvedType, defaultValue, ...options };
}

function heroFields(values: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}): ContentFieldDefinition[] {
  return [
    field("heroEyebrow", "Üst etiket", "Sayfa üst alanı", "text", values.eyebrow, { required: true }),
    field("heroTitle", "Ana başlık", "Sayfa üst alanı", "textarea", values.title, { required: true }),
    field("heroDescription", "Açıklama", "Sayfa üst alanı", "textarea", values.description, { required: true }),
    field("heroImage", "Kapak görseli", "Sayfa üst alanı", "image", values.image, { required: true }),
    field("heroImageAlt", "Kapak görseli açıklaması", "Sayfa üst alanı", "text", values.imageAlt ?? ""),
  ];
}

const siteChrome: ContentPageDefinition = {
  key: "site-chrome",
  displayName: "Header, Menü ve Footer",
  route: "Tüm site",
  category: "Genel",
  description: "Üst menü, kurumsal butonlar, footer bağlantıları ve SEO metinlerini tek yerden yönetin.",
  fields: [
    field("siteName", "Site adı", "Arama motorları", "text", "Dinamik Mesleki ve Teknik Anadolu Lisesi | Samsun", { required: true }),
    field("seoDescription", "Site açıklaması", "Arama motorları", "textarea", "Samsun Dinamik Mesleki ve Teknik Anadolu Lisesi; üç mesleki alanda dört yıl ücretsiz, uygulamalı eğitim sunar.", { required: true }),
    field("headerPrimaryLabel", "Birinci buton metni", "Header", "text", "Ön Kayıt", { required: true }),
    field("headerPrimaryHref", "Birinci buton bağlantısı", "Header", "url", "/on-kayit", { required: true }),
    field("headerSecondaryLabel", "İkinci buton metni", "Header", "text", "e-Okul", { required: true }),
    field("headerSecondaryHref", "İkinci buton bağlantısı", "Header", "url", "https://e-okul.meb.gov.tr/", { required: true }),
    field(
      "navigation",
      "Ana menü",
      "Header",
      "lines",
      [
        "Anasayfa | /",
        "Bölümler | /bolumler",
        "- Kimya Teknolojileri | /bolumler/kimya-teknolojileri",
        "- Elektrik - Elektronik | /bolumler/elektrik-elektronik-teknolojileri",
        "- Biyomedikal Cihaz | /bolumler/biyomedikal-cihaz-teknolojileri",
        "Okulumuz | /okulumuz",
        "- Hakkımızda | /hakkimizda",
        "- Okul Kıyafetlerimiz | /okul-kiyafetlerimiz",
        "- Rehberlik | /rehberlik",
        "Kadromuz | /kadromuz",
        "Galeri | /faaliyetlerimiz",
        "- Faaliyetlerimiz | /faaliyetlerimiz",
        "- Fotoğraf Galerisi | /galeri",
        "Başarılar | /basarilarimiz",
        "İletişim | /iletisim",
      ].join("\n"),
      { help: "Her satıra “Başlık | bağlantı” yazın. Alt menüler için satırın başına - işareti koyun.", required: true },
    ),
    field("footerTagline", "Logo altı slogan", "Footer", "text", "Meslek sahibi, gelecek sahibi.", { required: true }),
    field("footerFirstTitle", "Birinci sütun başlığı", "Footer", "text", "Okulumuz", { required: true }),
    field(
      "footerFirstLinks",
      "Birinci sütun bağlantıları",
      "Footer",
      "lines",
      "Hakkımızda | /hakkimizda\nKadromuz | /kadromuz\nOkul Kıyafetleri | /okul-kiyafetlerimiz\nRehberlik | /rehberlik",
      { help: "Her satıra “Başlık | bağlantı” yazın.", required: true },
    ),
    field("footerSecondTitle", "İkinci sütun başlığı", "Footer", "text", "Keşfet", { required: true }),
    field(
      "footerSecondLinks",
      "İkinci sütun bağlantıları",
      "Footer",
      "lines",
      "Bölümlerimiz | /bolumler\nFaaliyetlerimiz | /faaliyetlerimiz\nGaleri | /galeri\nBaşarılarımız | /basarilarimiz",
      { help: "Her satıra “Başlık | bağlantı” yazın.", required: true },
    ),
    field("footerContactTitle", "İletişim sütunu başlığı", "Footer", "text", "İletişim", { required: true }),
    field("copyrightText", "Telif metni", "Footer", "text", "Dinamik Mesleki ve Teknik Anadolu Lisesi", { required: true }),
    field("footerLegalLabel", "Yasal bağlantı metni", "Footer", "text", "KVKK Aydınlatma ve Veri Güvenliği", { required: true }),
    field("footerLocation", "Alt bilgi konumu", "Footer", "text", "Samsun / Türkiye", { required: true }),
  ],
};

const about: ContentPageDefinition = {
  key: "about",
  displayName: "Hakkımızda",
  route: "/hakkimizda",
  category: "Kurumsal",
  description: "Kurumsal hikâye, eğitim modeli, vizyon, misyon, kalite politikası ve çağrı alanı.",
  fields: [
    ...heroFields({
      eyebrow: "Dinamik bir eğitim kültürü",
      title: "Geleceği meslekle, bilgiyi uygulamayla buluşturuyoruz.",
      description: "Öğrencilerimizi yalnızca bir diplomaya değil; yetkinliğe, özgüvene ve değişen dünyanın ihtiyaçlarına hazırlayan ücretsiz bir eğitim modeli sunuyoruz.",
      image: "/images/about-school-campus.png",
      imageAlt: "Dinamik Mesleki ve Teknik Anadolu Lisesi binası önündeki öğrenciler",
    }),
    field("heroPrimaryLabel", "Birinci buton", "Sayfa üst alanı", "text", "Eğitim yaklaşımımız", { required: true }),
    field("heroPrimaryHref", "Birinci buton bağlantısı", "Sayfa üst alanı", "url", "#egitim-yaklasimimiz", { required: true }),
    field("heroSecondaryLabel", "İkinci buton", "Sayfa üst alanı", "text", "Bölümlerimizi keşfedin", { required: true }),
    field("heroSecondaryHref", "İkinci buton bağlantısı", "Sayfa üst alanı", "url", "/bolumler", { required: true }),
    field("heroBadgeTitle", "Bilgi kartı başlığı", "Sayfa üst alanı", "text", "Özel okul standartları", { required: true }),
    field("heroBadgeText", "Bilgi kartı açıklaması", "Sayfa üst alanı", "text", "Dört yıl boyunca ücretsiz eğitim", { required: true }),
    field("storyEyebrow", "Üst etiket", "Kurumsal hikâye", "text", "Kurumsal hikâyemiz", { required: true }),
    field("storyTitle", "Başlık", "Kurumsal hikâye", "text", "Özel Dinamik Mesleki ve Teknik Anadolu Lisesi", { required: true }),
    field("storyYear", "Kuruluş yılı", "Kurumsal hikâye", "text", "2018", { required: true }),
    field("storyYearText", "Kuruluş yılı açıklaması", "Kurumsal hikâye", "text", "Samsun’da başlayan eğitim yolculuğumuz", { required: true }),
    field(
      "storyParagraphs",
      "Hikâye paragrafları",
      "Kurumsal hikâye",
      "lines",
      [
        "Özel Dinamik Mesleki ve Teknik Anadolu Lisesi, 2018 yılında Samsun’da eğitime başlayan, devlet destekli özel mesleki ve teknik Anadolu lisesi olarak öğrencilerine nitelikli akademik ve mesleki eğitim sunmak amacıyla kurulmuştur. Kurulduğu günden bu yana, çağın ihtiyaçlarına uygun teknik donanıma sahip, üretken, araştıran ve üniversite hedefi olan bireyler yetiştirmeyi temel ilke edinmiştir.",
        "Okulumuz; öğrencilerin yalnızca meslek sahibi olmalarını değil, aynı zamanda güçlü bir akademik altyapıyla yükseköğretime hazırlanmalarını sağlayan eğitim anlayışıyla faaliyet göstermektedir. Anadolu Lisesi müfredatı ile mesleki eğitimi bir araya getiren eğitim modeli sayesinde öğrenciler hem üniversite sınavına hazırlanmakta hem de uygulamalı meslek eğitimi almaktadır.",
        "Kuruluşundan itibaren Elektrik-Elektronik Teknolojileri, Kimya Teknolojileri ve Biyomedikal Cihaz Teknolojileri alanlarında eğitim veren okulumuz, özellikle Samsun’da Biyomedikal Cihaz Teknolojileri alanındaki öncü eğitim kurumlarından biri olarak dikkat çekmektedir. Modern laboratuvarlar, uygulama atölyeleri ve alanında uzman öğretmen kadrosuyla öğrencilerine teorik bilginin yanında uygulama becerisi de kazandırmaktadır.",
        "Öğrencilerimiz eğitim sürecinde işletmelerde beceri eğitimi (staj), proje tabanlı çalışmalar, bilim şenlikleri, sosyal ve kültürel etkinlikler ile çok yönlü gelişim fırsatı elde etmektedir. Her yıl düzenlenen bilim şenliklerinde öğrencilerimizin hazırladığı özgün projeler sergilenerek üretim odaklı eğitim anlayışımız somut çıktılarla desteklenmektedir.",
        "Okulumuz, MTOK (Mesleki ve Teknik Ortaöğretim Kurumları) avantajı sayesinde öğrencilerine birçok mühendislik, teknoloji ve lisans programına ek yerleştirme imkânı sunarken; isteyen öğrenciler için ön lisans programlarına geçiş ve lise mezunu teknisyen olarak kamu ile özel sektörde kariyer fırsatları da sağlamaktadır.",
        "Disiplinli eğitim anlayışı, butik sınıfları, güçlü rehberlik hizmetleri ve bireysel öğrenci takibiyle kısa sürede Samsun’un tercih edilen mesleki eğitim kurumlarından biri hâline gelen Özel Samsun Dinamik Mesleki ve Teknik Anadolu Lisesi; yetiştirdiği başarılı mezunları, üniversite yerleştirme başarıları ve sektörle kurduğu güçlü iş birlikleriyle eğitim yolculuğunu her geçen yıl daha da ileri taşımaktadır.",
        "Bugün Özel Dinamik Mesleki ve Teknik Anadolu Lisesi; “Geleceğin Mesleğine Giden Yol Dinamik’te Başlar” anlayışıyla, teknolojiyi üreten, bilimsel düşünen, milli ve manevi değerlere bağlı, nitelikli gençler yetiştirmeye kararlılıkla devam etmektedir.",
      ].join("\n"),
      { help: "Her satır ayrı paragraf olarak yayınlanır.", required: true },
    ),
    field("approachEyebrow", "Üst etiket", "Eğitim yaklaşımı", "text", "Okulumuz", { required: true }),
    field("approachTitle", "Başlık", "Eğitim yaklaşımı", "textarea", "Teori sınıfta başlar, deneyim gerçek hayatta tamamlanır.", { required: true }),
    field("approachLead", "Öne çıkan metin", "Eğitim yaklaşımı", "textarea", "Dinamik Mesleki ve Teknik Anadolu Lisesi, akademik gelişim ile mesleki yetkinliği aynı eğitim yolculuğunda bir araya getirir.", { required: true }),
    field("approachText", "Açıklama", "Eğitim yaklaşımı", "textarea", "Eğitim; donanımlı atölye ve laboratuvarların yanı sıra protokol anlaşmalı sanayi kuruluşlarında desteklenir. Öğrencilerimiz teorik bilgiyi üretim ortamında uygulama fırsatı bulur; iş dünyasına ve yüksek öğrenime güçlü bir başlangıç yapabilecek donanımla mezun olur.", { required: true }),
    field("approachImage", "Ana görsel", "Eğitim yaklaşımı", "image", "/images/departments/chemistry/workshops/ogrenciler-analiz-uygulamasi.jpeg", { required: true }),
    field("approachSecondImage", "İkinci görsel", "Eğitim yaklaşımı", "image", "/images/departments/biomedical/applied-workshop.jpeg", { required: true }),
    field("modelEyebrow", "Üst etiket", "Eğitim modeli", "text", "Dinamik eğitim modeli", { required: true }),
    field("modelTitle", "Başlık", "Eğitim modeli", "textarea", "Bilgiden beceriye uzanan güçlü bir yolculuk.", { required: true }),
    field("modelDescription", "Açıklama", "Eğitim modeli", "textarea", "Öğrenme sürecini sınıfın dışına taşıyor, öğrencinin kendi potansiyelini gerçek uygulamalarla keşfetmesini sağlıyoruz.", { required: true }),
    field(
      "modelCards",
      "Model kartları",
      "Eğitim modeli",
      "lines",
      "Akademik temel | Bilgiyi temellendir | Mesleki teoriyi güçlü akademik altyapı ve güvenli çalışma kültürüyle öğren.\nUygulamalı deneyim | Uygulayarak geliştir | Atölye ve laboratuvarlarda gerçek ekipmanlarla üret, ölç, analiz et ve çözüm geliştir.\nKariyer bağlantısı | Sektörle buluş | Sanayi iş birlikleriyle mesleğin gerçek çalışma ortamını deneyimle ve geleceğe hazırlan.",
      { help: "Her satıra “Etiket | Başlık | Açıklama” yazın.", required: true },
    ),
    field("purposeEyebrow", "Üst etiket", "Vizyon ve misyon", "text", "Yönümüz", { required: true }),
    field("purposeTitle", "Bölüm başlığı", "Vizyon ve misyon", "textarea", "Aynı hedefe bakan güçlü bir eğitim kültürü.", { required: true }),
    field("purposeDescription", "Bölüm açıklaması", "Vizyon ve misyon", "textarea", "Evrensel değerleri, mesleki yeterliliği ve toplumsal sorumluluğu aynı çatı altında buluşturuyoruz.", { required: true }),
    field("visionTitle", "Vizyon başlığı", "Vizyon ve misyon", "textarea", "Örnek gösterilen lider bir eğitim kurumu olmak.", { required: true }),
    field("visionText", "Vizyon metni", "Vizyon ve misyon", "textarea", "Katılımcılığı, takım çalışmasını, araştırmayı ve etkili iş birliğini merkeze alan bir kurum olarak ülkemizin bilimsel, sosyal ve kültürel gelişimine katkı sağlamak.", { required: true }),
    field("missionTitle", "Misyon başlığı", "Vizyon ve misyon", "textarea", "Bilgiyi beceriye, beceriyi toplumsal değere dönüştürmek.", { required: true }),
    field("missionText", "Misyon metni", "Vizyon ve misyon", "textarea", "Milli ve manevi değerlere bağlı; akılcı, sorgulayan, hoşgörülü, yenilikçi ve sorumluluk sahibi bireyler yetiştirmek.", { required: true }),
    field("values", "Temel değerler", "Vizyon ve misyon", "lines", "Katılımcılık\nTakım çalışması\nAraştırma kültürü\nToplumsal sorumluluk", { help: "Her satır ayrı değer olarak gösterilir.", required: true }),
    field("qualityEyebrow", "Üst etiket", "Kalite politikası", "text", "Kalite politikamız", { required: true }),
    field("qualityTitle", "Başlık", "Kalite politikası", "textarea", "Her gün daha iyi bir okul deneyimi.", { required: true }),
    field("qualityDescription", "Açıklama", "Kalite politikası", "textarea", "Başarıyı yalnızca sonuçlarla değil, gelişimi sürekli kılan güvenli ve katılımcı bir okul kültürüyle ölçüyoruz.", { required: true }),
    field("qualityItems", "Kalite ilkeleri", "Kalite politikası", "lines", "Sürekli iyileşme ve gelişme anlayışını benimsemek.\nÖğrenci başarısını, veli ve çalışan mutluluğunu birlikte güçlendirmek.\nVelilerimizle bütünleşen, öğretmen gelişimini destekleyen sıcak bir okul kültürü oluşturmak.\nBölgenin ücretsiz özel okul modelini nitelikli eğitimle sürdürülebilir kılmak.", { required: true }),
    field("ctaEyebrow", "Üst etiket", "Sayfa sonu çağrısı", "text", "Dinamik bir gelecek", { required: true }),
    field("ctaTitle", "Başlık", "Sayfa sonu çağrısı", "textarea", "Geleceğini birlikte şekillendirelim.", { required: true }),
    field("ctaDescription", "Açıklama", "Sayfa sonu çağrısı", "textarea", "Eğitim alanlarımızı keşfedin, merak ettiklerinizi sorun ve Dinamik’teki yerinizi bugünden planlayın.", { required: true }),
    field("ctaImage", "Görsel", "Sayfa sonu çağrısı", "image", "/images/hero-banner.png", { required: true }),
  ],
};

const school: ContentPageDefinition = {
  key: "school",
  displayName: "Okulumuz",
  route: "/okulumuz",
  category: "Kurumsal",
  description: "Okulumuz ana sayfası, tanıtım alanları, yönlendirme kartları ve ziyaret çağrısı.",
  fields: [
    ...heroFields({
      eyebrow: "Dinamik okul kültürü",
      title: "Öğrenmenin, üretmenin ve birlikte gelişmenin güçlü kampüsü.",
      description: "Modern eğitim ortamlarını, uygulamalı mesleki eğitimi ve öğrenciyi merkeze alan okul yaşamını tek bir bütün olarak sunuyoruz.",
      image: "/images/about-school-campus.png",
      imageAlt: "Dinamik Mesleki ve Teknik Anadolu Lisesi kampüsü ve öğrencileri",
    }),
    field("hubEyebrow", "Üst etiket", "Okul sayfaları", "text", "Okulumuzu keşfedin", { required: true }),
    field("hubTitle", "Başlık", "Okul sayfaları", "textarea", "Dinamik’te okul yaşamının her yönüne ulaşın.", { required: true }),
    field("hubDescription", "Açıklama", "Okul sayfaları", "textarea", "Kurumsal yaklaşımımızdan öğrenci rehberliğine kadar okul hakkında aradığınız her başlık, ayrıntılı ve bağımsız bir sayfada sunulur.", { required: true }),
    field("hubCards", "Yönlendirme kartları", "Okul sayfaları", "lines", "Hakkımızda | Eğitim yaklaşımımızı, vizyonumuzu, misyonumuzu ve kalite anlayışımızı keşfedin. | /hakkimizda\nKadromuz | Öğrencilerin akademik, mesleki ve kişisel gelişimine eşlik eden eğitim ekibimizi tanıyın. | /kadromuz\nRehberlik | Kariyer planlama, sınav süreci ve öğrenci gelişimini destekleyen rehberlik çalışmalarını inceleyin. | /rehberlik\nOkul Kıyafetlerimiz | Okul kültürünü yansıtan güncel kıyafet düzeni ve kullanım bilgilerine ulaşın. | /okul-kiyafetlerimiz", { help: "Her satıra “Başlık | açıklama | bağlantı” yazın.", required: true }),
    field("videoEyebrow", "Üst etiket", "Video galerisi", "text", "Okulumuzu tanıyın", { required: true }),
    field("videoTitle", "Başlık", "Video galerisi", "textarea", "Dinamik’te eğitimi ve okul yaşamını yakından görün.", { required: true }),
    field("videoDescription", "Açıklama", "Video galerisi", "textarea", "Kampüsümüzü, uygulamalı eğitim ortamlarımızı ve okul yaşamından kesitleri videolarımızla keşfedin.", { required: true }),
    field("featureVideo", "Ana video yolu", "Video galerisi", "text", "/uploads/videos/okulumuzu-taniyin.mp4", { required: true }),
    field("featureVideoTitle", "Ana video başlığı", "Video galerisi", "text", "Okulumuzu 90 saniyede keşfedin.", { required: true }),
    field("featureVideoDescription", "Ana video açıklaması", "Video galerisi", "textarea", "Dinamik’in eğitim ortamlarını, kampüs atmosferini ve öğrencilerimize sunduğu uygulamalı öğrenme deneyimini tek videoda izleyin.", { required: true }),
    field("featureVideoDuration", "Ana video süresi", "Video galerisi", "text", "01:30", { required: true }),
    field("supportingVideos", "Diğer videolar", "Video galerisi", "lines", "Kimya Teknolojileri | Kimyada analiz ve kalite kontrol | Kimya Laboratuvarı Dalındaki uygulamalı analiz ve kalite kontrol süreçlerini tanıyın. | /uploads/videos/okulumuzdan-goruntuler-1.mp4 | 1:26\nElektrik - Elektronik | Elektrik - Elektronik atölyelerinde eğitim | Elektrik Tesisatları ve Dağıtımı Dalındaki uygulamalı çalışmaları yakından görün. | /uploads/videos/okulumuzdan-goruntuler-2.mp4 | 1:51\nÖğrenci deneyimi | Dinamik'te öğrenci olmak | Öğrencilerimizin Dinamik'teki eğitim ve okul yaşamı deneyimlerini kendi sözlerinden dinleyin. | /uploads/videos/okulumuzdan-goruntuler-3.mp4 | 0:52\nBiyomedikal Cihaz | Biyomedikal Cihaz Teknolojileri | Tıbbi Görüntüleme Sistemleri Dalındaki uygulamalı eğitim yaklaşımımızı keşfedin. | /uploads/videos/okulumuzdan-goruntuler-4.mp4 | 0:45", { help: "Her satıra “Kategori | başlık | açıklama | video yolu | süre” yazın.", required: true }),
    field("modelEyebrow", "Üst etiket", "Eğitim modeli", "text", "Eğitim modelimiz", { required: true }),
    field("modelTitle", "Başlık", "Eğitim modeli", "textarea", "Teoriyi, uygulamayı ve kariyer hedefini aynı yolculukta buluşturuyoruz.", { required: true }),
    field("modelDescription", "Açıklama", "Eğitim modeli", "textarea", "Üç aktif mesleki alanda güvenli çalışma kültürü, güncel teknik altyapı ve uygulamalı öğrenme yaklaşımıyla öğrencilerimizin yetkinliklerini geliştiriyoruz.", { required: true }),
    field("modelImage", "Görsel", "Eğitim modeli", "image", "/images/departments/chemistry/workshops/ogrenciler-analiz-uygulamasi.jpeg", { required: true }),
    field("ctaTitle", "Başlık", "Ziyaret çağrısı", "text", "Okulumuzu yerinde tanıyın.", { required: true }),
    field("ctaDescription", "Açıklama", "Ziyaret çağrısı", "textarea", "Atölyeleri, laboratuvarları ve kampüs ortamını görmek için ziyaret planlayın.", { required: true }),
    field("ctaLabel", "Buton metni", "Ziyaret çağrısı", "text", "Ziyaret talebi oluştur", { required: true }),
    field("ctaHref", "Buton bağlantısı", "Ziyaret çağrısı", "url", "/on-kayit", { required: true }),
  ],
};

const guidance: ContentPageDefinition = {
  key: "guidance",
  displayName: "Rehberlik",
  route: "/rehberlik",
  category: "Öğrenci",
  description: "Rehberlik sayfasının üst alanı, destek başlıkları ve bölüm seçimi çağrısı.",
  fields: [
    ...heroFields({
      eyebrow: "Her adımda yanında",
      title: "Kendini tanıyan öğrenci, geleceğini daha güçlü tasarlar.",
      description: "Rehberlik yaklaşımımız; akademik başarıyı, iyi oluşu, kariyer farkındalığını ve aile iletişimini tek bir gelişim yolculuğunda ele alır.",
      image: "/images/activities/social/vision-board-etkinligi/vision-board-etkinligi-01.webp",
    }),
    field("introEyebrow", "Üst etiket", "Destek alanları", "text", "Bütüncül destek", { required: true }),
    field("introTitle", "Başlık", "Destek alanları", "textarea", "Sadece sınava değil, hayata hazırlayan rehberlik.", { required: true }),
    field("introDescription", "Açıklama", "Destek alanları", "textarea", "Öğrencinin güçlü yanlarını keşfetmesi, zorlandığı alanlarda destek bulması ve kararlarını güvenle verebilmesi için yanında oluruz.", { required: true }),
    field(
      "topics",
      "Destek kartları",
      "Destek alanları",
      "lines",
      "Kariyer farkındalığı | İlgi, yetenek ve hedefleri tanıyarak alan seçimini daha bilinçli bir karara dönüştürmek.\nÖğrenme becerileri | Dikkat, çalışma düzeni, hedef belirleme ve zaman yönetimi alışkanlıklarını geliştirmek.\nSınav süreci | Kaygıyı yönetmek, gerçekçi hedef kurmak ve sınava hazırlığı sürdürülebilir bir plana dönüştürmek.\nErgenlik ve iletişim | Öğrencinin kendini ifade etmesini, aile ve arkadaş ilişkilerinde sağlıklı iletişimi desteklemek.\nOkul-aile iş birliği | Öğrencinin gelişimini düzenli iletişim ve ortak bir destek yaklaşımıyla izlemek.\nGüvenli okul iklimi | Saygı, sorumluluk, aidiyet ve psikolojik güveni okul yaşamının merkezine taşımak.",
      { help: "Her satıra “Başlık | Açıklama” yazın.", required: true },
    ),
    field("ctaTitle", "Başlık", "Sayfa sonu çağrısı", "textarea", "Doğru bölüm seçimi, kendini tanımakla başlar.", { required: true }),
    field("ctaDescription", "Açıklama", "Sayfa sonu çağrısı", "textarea", "Üç mesleki alanı birlikte değerlendirelim; ilgi ve hedeflerine uygun programı keşfet.", { required: true }),
  ],
};

const contact: ContentPageDefinition = {
  key: "contact",
  displayName: "İletişim",
  route: "/iletisim",
  category: "Genel",
  description: "İletişim sayfası kapak, harita ve kampüs ziyareti metinleri.",
  fields: [
    ...heroFields({
      eyebrow: "Bize ulaşın",
      title: "Sorularınızı dinleyelim, geleceğiniz için doğru adımı birlikte atalım.",
      description: "Bölümler, kayıt süreci ve kampüs ziyareti hakkında bilgi almak için okulumuza ulaşabilirsiniz.",
      image: "/images/about-school-campus.png",
    }),
    field("mapTitle", "Harita kartı başlığı", "Kampüs konumu", "text", "Kampüsü yerinde keşfedin.", { required: true }),
    field("mapImage", "Harita kartı görseli", "Kampüs konumu", "image", "/images/about-school-campus.png", { required: true }),
    field("ctaTitle", "Başlık", "Ziyaret çağrısı", "text", "Kampüs ziyareti planlayın.", { required: true }),
    field("ctaDescription", "Açıklama", "Ziyaret çağrısı", "textarea", "Atölyeleri, laboratuvarları ve eğitim ortamını yakından görmek için ön kayıt talebinizi iletin.", { required: true }),
    field("ctaLabel", "Buton metni", "Ziyaret çağrısı", "text", "Ön kayıt talebi", { required: true }),
  ],
};

const registration: ContentPageDefinition = {
  key: "registration",
  displayName: "Ön Kayıt",
  route: "/on-kayit",
  category: "Öğrenci",
  description: "Ön kayıt sayfasının kapak, form açıklaması ve fayda maddeleri.",
  fields: [
    ...heroFields({
      eyebrow: "Geleceğin için ilk adım",
      title: "Seni tanıyalım, doğru programı birlikte keşfedelim.",
      description: "Kısa bilgi talebini ilet; bölümler, kampüs ve kayıt süreci hakkında okul ekibimizden destek al.",
      image: "/images/hero-banner.png",
    }),
    field("formEyebrow", "Üst etiket", "Form tanıtımı", "text", "Ön kayıt bilgi talebi", { required: true }),
    field("formTitle", "Başlık", "Form tanıtımı", "text", "Dinamik bir geleceğe hazır mısın?", { required: true }),
    field("formDescription", "Açıklama", "Form tanıtımı", "textarea", "Başvurunuz okulun güvenli yönetim paneline kaydedilir. İsteğe bağlı tercihinizle WhatsApp’ta hazır bir mesaj da oluşturulur; göndermeden önce içeriği siz kontrol edersiniz.", { required: true }),
    field("benefits", "Fayda maddeleri", "Form tanıtımı", "lines", "Üç aktif mesleki alan hakkında bilgi\nKampüs ve atölye ziyareti planlama\nKayıt süreci ve koşulları\nŞeffaf ve kullanıcı kontrollü gönderim", { required: true }),
    field("studentLabel", "Öğrenci alanı", "Form alanları", "text", "Öğrencinin adı soyadı", { required: true }),
    field("parentLabel", "Veli alanı", "Form alanları", "text", "Velinin adı soyadı", { required: true }),
    field("gradeLabel", "Sınıf alanı", "Form alanları", "text", "Mevcut sınıf", { required: true }),
    field("phoneLabel", "Telefon alanı", "Form alanları", "text", "Telefon", { required: true }),
    field("departmentLabel", "Bölüm alanı", "Form alanları", "text", "İlgilenilen alan", { required: true }),
    field("departmentOptions", "Bölüm seçenekleri", "Form alanları", "lines", "Kararsızım\nKimya Teknolojileri\nElektrik-Elektronik Teknolojileri\nBiyomedikal Cihaz Teknolojileri", { required: true }),
    field("privacyTitle", "Gizlilik başlığı", "Form gizliliği", "text", "Gizlilik tercihleri", { required: true }),
    field("privacyDescription", "Gizlilik açıklaması", "Form gizliliği", "textarea", "Bilgilerinizi yalnızca başvurunuzu yanıtlamak ve kayıt sürecini yürütmek için kullanırız.", { required: true }),
    field("submitLabel", "Gönder butonu", "Form alanları", "text", "Başvuruyu Gönder", { required: true }),
  ],
};

const uniforms: ContentPageDefinition = {
  key: "uniforms",
  displayName: "Okul Kıyafetleri",
  route: "/okul-kiyafetlerimiz",
  category: "Öğrenci",
  description: "Okul kıyafeti görseli, açıklaması, parça listesi ve özellik kartları.",
  fields: [
    ...heroFields({
      eyebrow: "Kurumsal aidiyet",
      title: "Sade, rahat ve Dinamik okul kültürüne ait.",
      description: "Öğrencilerimizin okul gününde düzenli, rahat ve ortak kimliği yansıtan bir görünümle hareket etmesi için belirlenen kıyafet düzeni.",
      image: "/images/gallery-2.jpg",
    }),
    field("contentEyebrow", "Üst etiket", "Kıyafet bilgileri", "text", "2025-2026 eğitim öğretim yılı", { required: true }),
    field("contentTitle", "Başlık", "Kıyafet bilgileri", "text", "Okul kıyafetimiz.", { required: true }),
    field("contentDescription", "Açıklama", "Kıyafet bilgileri", "textarea", "Kısa veya uzun kollu bordo polo yaka üst, siyah pantolonla tamamlanır. Ortak kıyafet düzeni okul aidiyetini güçlendirirken öğrencinin gün boyu rahat hareket etmesini destekler.", { required: true }),
    field("uniformImage", "Kıyafet görseli", "Kıyafet bilgileri", "image", "/images/school-uniforms.jpg", { required: true }),
    field("items", "Kıyafet parçaları", "Kıyafet bilgileri", "lines", "Bordo polo yaka üst\nSiyah pantolon\nKısa veya uzun kol seçeneği\nSade ve kurumsal görünüm", { required: true }),
    field("note", "Bilgilendirme notu", "Kıyafet bilgileri", "textarea", "Beden, tedarik ve dönemsel uygulama ayrıntıları için kayıt birimimizle iletişime geçebilirsiniz.", { required: true }),
    field("features", "Özellik kartları", "Kıyafet bilgileri", "lines", "Günlük rahatlık | Okul, atölye ve sosyal etkinlik günlerinde düzenli ve rahat bir kullanım.\nOrtak okul kültürü | Dinamik öğrencilerini bir araya getiren sade ve ayırt edici bir kurumsal görünüm.\nTemiz ve özenli görünüm | Öğrenme ortamına uygun, dikkat dağıtmayan ve kolay kombinlenen parçalar.", { help: "Her satıra “Başlık | Açıklama” yazın.", required: true }),
  ],
};

const gallery: ContentPageDefinition = {
  key: "gallery",
  displayName: "Fotoğraf Galerisi",
  route: "/galeri",
  category: "Medya",
  description: "Galeri sayfası kapak, seçki açıklaması ve ziyaret çağrısı. Fotoğraflar Galeri menüsünden yönetilir.",
  fields: [
    ...heroFields({
      eyebrow: "Kampüsten kareler",
      title: "Dinamik'te öğrenmenin ve birlikte büyümenin renkli hâli.",
      description: "Atölyeden sahneye, laboratuvardan sosyal yaşama uzanan okul deneyiminden seçkiler.",
      image: "/images/gallery-1.jpg",
    }),
    field("introEyebrow", "Üst etiket", "Galeri tanıtımı", "text", "Fotoğraf seçkisi", { required: true }),
    field("introTitle", "Başlık", "Galeri tanıtımı", "textarea", "Kampüsün enerjisi, öğrencilerin gözlerindeki merak.", { required: true }),
    field("introDescription", "Açıklama", "Galeri tanıtımı", "textarea", "Her kare; öğrenmenin, arkadaşlığın, cesaretin ve birlikte üretmenin farklı bir anını anlatır.", { required: true }),
    field("ctaTitle", "Başlık", "Sayfa sonu çağrısı", "textarea", "Bu kampüsün bir sonraki hikâyesinde sen de ol.", { required: true }),
    field("ctaDescription", "Açıklama", "Sayfa sonu çağrısı", "textarea", "Dinamik eğitim ortamını yakından görmek için kampüs ziyareti planla.", { required: true }),
  ],
};

const staff: ContentPageDefinition = {
  key: "staff",
  displayName: "Kadromuz Sayfası",
  route: "/kadromuz",
  category: "Kurumsal",
  description: "Kadro üyeleri ayrı Kadromuz menüsünden; sayfanın tanıtım metinleri buradan yönetilir.",
  fields: [
    ...heroFields({
      eyebrow: "Uzmanlık, deneyim, iş birliği",
      title: "Her öğrencinin potansiyeline inanan güçlü bir eğitim ekibi.",
      description: "Mesleki alan öğretmenlerinden akademik branşlara, rehberlikten sanat ve spora uzanan çok yönlü bir kadro.",
      image: "/images/kadromuz-banner.png",
      imageAlt: "Dinamik Okulları eğitim kadrosu okul binası önünde",
    }),
    field("introEyebrow", "Üst etiket", "Kadro tanıtımı", "text", "Okul kadromuz", { required: true }),
    field("introTitle", "Başlık", "Kadro tanıtımı", "textarea", "Farklı uzmanlıklar, ortak bir eğitim vizyonu.", { required: true }),
    field("introDescription", "Açıklama", "Kadro tanıtımı", "textarea", "Kadro listesi, okulun güncel kurumsal yayınları temel alınarak görev ve branşlara göre düzenlenmiştir.", { required: true }),
    field("features", "Yaklaşım kartları", "Kadro tanıtımı", "lines", "Alanında uzmanlık | Mesleki ve akademik branşlarda öğrenciyi uygulamayla, araştırmayla ve güncel içerikle buluşturan ekip.\nÖğrenciyi tanıyan yaklaşım | Akademik, sosyal ve duygusal gelişimi birlikte izleyen rehberlik ve sınıf kültürü.\nBirlikte gelişim | Öğretmen iş birliği, disiplinler arası üretim ve güçlü okul-aile iletişimi.", { help: "Her satıra “Başlık | Açıklama” yazın.", required: true }),
  ],
};

const departments: ContentPageDefinition = {
  key: "departments",
  displayName: "Bölümler Liste Sayfası",
  route: "/bolumler",
  category: "Öğrenci",
  description: "Bölüm kayıtları ayrı Bölümler menüsünden; liste sayfasının ortak metinleri buradan yönetilir.",
  fields: [
    ...heroFields({
      eyebrow: "Teknolojiden mesleğe",
      title: "İlgi alanını, geleceğinin güçlü bir parçasına dönüştür.",
      description: "Aktif mesleki alanlar, farklı teknoloji dünyaları ve uygulamayla güçlenen tek bir eğitim yaklaşımı.",
      image: "/images/hero-banner.png",
    }),
    field("introEyebrow", "Üst etiket", "Bölüm listesi", "text", "Aktif programlarımız", { required: true }),
    field("introTitle", "Başlık", "Bölüm listesi", "textarea", "Üreten, ölçen ve çözüm geliştiren mesleki alanlar.", { required: true }),
    field("introDescription", "Açıklama", "Bölüm listesi", "textarea", "Her alan, okulda fiilen eğitim verilen dal üzerinden anlatılır. Program içerikleri, güvenli çalışma kültürünü gerçek atölye ve laboratuvar uygulamalarıyla birleştirir.", { required: true }),
    field("modelEyebrow", "Üst etiket", "Eğitim modeli", "text", "Dinamik eğitim modeli", { required: true }),
    field("modelTitle", "Başlık", "Eğitim modeli", "textarea", "Bilgiyi beceriye dönüştüren üç güçlü katman.", { required: true }),
    field("modelDescription", "Açıklama", "Eğitim modeli", "textarea", "Akademik temel, gerçek ekipmanlarla uygulama ve kariyer farkındalığı aynı öğrenme yolculuğunda buluşur.", { required: true }),
    field("modelCards", "Model kartları", "Eğitim modeli", "lines", "Güçlü akademik temel | Mesleki eğitimi temel bilimler, matematik, iletişim ve yabancı dil becerileriyle destekler.\nUygulamayla öğrenme | Atölye ve laboratuvarlarda ölçme, analiz, tasarım, bakım ve problem çözme deneyimi kazandırır.\nKariyere hazırlık | Sektörü tanıma, yükseköğretim seçenekleri ve çalışma kültürüyle geleceğe hazırlık sağlar.", { help: "Her satıra “Başlık | Açıklama” yazın.", required: true }),
    field("ctaTitle", "Başlık", "Sayfa sonu çağrısı", "textarea", "Hangi bölümün sana uygun olduğunu birlikte keşfedelim.", { required: true }),
    field("ctaDescription", "Açıklama", "Sayfa sonu çağrısı", "textarea", "Programları yakından tanımak, kampüsü görmek ve kayıt sürecini konuşmak için okulumuza ulaş.", { required: true }),
  ],
};

const achievements: ContentPageDefinition = {
  key: "achievements",
  displayName: "Başarılarımız",
  route: "/basarilarimiz",
  category: "Medya",
  description: "Başarı yaklaşımı, kartlar, galeri başlıkları ve kapanış içeriği.",
  fields: [
    ...heroFields({
      eyebrow: "Başarının çok yönlü hâli",
      title: "Her öğrencinin ilerleyişi, kutlanmaya değer bir başarıdır.",
      description: "Akademik sonuçların ötesinde; mesleki beceriyi, takım ruhunu, sanatı, sporu ve toplumsal katkıyı birlikte büyütüyoruz.",
      image: "/images/achievements/codeweek-haftasi/codeweek-haftasi-01.webp",
    }),
    field("introEyebrow", "Üst etiket", "Başarı kültürü", "text", "Başarı kültürü", { required: true }),
    field("introTitle", "Başlık", "Başarı kültürü", "textarea", "Sonuçtan önce emeği, yarıştan önce gelişimi görüyoruz.", { required: true }),
    field("introDescription", "Açıklama", "Başarı kültürü", "textarea", "Başarıyı tek bir sınav, derece veya sayı ile sınırlamıyor; öğrencinin bilgi, beceri ve karakter yolculuğunda gösterdiği ilerlemeyle değerlendiriyoruz.", { required: true }),
    field("areas", "Başarı alanları", "Başarı kültürü", "lines", "Akademik gelişim | Öğrencinin kendi başlangıç noktasından ileriye taşıdığı her kalıcı bilgi ve öğrenme alışkanlığı.\nMesleki üretim | Atölye ve laboratuvarda fikri doğru, güvenli ve uygulanabilir bir teknik çözüme dönüştürmek.\nSpor ve takım ruhu | Disiplin, dayanıklılık, adil oyun ve birlikte hedefe ilerleme kültürünü geliştirmek.\nKültür ve sanat | Sahnede, sergide ve yaratıcı üretimde özgün düşünceyi cesaretle görünür kılmak.\nSosyal sorumluluk | Bilgiyi ve emeği toplum yararına kullanmak; dayanışma ve gönüllülük bilinci kazanmak.\nKişisel gelişim | Sorumluluk almak, iletişim kurmak, zorluklarla baş etmek ve kendi potansiyelini keşfetmek.", { help: "Her satıra “Başlık | Açıklama” yazın.", required: true }),
    field("galleryEyebrow", "Üst etiket", "Başarı galerisi", "text", "Gurur tablomuz", { required: true }),
    field("galleryTitle", "Başlık", "Başarı galerisi", "textarea", "Emek, kararlılık ve yetenekle gelen başarılar.", { required: true }),
    field("galleryDescription", "Açıklama", "Başarı galerisi", "textarea", "Bilim ve teknoloji çalışmalarından Türkiye derecelerine uzanan bu seçki, öğrencilerimizin farklı alanlarda gösterdiği gelişimi ve azmi görünür kılıyor.", { required: true }),
    field("editorialEyebrow", "Üst etiket", "Kapanış içeriği", "text", "Birlikte büyümek", { required: true }),
    field("editorialTitle", "Başlık", "Kapanış içeriği", "textarea", "Başarının arkasında güven, emek ve güçlü bir ekip vardır.", { required: true }),
    field("editorialDescription", "Açıklama", "Kapanış içeriği", "textarea", "Öğretmen rehberliği, aile iş birliği, öğrenci azmi ve destekleyici kampüs kültürü aynı hedefte buluştuğunda kalıcı gelişim mümkün olur.", { required: true }),
    field("editorialImage", "Görsel", "Kapanış içeriği", "image", "/images/achievements/codeweek-haftasi/codeweek-haftasi-02.webp", { required: true }),
  ],
};

const activities: ContentPageDefinition = {
  key: "activities",
  displayName: "Faaliyetlerimiz",
  route: "/faaliyetlerimiz",
  category: "Medya",
  description: "Faaliyet yaklaşımı, kartlar ve sportif, sosyal, kültürel galeri başlıkları.",
  fields: [
    ...heroFields({
      eyebrow: "Sınıfın ötesinde öğrenme",
      title: "Merakın, yeteneğin ve takım ruhunun kampüste hayat bulduğu anlar.",
      description: "Eğitim; bilim, sanat, spor, kültür ve sosyal sorumlulukla zenginleştiğinde kalıcı bir deneyime dönüşür.",
      image: "/images/activities/cultural/ankara-gezisi/ankara-gezisi-01.webp",
    }),
    field("introEyebrow", "Üst etiket", "Faaliyet alanları", "text", "Dinamik'te yaşam", { required: true }),
    field("introTitle", "Başlık", "Faaliyet alanları", "textarea", "Her öğrenci için kendini gösterecek yeni bir alan.", { required: true }),
    field("introDescription", "Açıklama", "Faaliyet alanları", "textarea", "Faaliyetler; öğrencinin iletişim, sorumluluk, yaratıcılık ve ekip çalışması becerilerini günlük okul yaşamının doğal bir parçası hâline getirir.", { required: true }),
    field("areas", "Faaliyet kartları", "Faaliyet alanları", "lines", "Bilim ve teknoloji | Atölye üretimleri, laboratuvar uygulamaları, proje günleri ve teknik geziler.\nKültür ve sahne | Törenler, tiyatro, söyleşi, şiir ve öğrencilerin kendini ifade ettiği sahne çalışmaları.\nSpor ve takım ruhu | Turnuvalar, hareketli yaşam etkinlikleri ve birlikte hedefe ilerleme kültürü.\nSanat ve tasarım | Görsel üretim, sergi, müzik ve öğrencilerin özgün fikirlerini görünür kılan çalışmalar.\nSosyal sorumluluk | Topluma duyarlılık, paylaşma, gönüllülük ve dayanışmayı büyüten okul projeleri.\nKampüs yaşamı | Öğrencilerin bir araya geldiği kutlamalar, kulüp günleri ve sosyal buluşmalar.", { help: "Her satıra “Başlık | açıklama” yazın.", required: true }),
    field("sportEyebrow", "Üst etiket", "Sportif galeri", "text", "Sportif faaliyetler", { required: true }),
    field("sportTitle", "Başlık", "Sportif galeri", "textarea", "Emek, disiplin ve takım ruhuyla gelen başarı.", { required: true }),
    field("sportDescription", "Açıklama", "Sportif galeri", "textarea", "Judo ve futsal çalışmalarımızda öğrencilerimiz; teknik becerilerini geliştirirken dayanıklılık, öz güven ve birlikte mücadele etme kültürü kazanır.", { required: true }),
    field("socialEyebrow", "Üst etiket", "Sosyal galeri", "text", "Sosyal faaliyetler", { required: true }),
    field("socialTitle", "Başlık", "Sosyal galeri", "textarea", "Arkadaşlık, paylaşım ve dayanışma okul yaşamının her anında.", { required: true }),
    field("socialDescription", "Açıklama", "Sosyal galeri", "textarea", "Gezi, buluşma ve ortak etkinlikler; öğrencilerimizin iletişim kurduğu, sorumluluk aldığı ve birlikte güzel anılar biriktirdiği sosyal alanlar oluşturur.", { required: true }),
    field("culturalEyebrow", "Üst etiket", "Kültürel galeri", "text", "Kültürel faaliyetler", { required: true }),
    field("culturalTitle", "Başlık", "Kültürel galeri", "textarea", "Merak, sanat ve kültürle beslenen yeni keşifler.", { required: true }),
    field("culturalDescription", "Açıklama", "Kültürel galeri", "textarea", "Fuarlar, geziler ve kültürel buluşmalar; öğrencilerimizin dünyaya farklı açılardan bakmasına ve yeni ilgi alanları geliştirmesine katkı sağlar.", { required: true }),
  ],
};

const kvkk: ContentPageDefinition = {
  key: "kvkk",
  displayName: "KVKK Sayfası",
  route: "/kvkk",
  category: "Yasal",
  description: "Yasal metin değiştirilmeden, sayfanın tanıtım ve iletişim odaklı üst metinlerini yönetin.",
  fields: [
    ...heroFields({
      eyebrow: "KVKK ve veri güvenliği",
      title: "Verileriniz üzerinde söz sizde.",
      description: "Ön kayıt talebiniz sırasında hangi bilgileri, neden ve ne kadar süreyle işlediğimizi açık ve anlaşılır biçimde öğrenin.",
      image: "/images/about-school-campus.png",
    }),
    field("noticeEyebrow", "Üst etiket", "Aydınlatma metni", "text", "Ön kayıt aydınlatma metni", { required: true }),
    field("noticeTitle", "Başlık", "Aydınlatma metni", "textarea", "Bilgilerinizin yolculuğu şeffaf olsun.", { required: true }),
    field("rightsEyebrow", "Üst etiket", "Haklar bölümü", "text", "KVKK Madde 11", { required: true }),
    field("rightsTitle", "Başlık", "Haklar bölümü", "textarea", "Haklarınızı kullanmak çok kolay.", { required: true }),
    field("rightsDescription", "Açıklama", "Haklar bölümü", "textarea", "Kimliğinizi doğrulamaya elverişli bilgiler ve talebinizin açık açıklamasıyla okulumuza başvurabilirsiniz. Başvurular, niteliğine göre mümkün olan en kısa sürede ve kanuni süre içinde yanıtlanır.", { required: true }),
    field("securityEyebrow", "Üst etiket", "Veri güvenliği", "text", "Veri güvenliği", { required: true }),
    field("securityTitle", "Başlık", "Veri güvenliği", "textarea", "Koruma, tasarımın ilk adımıdır.", { required: true }),
    field("securityDescription", "Açıklama", "Veri güvenliği", "textarea", "KVKK'nın hukuka aykırı işleme ve erişimi önleme, verilerin muhafazasını sağlama yükümlülükleri doğrultusunda teknik ve idari kontroller birlikte ele alınır.", { required: true }),
  ],
};

export const CONTENT_PAGE_DEFINITIONS: ContentPageDefinition[] = [
  siteChrome,
  about,
  school,
  departments,
  guidance,
  registration,
  uniforms,
  staff,
  gallery,
  achievements,
  activities,
  contact,
  kvkk,
];

export const CONTENT_PAGE_DEFINITION_BY_KEY = new Map(
  CONTENT_PAGE_DEFINITIONS.map((definition) => [definition.key, definition]),
);

export function defaultContentForDefinition(definition: ContentPageDefinition): Record<string, string> {
  return Object.fromEntries(definition.fields.map((item) => [item.key, item.defaultValue]));
}
