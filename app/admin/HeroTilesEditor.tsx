"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2 } from "lucide-react";
import {
  parseHomepageHeroTiles,
  type HomepageHeroTile,
} from "@/lib/cms/homepage-hero-tiles";

function createHeroTile(): HomepageHeroTile {
  return {
    id: crypto.randomUUID(),
    title: "Yeni tanıtım kartı",
    href: "#anasayfa",
    image: "",
    imageAlt: "",
    size: "standard",
  };
}

export function HeroTilesEditor({ name, value }: { name: string; value: string }) {
  const [tiles, setTiles] = useState(() => parseHomepageHeroTiles(value));
  const serializedTiles = useMemo(() => JSON.stringify(tiles), [tiles]);

  function updateTile(id: string, changes: Partial<HomepageHeroTile>) {
    setTiles((current) => current.map((tile) => tile.id === id ? { ...tile, ...changes } : tile));
  }

  function moveTile(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tiles.length) return;
    setTiles((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  return (
    <div className="admin-hero-tile-editor">
      <input type="hidden" name={name} value={serializedTiles} />
      <div className="admin-feature-editor-intro">
        <span>
          <strong>Tanıtım kartları</strong>
          <small>Kartları ayrı ayrı düzenleyin; oklarla ana sayfadaki sıralarını değiştirin.</small>
        </span>
        <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setTiles((current) => [...current, createHeroTile()])}>
          <Plus aria-hidden="true" size={15} /> Kart ekle
        </button>
      </div>

      <div className="admin-hero-tile-list">
        {tiles.map((tile, index) => (
          <article className={`admin-hero-tile-card admin-hero-tile-card--${tile.size}`} key={tile.id}>
            <header>
              <span className="admin-hero-tile-number">{String(index + 1).padStart(2, "0")}</span>
              <span><strong>{tile.title || "İsimsiz kart"}</strong><small>{tile.size === "featured" ? "Öne çıkan büyük kart" : "Standart kart"}</small></span>
              <div className="admin-feature-card-actions">
                <button type="button" onClick={() => moveTile(index, "up")} disabled={index === 0} aria-label={`${tile.title} kartını yukarı taşı`}><ArrowUp size={15} /></button>
                <button type="button" onClick={() => moveTile(index, "down")} disabled={index === tiles.length - 1} aria-label={`${tile.title} kartını aşağı taşı`}><ArrowDown size={15} /></button>
                <button type="button" className="is-danger" onClick={() => setTiles((current) => current.filter((item) => item.id !== tile.id))} aria-label={`${tile.title} kartını sil`}><Trash2 size={15} /></button>
              </div>
            </header>

            <div className="admin-hero-tile-body">
              <div className="admin-hero-tile-preview">
                {tile.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- CMS image can be a remote or uploaded URL.
                  <img src={tile.image} alt="" />
                ) : <ImageIcon aria-hidden="true" size={26} />}
              </div>
              <div className="admin-hero-tile-fields">
                <label>
                  Başlık
                  <input type="text" value={tile.title} maxLength={80} required onChange={(event) => updateTile(tile.id, { title: event.target.value })} />
                </label>
                <label>
                  Kart boyutu
                  <select value={tile.size} onChange={(event) => updateTile(tile.id, { size: event.target.value === "featured" ? "featured" : "standard" })}>
                    <option value="featured">Öne çıkan büyük kart</option>
                    <option value="standard">Standart kart</option>
                  </select>
                </label>
                <label>
                  Bağlantı
                  <input type="text" value={tile.href} required placeholder="/sayfa veya #alan" onChange={(event) => updateTile(tile.id, { href: event.target.value })} />
                </label>
                <label>
                  Görsel yolu
                  <input type="text" value={tile.image} required placeholder="/images/..." onChange={(event) => updateTile(tile.id, { image: event.target.value })} />
                </label>
                <label className="admin-hero-tile-full">
                  Görsel açıklaması
                  <input type="text" value={tile.imageAlt} maxLength={180} onChange={(event) => updateTile(tile.id, { imageAlt: event.target.value })} />
                </label>
                <label className="admin-hero-tile-full">
                  Yeni görsel yükle
                  <input type="file" name={`${name}_file_${tile.id}`} accept="image/jpeg,image/png,image/webp" />
                </label>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
