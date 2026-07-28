"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  CircuitBoard,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Plus,
  School,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import {
  HOMEPAGE_FEATURE_ICON_OPTIONS,
  parseHomepageFeatureCards,
  type HomepageFeatureCard,
  type HomepageFeatureIcon,
} from "@/lib/cms/homepage-feature-cards";

const FEATURE_ICONS = {
  flask: FlaskConical,
  building: Building2,
  wrench: Wrench,
  graduation: GraduationCap,
  shield: ShieldCheck,
  users: Users,
  trophy: Trophy,
  school: School,
  zap: Zap,
  heart: HeartPulse,
  circuit: CircuitBoard,
} satisfies Record<HomepageFeatureIcon, typeof FlaskConical>;

function createFeatureCard(): HomepageFeatureCard {
  return {
    id: crypto.randomUUID(),
    icon: "school",
    title: "Yeni özellik",
    description: "",
    size: "half",
  };
}

export function FeatureCardsEditor({ name, value }: { name: string; value: string }) {
  const [cards, setCards] = useState(() => parseHomepageFeatureCards(value));
  const serializedCards = useMemo(() => JSON.stringify(cards), [cards]);

  function updateCard(id: string, changes: Partial<HomepageFeatureCard>) {
    setCards((current) => current.map((card) => card.id === id ? { ...card, ...changes } : card));
  }

  function moveCard(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    setCards((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  return (
    <div className="admin-feature-editor">
      <input type="hidden" name={name} value={serializedCards} />
      <div className="admin-feature-editor-intro">
        <span>
          <strong>Özellik kartları</strong>
          <small>İkonu ve kart genişliğini seçin; sıralamayı oklarla değiştirin.</small>
        </span>
        <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setCards((current) => [...current, createFeatureCard()])}>
          <Plus aria-hidden="true" size={15} /> Kart ekle
        </button>
      </div>

      <div className="admin-feature-card-list">
        {cards.map((card, index) => {
          const Icon = FEATURE_ICONS[card.icon];
          return (
            <article className={`admin-feature-card admin-feature-card--${card.size}`} key={card.id}>
              <header>
                <span className="admin-feature-card-icon"><Icon aria-hidden="true" size={21} /></span>
                <span><strong>Kart {index + 1}</strong><small>{card.size === "wide" ? "Tekli uzun kart" : "İkili kart"}</small></span>
                <div className="admin-feature-card-actions">
                  <button type="button" onClick={() => moveCard(index, "up")} disabled={index === 0} aria-label={`${card.title} kartını yukarı taşı`}><ArrowUp size={15} /></button>
                  <button type="button" onClick={() => moveCard(index, "down")} disabled={index === cards.length - 1} aria-label={`${card.title} kartını aşağı taşı`}><ArrowDown size={15} /></button>
                  <button type="button" className="is-danger" onClick={() => setCards((current) => current.filter((item) => item.id !== card.id))} aria-label={`${card.title} kartını sil`}><Trash2 size={15} /></button>
                </div>
              </header>

              <div className="admin-feature-card-fields">
                <label>
                  İkon
                  <select value={card.icon} onChange={(event) => updateCard(card.id, { icon: event.target.value as HomepageFeatureIcon })}>
                    {HOMEPAGE_FEATURE_ICON_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label>
                  Kart boyutu
                  <select value={card.size} onChange={(event) => updateCard(card.id, { size: event.target.value === "wide" ? "wide" : "half" })}>
                    <option value="half">İkili kart</option>
                    <option value="wide">Tekli uzun kart</option>
                  </select>
                </label>
                <label className="admin-feature-card-full">
                  Başlık
                  <input type="text" value={card.title} maxLength={90} required onChange={(event) => updateCard(card.id, { title: event.target.value })} />
                </label>
                <label className="admin-feature-card-full">
                  Açıklama
                  <textarea value={card.description} maxLength={220} rows={3} onChange={(event) => updateCard(card.id, { description: event.target.value })} />
                </label>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
