export function formatDate(input?: string) {
  if (!input) return undefined;
  const parts = input.split("-");
  if (parts.length === 1) return parts[0];
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function formatDateCompact(input?: string) {
  if (!input) return undefined;
  const parts = input.split("-");
  if (parts.length === 1) return parts[0];
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  const month = d.toLocaleDateString(undefined, { month: "short" });
  const year = d.toLocaleDateString(undefined, { year: "2-digit" });
  return `${month} ${year}`;
}

export function range(start?: string, end?: string) {
  const s = formatDate(start);
  const e = end ? formatDate(end) : "Present";
  if (!s && !e) return undefined;
  if (!s) return e;
  return `${s} — ${e}`;
}

export function rangeCompact(start?: string, end?: string) {
  const s = formatDateCompact(start);
  const e = end ? formatDateCompact(end) : "Present";
  if (!s && !e) return undefined;
  if (!s) return e;
  return `${s} - ${e}`;
}

export function joinNonEmpty(parts: (string | undefined)[], sep = " · ") {
  return parts.filter(Boolean).join(sep);
}
