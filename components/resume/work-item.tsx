import type { Work } from "@/lib/resume-schema";
import { range } from "@/lib/format";

export function WorkItem({ item }: { item: Work }) {
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <strong>{item.position || "Role"}</strong>
        <em>{range(item.startDate, item.endDate)}</em>
      </div>
      <div className="italic">{item.name}</div>
      {item.summary && <p>{item.summary}</p>}
      {!!item.highlights?.length && (
        <ul className="list-disc pl-5 space-y-1">
          {item.highlights.map((h, i) => (
            <li key={i} className="text-justify">
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
