export const HOMEPAGE_FEATURE_ICON_OPTIONS = [
  { value: "flask", label: "Laboratuvar" },
  { value: "building", label: "Kampüs / bina" },
  { value: "wrench", label: "Teknik uygulama" },
  { value: "graduation", label: "Eğitim" },
  { value: "shield", label: "Güvenlik" },
  { value: "users", label: "İş birliği" },
  { value: "trophy", label: "Başarı" },
  { value: "school", label: "Okul" },
  { value: "zap", label: "Teknoloji / enerji" },
  { value: "heart", label: "Sağlık" },
  { value: "circuit", label: "Elektronik" },
] as const;

export type HomepageFeatureIcon = (typeof HOMEPAGE_FEATURE_ICON_OPTIONS)[number]["value"];
export type HomepageFeatureCardSize = "half" | "wide";

export type HomepageFeatureCard = {
  id: string;
  icon: HomepageFeatureIcon;
  title: string;
  description: string;
  size: HomepageFeatureCardSize;
};

export const DEFAULT_HOMEPAGE_FEATURE_CARDS: HomepageFeatureCard[] = [
  {
    id: "modern-atolyeler",
    icon: "flask",
    title: "Modern ve Yüksek Teknolojili Atölyeler",
    description: "Her alan için güncel teknik altyapı ve uygulama ortamları",
    size: "half",
  },
  {
    id: "sanayi-is-birlikleri",
    icon: "users",
    title: "Sanayi ile Güçlü İş Birlikleri",
    description: "Gerçek projeler, staj olanakları ve istihdam fırsatları",
    size: "half",
  },
  {
    id: "uygulamali-egitim",
    icon: "wrench",
    title: "Uygulamalı Eğitim Ağırlıklı Müfredat",
    description: "Teori ve pratiği birleştiren çağdaş eğitim modeli",
    size: "half",
  },
  {
    id: "universite-ve-is",
    icon: "graduation",
    title: "Üniversite ve Doğrudan İşe Geçiş",
    description: "İstediğin yolda güçlü bir gelecek için rehberlik",
    size: "half",
  },
  {
    id: "guvenli-sosyal-kampus",
    icon: "shield",
    title: "Güvenli ve Sosyal Kampüs",
    description: "Spor, kültür, sanat ve birlikte üretme kültürü",
    size: "wide",
  },
];

const VALID_ICONS = new Set<HomepageFeatureIcon>(HOMEPAGE_FEATURE_ICON_OPTIONS.map((option) => option.value));

function normalizedCard(value: unknown, index: number): HomepageFeatureCard | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Record<keyof HomepageFeatureCard, unknown>>;
  const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
  const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
  if (!title) return null;

  const icon = typeof candidate.icon === "string" && VALID_ICONS.has(candidate.icon as HomepageFeatureIcon)
    ? candidate.icon as HomepageFeatureIcon
    : DEFAULT_HOMEPAGE_FEATURE_CARDS[index % DEFAULT_HOMEPAGE_FEATURE_CARDS.length].icon;
  const size: HomepageFeatureCardSize = candidate.size === "wide" ? "wide" : "half";
  const id = typeof candidate.id === "string" && candidate.id.trim()
    ? candidate.id.trim()
    : `feature-${index + 1}`;

  return { id, icon, title, description, size };
}

export function parseHomepageFeatureCards(value: string | undefined): HomepageFeatureCard[] {
  if (!value?.trim()) return DEFAULT_HOMEPAGE_FEATURE_CARDS;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      const cards = parsed.slice(0, 12).map(normalizedCard).filter((card): card is HomepageFeatureCard => Boolean(card));
      if (cards.length > 0) return cards;
    }
  } catch {
    // Existing records used one "title | description" card per line.
  }

  const legacyCards = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map((line, index) => {
      const [title, description = ""] = line.split("|").map((column) => column.trim());
      return normalizedCard({
        id: `feature-${index + 1}`,
        icon: DEFAULT_HOMEPAGE_FEATURE_CARDS[index % DEFAULT_HOMEPAGE_FEATURE_CARDS.length].icon,
        title,
        description,
        size: index === 4 ? "wide" : "half",
      }, index);
    })
    .filter((card): card is HomepageFeatureCard => Boolean(card));

  return legacyCards.length > 0 ? legacyCards : DEFAULT_HOMEPAGE_FEATURE_CARDS;
}
