import {
  linesToList,
  linesToPairs,
  linesToTitledPairs,
  listToLines,
  pairsToLines,
  titledPairsToLines,
} from "@/lib/textformat";

export const DEPARTMENT_BLOCK_TYPES = [
  "info-cards",
  "branch-list",
  "skills",
  "learning-cards",
  "career-tags",
  "text",
  "highlight",
] as const;

export type DepartmentContentBlockType = (typeof DEPARTMENT_BLOCK_TYPES)[number];

export type DepartmentContentBlock = {
  id: string;
  type: DepartmentContentBlockType;
  title: string;
  content: string;
  footer?: string;
};

export const DEPARTMENT_BLOCK_OPTIONS: Array<{
  value: DepartmentContentBlockType;
  label: string;
  description: string;
  defaultTitle: string;
  defaultContent: string;
}> = [
  {
    value: "info-cards",
    label: "Bilgi kartları",
    description: "Etiket ve değerlerden oluşan öne çıkan bilgi kartları.",
    defaultTitle: "Öne çıkan bilgiler",
    defaultContent: "Bilgi etiketi | Bilgi değeri",
  },
  {
    value: "branch-list",
    label: "Dal durumları",
    description: "Programdaki dalları ve okulda eğitim verilip verilmediğini açık biçimde gösterir.",
    defaultTitle: "Programda yer alan dallar",
    defaultContent: "Dal adı\nDal adı (Okulumuzda bu dalda eğitim VERİLMEMEKTEDİR)",
  },
  {
    value: "skills",
    label: "Beceriler",
    description: "Öğrencinin kazanacağı becerileri maddeler halinde gösterir.",
    defaultTitle: "Kazanılan beceriler",
    defaultContent: "Yeni beceri",
  },
  {
    value: "learning-cards",
    label: "Başlıklı bilgi kartları",
    description: "Birbiriyle ilişkili başlık ve açıklamaları aynı bölümde kartlar halinde gösterir.",
    defaultTitle: "Öne çıkanlar",
    defaultContent: "Kart başlığı | Kart açıklaması",
  },
  {
    value: "career-tags",
    label: "Kariyer alanları",
    description: "Kariyer ve devam eğitimi seçeneklerini etiketler halinde sunar.",
    defaultTitle: "Kariyer rotası",
    defaultContent: "Yeni kariyer alanı",
  },
  {
    value: "text",
    label: "Bilgi metni",
    description: "Serbest başlık ve paragraf metni ekler.",
    defaultTitle: "Bilgiler",
    defaultContent: "Bu alana ziyaretçilere gösterilecek bilgi metnini yazın.",
  },
  {
    value: "highlight",
    label: "Vurgulu bilgi",
    description: "Eğitim süresi gibi önemli bir bilgiyi geniş bir vurgu kartında gösterir.",
    defaultTitle: "Önemli bilgi",
    defaultContent: "Vurgulanacak bilgi metni",
  },
];

type LegacyDepartmentContent = {
  facts: Array<{ label: string; value: string }>;
  skills: string[];
  learningAreas: Array<{ title: string; text: string }>;
  careerAreas: string[];
};

function isDepartmentBlockType(value: unknown): value is DepartmentContentBlockType {
  return DEPARTMENT_BLOCK_TYPES.includes(value as DepartmentContentBlockType);
}

export function createLegacyDepartmentBlocks(content: LegacyDepartmentContent): DepartmentContentBlock[] {
  const blocks: DepartmentContentBlock[] = [
    { id: "info-cards", type: "info-cards", title: "Öne çıkan bilgiler", content: pairsToLines(content.facts) },
    { id: "skills", type: "skills", title: "Kazanılan beceriler", content: listToLines(content.skills) },
    { id: "learning-cards", type: "learning-cards", title: "Ne öğreneceksin?", content: titledPairsToLines(content.learningAreas) },
    { id: "career-tags", type: "career-tags", title: "Kariyer rotası", content: listToLines(content.careerAreas) },
  ];
  return blocks.filter((block) => block.content.trim());
}

export function createDefaultDepartmentBlocks(): DepartmentContentBlock[] {
  return createLegacyDepartmentBlocks({
    facts: [
      { label: "Aktif dal", value: "Dal adı" },
      { label: "Eğitim süresi", value: "4 öğretim yılı" },
      { label: "Çalışma modeli", value: "Uygulamalı eğitim" },
    ],
    skills: ["Temel mesleki uygulamalar", "İş sağlığı ve güvenliği", "Teknik ölçme ve değerlendirme"],
    learningAreas: [
      { title: "Teknik temel", text: "Alanın temel kavramlarını ve araçlarını öğrenirsin." },
      { title: "Uygulama", text: "Bilgiyi atölye ve proje çalışmalarında uygularsın." },
      { title: "Güvenlik", text: "Güvenli ve planlı çalışma kültürü geliştirirsin." },
    ],
    careerAreas: ["İlgili sektör kuruluşları", "Teknik servis ve uygulama birimleri", "Yükseköğretimin ilgili programları"],
  });
}

export function normalizeDepartmentBlocks(
  value: unknown,
  legacy: LegacyDepartmentContent,
): DepartmentContentBlock[] {
  if (!Array.isArray(value)) return createLegacyDepartmentBlocks(legacy);

  return value.flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== "object") return [];
    const block = candidate as Record<string, unknown>;
    if (!isDepartmentBlockType(block.type)) return [];
    const title = String(block.title ?? "").trim();
    const content = String(block.content ?? "").trim();
    const footer = String(block.footer ?? "").trim();
    if (!title || !content) return [];
    return [{
      id: String(block.id ?? `block-${index + 1}`),
      type: block.type,
      title,
      content,
      footer: footer || undefined,
    }];
  });
}

export function parseDepartmentBlocksFromForm(formData: FormData): DepartmentContentBlock[] {
  const ids = formData.getAll("blockId");
  const types = formData.getAll("blockType");
  const titles = formData.getAll("blockTitle");
  const contents = formData.getAll("blockContent");
  const footers = formData.getAll("blockFooter");

  if (new Set([ids.length, types.length, titles.length, contents.length, footers.length]).size !== 1) {
    throw new Error("Bölüm kısımları eksik veya geçersiz gönderildi.");
  }

  return types.map((rawType, index) => {
    const type = String(rawType);
    if (!isDepartmentBlockType(type)) throw new Error("Geçersiz bölüm kısmı türü.");
    const title = String(titles[index] ?? "").trim();
    const content = String(contents[index] ?? "").trim();
    const footer = String(footers[index] ?? "").trim();
    if (!title || !content) throw new Error("Eklenen her kısmın başlığı ve içeriği doldurulmalıdır.");
    return {
      id: String(ids[index] ?? "").trim() || `block-${Date.now()}-${index}`,
      type,
      title,
      content,
      footer: footer || undefined,
    };
  });
}

export function blocksToLegacyFields(blocks: DepartmentContentBlock[]): LegacyDepartmentContent {
  return {
    facts: blocks.filter((block) => block.type === "info-cards").flatMap((block) => linesToPairs(block.content)),
    skills: blocks.filter((block) => block.type === "skills").flatMap((block) => linesToList(block.content)),
    learningAreas: blocks.filter((block) => block.type === "learning-cards").flatMap((block) => linesToTitledPairs(block.content)),
    careerAreas: blocks.filter((block) => block.type === "career-tags").flatMap((block) => linesToList(block.content)),
  };
}
