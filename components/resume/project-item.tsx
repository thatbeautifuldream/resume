import type { Project } from "@/lib/resume-schema";
import { range } from "@/lib/format";

export function ProjectItem({ item }: { item: Project }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex gap-3 items-start print:gap-2 print:items-center">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between sm:flex-row flex-col sm:items-baseline items-start print:flex-row print:items-baseline">
              <strong className="text-sm md:text-base print:text-sm">
                {item.name}
              </strong>
              <em className="sm:mt-0 mt-1 text-xs md:text-sm print:text-xs print:mt-0">
                {range(item.startDate, item.endDate)}
              </em>
            </div>
            {item.url && (
              <div className="text-sm md:text-base print:text-sm">
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.url.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {item.description && (
          <p className="text-sm md:text-base">{item.description}</p>
        )}
        {!!item.highlights?.length && (
          <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
            {item.highlights.map((h, i) => (
              <li key={i} className="text-justify">
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
