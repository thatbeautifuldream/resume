import type { Education } from "@/lib/resume-schema";
import { range } from "@/lib/format";

export function EducationItem({ item }: { item: Education }) {
  const title = [item.studyType, item.area].filter(Boolean).join(", ");
  return (
    <div className="space-y-1">
      <div className="flex gap-3 items-start print:gap-2 print:items-center">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-baseline sm:flex-row flex-col sm:items-baseline print:flex-row print:items-baseline">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline text-sm md:text-base print:text-sm"
              >
                <strong>{item.institution}</strong>
              </a>
            ) : (
              <strong className="text-sm md:text-base print:text-sm">
                {item.institution}
              </strong>
            )}
            <em className="sm:mt-0 mt-1 text-xs md:text-sm print:text-xs print:mt-0">
              {range(item.startDate, item.endDate)}
            </em>
          </div>
          <div className="italic text-sm md:text-base print:text-sm">
            {title}
          </div>
          {item.score && (
            <div className="text-sm md:text-base print:text-sm">
              GPA: {item.score}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
