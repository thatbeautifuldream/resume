export function formatDate(input?: string) {
  if (!input) return undefined;
  const parts = input.split("-");
  if (parts.length === 1) return parts[0];
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
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

export function calculateDuration(start?: string, end?: string) {
  if (!start) return undefined;

  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return undefined;

  const endDate = end ? new Date(end) : new Date();
  if (Number.isNaN(endDate.getTime())) return undefined;

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0 && months === 0) {
    return "< 1m";
  }

  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);

  return parts.join(" ");
}
