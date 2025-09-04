import type { Talks } from "@/lib/resume-schema"
import { formatDate } from "@/lib/format"

export function TalkItem({ item }: { item: Talks }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline sm:flex-row flex-col sm:items-baseline items-start">
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
        {item.date && <em className="sm:mt-0 mt-1">{formatDate(item.date)}</em>}
      </div>
      {item.event && <div className="italic">{item.event}</div>}
      {item.summary && <p className="text-justify">{item.summary}</p>}
    </div>
  )
}