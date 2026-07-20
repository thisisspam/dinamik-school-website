// Small helpers to edit list/pair fields as plain multi-line text in a
// <textarea>, so the admin UI needs no extra client-side JS for these fields.

export function listToLines(items: string[]): string {
  return items.join("\n");
}

export function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function pairsToLines(items: Array<{ label: string; value: string }>): string {
  return items.map((item) => `${item.label} | ${item.value}`).join("\n");
}

export function linesToPairs(text: string): Array<{ label: string; value: string }> {
  return linesToList(text).map((line) => {
    const [label, ...rest] = line.split("|");
    return { label: (label ?? "").trim(), value: rest.join("|").trim() };
  });
}

export function titledPairsToLines(items: Array<{ title: string; text: string }>): string {
  return items.map((item) => `${item.title} | ${item.text}`).join("\n");
}

export function linesToTitledPairs(text: string): Array<{ title: string; text: string }> {
  return linesToList(text).map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: (title ?? "").trim(), text: rest.join("|").trim() };
  });
}
