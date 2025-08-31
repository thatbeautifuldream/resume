import type { Talks } from "@/lib/resume-schema"
import { formatDate } from "@/lib/format"

export function TalkItem({ item }: { item: Talks }) {
  return (
    <div>
      <div className="flex justify-between items-baseline">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            <strong>{item.title}</strong>
          </a>
        ) : (
          <strong>{item.title}</strong>
        )}
        {item.date && <em>{formatDate(item.date)}</em>}
      </div>
      {item.event && <div className="italic mb-2">{item.event}</div>}
      {item.summary && <p className="text-justify">{item.summary}</p>}
    </div>
  )
}