export function formatDate(input?: string) {
  if (!input) return undefined
  const parts = input.split("-")
  if (parts.length === 1) return parts[0]
  const d = new Date(input)
  if (isNaN(d.getTime())) return input
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" })
}

export function range(start?: string, end?: string) {
  const s = formatDate(start)
  const e = end ? formatDate(end) : "Present"
  if (!s && !e) return undefined
  if (!s) return e
  return `${s} — ${e}`
}

export function joinNonEmpty(parts: (string | undefined)[], sep = " · ") {
  return parts.filter(Boolean).join(sep)
}
