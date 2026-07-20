"use client";

import { useId, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  CheckSquare2,
  CircleAlert,
  FileText,
  LayoutGrid,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DEPARTMENT_BLOCK_OPTIONS,
  type DepartmentContentBlock,
  type DepartmentContentBlockType,
} from "@/lib/department-blocks";

const BLOCK_ICONS = {
  "info-cards": LayoutGrid,
  "branch-list": CircleAlert,
  skills: CheckSquare2,
  "learning-cards": LayoutGrid,
  "career-tags": BriefcaseBusiness,
  text: FileText,
  highlight: CircleAlert,
} satisfies Record<DepartmentContentBlockType, typeof LayoutGrid>;

const BLOCK_HINTS: Record<DepartmentContentBlockType, string> = {
  "info-cards": "Her satır: Etiket | Değer. Üç bilgi kartı önerilir.",
  "branch-list": "Her satıra bir dal yazın. Eğitim verilmeyen dalların açıklamasını aynı satırda eksiksiz koruyun.",
  skills: "Her satıra bir beceri yazın.",
  "learning-cards": "Her satır: Kart başlığı | Kart açıklaması.",
  "career-tags": "Her satıra bir kariyer veya devam eğitimi alanı yazın.",
  text: "Her satır ziyaretçi sayfasında ayrı bir paragraf olarak gösterilir.",
  highlight: "Tek bir önemli bilgi veya kısa açıklama yazın.",
};

function createBlock(type: DepartmentContentBlockType): DepartmentContentBlock {
  const option = DEPARTMENT_BLOCK_OPTIONS.find((candidate) => candidate.value === type)!;
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `block-${Date.now()}`,
    type,
    title: option.defaultTitle,
    content: option.defaultContent,
  };
}

export function DepartmentBlocksEditor({ initialBlocks }: { initialBlocks: DepartmentContentBlock[] }) {
  const editorId = useId();
  const [blocks, setBlocks] = useState(initialBlocks);
  const [selectedType, setSelectedType] = useState<DepartmentContentBlockType>("info-cards");
  const selectedOption = DEPARTMENT_BLOCK_OPTIONS.find((option) => option.value === selectedType)!;

  function updateBlock(id: string, field: "title" | "content" | "footer", value: string): void {
    setBlocks((current) => current.map((block) => block.id === id ? { ...block, [field]: value } : block));
  }

  function moveBlock(index: number, direction: -1 | 1): void {
    setBlocks((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  return (
    <section className="admin-block-editor" aria-labelledby={`${editorId}-title`}>
      <div className="admin-block-editor-heading">
        <div>
          <span className="admin-eyebrow">Sayfa kısımları</span>
          <h2 id={`${editorId}-title`}>Bölüm içeriğini oluşturun</h2>
          <p>Bilgi kartı, beceri, öğrenme kartı, kariyer alanı veya serbest bilgi metni ekleyin.</p>
        </div>
        <span className="admin-block-count">{blocks.length} kısım</span>
      </div>

      <div className="admin-block-add-panel">
        <label htmlFor={`${editorId}-type`}>
          Eklenecek kısmın özelliği
          <select
            id={`${editorId}-type`}
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as DepartmentContentBlockType)}
          >
            {DEPARTMENT_BLOCK_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <div className="admin-block-add-description">
          <strong>{selectedOption.label}</strong>
          <span>{selectedOption.description}</span>
        </div>
        <button className="admin-btn" type="button" onClick={() => setBlocks((current) => [...current, createBlock(selectedType)])}>
          <Plus aria-hidden="true" size={16} /> Kısım ekle
        </button>
      </div>

      {blocks.length === 0 ? (
        <div className="admin-block-empty">
          <LayoutGrid aria-hidden="true" size={24} />
          <strong>Henüz içerik kısmı yok</strong>
          <span>Yukarıdan bir özellik seçip ilk kısmı ekleyin.</span>
        </div>
      ) : (
        <div className="admin-block-list">
          {blocks.map((block, index) => {
            const option = DEPARTMENT_BLOCK_OPTIONS.find((candidate) => candidate.value === block.type)!;
            const Icon = BLOCK_ICONS[block.type];
            return (
              <article className={`admin-block-card admin-block-card--${block.type}`} key={block.id}>
                <input type="hidden" name="blockId" value={block.id} />
                <input type="hidden" name="blockType" value={block.type} />
                {block.type !== "skills" && block.type !== "branch-list" ? <input type="hidden" name="blockFooter" value={block.footer ?? ""} /> : null}
                <header className="admin-block-card-header">
                  <div className="admin-block-card-type">
                    <span><Icon aria-hidden="true" size={17} /></span>
                    <div><small>Kısım {index + 1}</small><strong>{option.label}</strong></div>
                  </div>
                  <div className="admin-block-card-actions" aria-label={`${option.label} sıralama ve silme seçenekleri`}>
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} aria-label="Yukarı taşı" title="Yukarı taşı"><ArrowUp size={16} /></button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} aria-label="Aşağı taşı" title="Aşağı taşı"><ArrowDown size={16} /></button>
                    <button className="is-danger" type="button" onClick={() => setBlocks((current) => current.filter((candidate) => candidate.id !== block.id))} aria-label={`${option.label} kısmını sil`} title="Kısmı sil"><Trash2 size={16} /></button>
                  </div>
                </header>
                <div className="admin-block-card-fields">
                  <label>
                    Kısım başlığı
                    <input name="blockTitle" value={block.title} onChange={(event) => updateBlock(block.id, "title", event.target.value)} required />
                  </label>
                  <label>
                    İçerik
                    <span className="admin-hint">{BLOCK_HINTS[block.type]}</span>
                    <textarea name="blockContent" value={block.content} onChange={(event) => updateBlock(block.id, "content", event.target.value)} required />
                  </label>
                  {block.type === "skills" ? (
                    <label className="admin-block-footer-field">
                      Liste sonrası açıklama <span className="admin-optional">(isteğe bağlı)</span>
                      <span className="admin-hint">Maddelerin ardından gösterilecek tamamlayıcı cümleyi yazın.</span>
                      <textarea name="blockFooter" value={block.footer ?? ""} onChange={(event) => updateBlock(block.id, "footer", event.target.value)} />
                    </label>
                  ) : block.type === "branch-list" ? (
                    <label className="admin-block-footer-field">
                      Liste giriş metni <span className="admin-optional">(isteğe bağlı)</span>
                      <span className="admin-hint">Dal kartlarından önce gösterilecek kısa açıklamayı yazın.</span>
                      <textarea name="blockFooter" value={block.footer ?? ""} onChange={(event) => updateBlock(block.id, "footer", event.target.value)} />
                    </label>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
