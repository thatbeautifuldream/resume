import type { Reference } from "@/lib/resume-schema";

export function References({ items }: { items: Reference[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-4">
      {items.map((r, i) => (
        <blockquote
          key={i}
          className="italic border-l-4 border-border pl-4 space-y-2"
        >
          <div>{r.reference}</div>
          <footer className="text-sm font-semibold">— {r.name}</footer>
        </blockquote>
      ))}
    </div>
  );
}
