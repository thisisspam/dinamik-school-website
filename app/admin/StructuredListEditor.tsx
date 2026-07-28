"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2 } from "lucide-react";
import {
  getHomepageStructuredField,
  parseHomepageStructuredRows,
  type HomepageStructuredRow,
} from "@/lib/cms/homepage-structured-fields";

function createRow(columnKeys: string[]): HomepageStructuredRow {
  return {
    id: crypto.randomUUID(),
    values: Object.fromEntries(columnKeys.map((key) => [key, ""])),
  };
}

export function StructuredListEditor({
  sectionKey,
  fieldKey,
  name,
  value,
}: {
  sectionKey: string;
  fieldKey: string;
  name: string;
  value: string;
}) {
  const definition = getHomepageStructuredField(sectionKey, fieldKey);
  if (!definition) throw new Error(`${sectionKey}.${fieldKey} için yapılandırılmış alan tanımı bulunamadı.`);

  const [rows, setRows] = useState(() => parseHomepageStructuredRows(value, definition));
  const serializedRows = useMemo(() => JSON.stringify(rows), [rows]);

  function updateRow(id: string, key: string, nextValue: string) {
    setRows((current) => current.map((row) => (
      row.id === id ? { ...row, values: { ...row.values, [key]: nextValue } } : row
    )));
  }

  function moveRow(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rows.length) return;
    setRows((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  return (
    <div className="admin-structured-editor">
      <input type="hidden" name={name} value={serializedRows} />
      <div className="admin-feature-editor-intro">
        <span>
          <strong>{definition.singularLabel} düzenleyici</strong>
          <small>Alanları ayrı ayrı doldurun; oklarla ana sayfadaki sırayı değiştirin.</small>
        </span>
        <button
          className="admin-btn admin-btn-secondary"
          type="button"
          onClick={() => setRows((current) => [...current, createRow(definition.columns.map((column) => column.key))])}
        >
          <Plus aria-hidden="true" size={15} /> {definition.addLabel}
        </button>
      </div>

      <div className="admin-structured-list">
        {rows.map((row, index) => {
          const imageColumn = definition.columns.find((column) => column.type === "image");
          const titleColumn = definition.columns.find((column) => column.type !== "image");
          const rowTitle = titleColumn ? row.values[titleColumn.key] : "";
          return (
            <article className={`admin-structured-card${imageColumn ? " has-image" : ""}`} key={row.id}>
              <header>
                <span className="admin-hero-tile-number">{String(index + 1).padStart(2, "0")}</span>
                <span><strong>{rowTitle || definition.singularLabel}</strong><small>{definition.singularLabel}</small></span>
                <div className="admin-feature-card-actions">
                  <button type="button" onClick={() => moveRow(index, "up")} disabled={index === 0} aria-label={`${rowTitle || definition.singularLabel} kaydını yukarı taşı`}><ArrowUp size={15} /></button>
                  <button type="button" onClick={() => moveRow(index, "down")} disabled={index === rows.length - 1} aria-label={`${rowTitle || definition.singularLabel} kaydını aşağı taşı`}><ArrowDown size={15} /></button>
                  <button type="button" className="is-danger" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} aria-label={`${rowTitle || definition.singularLabel} kaydını sil`}><Trash2 size={15} /></button>
                </div>
              </header>

              <div className="admin-structured-card-body">
                {imageColumn ? (
                  <div className="admin-structured-image-preview">
                    {row.values[imageColumn.key] ? (
                      // eslint-disable-next-line @next/next/no-img-element -- CMS image can be a remote or uploaded URL.
                      <img src={row.values[imageColumn.key]} alt="" />
                    ) : <ImageIcon aria-hidden="true" size={26} />}
                  </div>
                ) : null}
                <div className="admin-structured-fields">
                  {definition.columns.map((column) => (
                    <label className={column.type === "textarea" || column.type === "list" || column.type === "image" ? "admin-structured-full" : undefined} key={column.key}>
                      {column.label}
                      {column.type === "textarea" || column.type === "list" ? (
                        <textarea
                          value={row.values[column.key] ?? ""}
                          rows={column.type === "list" ? 5 : 4}
                          required
                          placeholder={column.placeholder}
                          onChange={(event) => updateRow(row.id, column.key, event.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          value={row.values[column.key] ?? ""}
                          required
                          placeholder={column.placeholder}
                          onChange={(event) => updateRow(row.id, column.key, event.target.value)}
                        />
                      )}
                    </label>
                  ))}
                  {imageColumn ? (
                    <label className="admin-structured-full">
                      Yeni görsel yükle
                      <input type="file" name={`${name}_file_${row.id}_${imageColumn.key}`} accept="image/jpeg,image/png,image/webp" />
                    </label>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
