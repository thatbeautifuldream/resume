import type { Reference } from "@/lib/resume-schema"

export function References({ items }: { items: Reference[] }) {
  if (!items?.length) return null
  return (
    <div>
      {items.map((r, i) => (
        <div key={i} className="mb-4">
          <blockquote className="italic border-l-4 border-gray-300 pl-4 ml-2">
            {r.reference}
            <footer className="text-sm font-semibold mt-2">— {r.name}</footer>
          </blockquote>
        </div>
      ))}
    </div>
  )
}
