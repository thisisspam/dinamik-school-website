import { createAlbumPhotos } from "./animated-gallery";

export const achievementPhotos = createAlbumPhotos("/images/achievements", [
  {
    slug: "codeweek-haftasi",
    title: "CodeWeek Haftası Etkinlikleri",
    description: "Öğrencilerimizin kodlama, üretme ve birlikte öğrenme çalışmaları katılım belgeleriyle taçlandı.",
    photoCount: 4,
  },
  {
    slug: "eren-genc-turkiye-judo-sampiyonu",
    title: "Eren Genç Türkiye Judo Şampiyonu",
    description: "Eren Genç, 2025-2026 Türkiye Okul Sporları Judo Müsabakaları 81 kg kategorisinde Türkiye şampiyonu oldu.",
    photoCount: 4,
  },
  {
    slug: "mono-palet-yuzme-samsun-dereceleri",
    title: "Mono Palet Yüzmede Samsun Dereceleri",
    description: "Mono palet yüzme müsabakalarında Alperen Altun Samsun şampiyonu, Oğuzhan Altun ise Samsun üçüncüsü oldu.",
    photoCount: 1,
  },
  {
    slug: "tahir-oztunc-turkiye-judo-dorduncusu",
    title: "Tahir Öztunç Türkiye Judo Dördüncüsü",
    description: "Tahir Öztunç, 2025-2026 Türkiye Okul Sporları Judo Müsabakaları 50 kg kategorisinde Türkiye dördüncüsü oldu.",
    photoCount: 3,
  },
  {
    slug: "urfodu-bilim-yarismasi",
    title: "URFODU Uluslararası Bilim Temelli Bilgi Yarışması",
    description: "Öğrencilerimiz uluslararası bilim temelli bilgi yarışmasındaki başarılarıyla okulumuzu gururla temsil etti.",
    photoCount: 2,
  },
]);

const homepageAchievementPaths = [
  "/images/achievements/urfodu-bilim-yarismasi/urfodu-bilim-yarismasi-02.webp",
  "/images/achievements/codeweek-haftasi/codeweek-haftasi-01.webp",
  "/images/achievements/eren-genc-turkiye-judo-sampiyonu/eren-genc-turkiye-judo-sampiyonu-01.webp",
  "/images/achievements/mono-palet-yuzme-samsun-dereceleri/mono-palet-yuzme-samsun-dereceleri-01.webp",
  "/images/achievements/tahir-oztunc-turkiye-judo-dorduncusu/tahir-oztunc-turkiye-judo-dorduncusu-02.webp",
  "/images/achievements/codeweek-haftasi/codeweek-haftasi-02.webp",
  "/images/achievements/eren-genc-turkiye-judo-sampiyonu/eren-genc-turkiye-judo-sampiyonu-03.webp",
  "/images/achievements/tahir-oztunc-turkiye-judo-dorduncusu/tahir-oztunc-turkiye-judo-dorduncusu-03.webp",
] as const;

export const homepageAchievementPhotos = homepageAchievementPaths.map((src) => {
  const photo = achievementPhotos.find((item) => item.src === src);
  if (!photo) {
    throw new Error(`Ana sayfa başarı görseli bulunamadı: ${src}`);
  }
  return photo;
});
