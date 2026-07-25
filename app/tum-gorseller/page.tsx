import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import type { Metadata } from "next";

// Dahili (yalnızca kendim için) görsel envanteri sayfası.
// public/ altındaki tüm görselleri listeler; öğretmen kadrosu portreleri
// (uploads/staff) hariç tutulur. Her istekte diskten okunur.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tüm Görseller (dahili)",
  robots: { index: false, follow: false },
};

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);
// Bu ön eklerle başlayan görseller listelenmez.
const EXCLUDE_PREFIXES = ["uploads/staff"];

function toPosix(p: string): string {
  return p.split("\\").join("/");
}

async function walk(dir: string, root: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, root)));
      continue;
    }
    const ext = entry.name.slice(entry.name.lastIndexOf(".")).toLowerCase();
    if (IMAGE_EXTS.has(ext)) files.push(toPosix(relative(root, full)));
  }
  return files;
}

export default async function TumGorsellerPage() {
  const root = join(process.cwd(), "public");
  const all = (await walk(root, root))
    .filter((p) => !EXCLUDE_PREFIXES.some((pre) => p.startsWith(pre)))
    .sort((a, b) => a.localeCompare(b, "tr"));

  const groups = new Map<string, string[]>();
  for (const p of all) {
    const folder = p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "(kök)";
    (groups.get(folder) ?? groups.set(folder, []).get(folder)!).push(p);
  }
  const sortedGroups = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], "tr"));

  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px 80px", fontFamily: "system-ui, sans-serif", color: "#1a1a2e" }}>
      <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>Tüm Görseller (dahili)</h1>
      <p style={{ margin: "0 0 8px", color: "#555", fontSize: 14 }}>
        Toplam {all.length} görsel · {sortedGroups.length} klasör · öğretmen kadrosu (uploads/staff) hariç
      </p>
      <nav style={{ margin: "0 0 28px", fontSize: 13, lineHeight: 1.9 }}>
        {sortedGroups.map(([folder, files]) => (
          <a key={folder} href={`#${encodeURIComponent(folder)}`} style={{ marginRight: 14, color: "#2d2958", whiteSpace: "nowrap" }}>
            {folder} ({files.length})
          </a>
        ))}
      </nav>

      {sortedGroups.map(([folder, files]) => (
        <section key={folder} id={folder} style={{ marginBottom: 40, scrollMarginTop: 16 }}>
          <h2 style={{ fontSize: 15, borderBottom: "1px solid #ddd", paddingBottom: 6, margin: "0 0 14px" }}>
            {folder} <span style={{ color: "#888", fontWeight: 400 }}>· {files.length}</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
            {files.map((p) => (
              <a key={p} href={`/${p}`} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none", color: "#333" }}>
                <img
                  src={`/${p}`}
                  alt={p}
                  loading="lazy"
                  style={{ width: "100%", height: 150, objectFit: "cover", background: "#f0f0f0", borderRadius: 6, display: "block" }}
                />
                <div style={{ fontSize: 11, wordBreak: "break-all", marginTop: 4, lineHeight: 1.3 }}>{p.slice(p.lastIndexOf("/") + 1)}</div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
