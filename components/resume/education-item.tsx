import type { Education } from "@/lib/resume-schema"
import { range } from "@/lib/format"

export function EducationItem({ item }: { item: Education }) {
  const title = [item.studyType, item.area].filter(Boolean).join(", ")
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline sm:flex-row flex-col sm:items-baseline">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            <strong>{item.institution}</strong>
          </a>
        ) : (
          <strong>{item.institution}</strong>
        )}
        <em className="sm:mt-0 mt-1">{range(item.startDate, item.endDate)}</em>
      </div>
      <div className="italic">{title}</div>
      {item.score && <div>GPA: {item.score}</div>}
    </div>
  )
}
