export const MEDIA_COLLECTIONS = [
  {
    key: "site-gallery",
    displayName: "Fotoğraf Galerisi",
    description: "Galeri sayfasında yayınlanan kampüs ve etkinlik görselleri.",
    scope: "gallery",
  },
  {
    key: "achievements",
    displayName: "Başarılar Arşivi",
    description: "Başarılarımız sayfasındaki albümler ve öğrenci başarı fotoğrafları.",
    scope: "gallery",
  },
  {
    key: "activities-sport",
    displayName: "Sportif Faaliyetler",
    description: "Faaliyetlerimiz sayfasındaki sportif çalışma ve turnuva fotoğrafları.",
    scope: "activity",
  },
  {
    key: "activities-social",
    displayName: "Sosyal Faaliyetler",
    description: "Faaliyetlerimiz sayfasındaki sosyal etkinlik albümleri.",
    scope: "activity",
  },
  {
    key: "activities-cultural",
    displayName: "Kültürel Faaliyetler",
    description: "Faaliyetlerimiz sayfasındaki kültür, gezi ve anma programı albümleri.",
    scope: "activity",
  },
  {
    key: "department-activities",
    displayName: "Bölüm Faaliyetleri",
    description: "Bölüm sayfalarında yalnızca içerik varsa yayınlanan faaliyet albümleri.",
    scope: "department",
  },
] as const;

export type MediaCollectionKey = (typeof MEDIA_COLLECTIONS)[number]["key"];
export type ActivityCollectionKey = Extract<MediaCollectionKey, `activities-${string}`>;

export const ACTIVITY_COLLECTION_KEYS = [
  "activities-sport",
  "activities-social",
  "activities-cultural",
] as const satisfies readonly ActivityCollectionKey[];

export type ManagedMediaPhoto = {
  src: string;
  title: string;
  description: string;
  alt: string;
  albumId?: string;
  albumTitle?: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
};

export function isMediaCollectionKey(value: string): value is MediaCollectionKey {
  return MEDIA_COLLECTIONS.some((collection) => collection.key === value);
}

export function mediaCollectionDefinition(key: MediaCollectionKey) {
  return MEDIA_COLLECTIONS.find((collection) => collection.key === key)!;
}
