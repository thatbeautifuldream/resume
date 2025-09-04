import type { Skill } from "@/lib/resume-schema";

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;
  return (
    <div className="space-y-3">
      {skills.map((s, i) => (
        <div key={i} className="space-y-2">
          <div className="font-semibold text-md">{s.name}</div>
          {!!s.keywords?.length && (
            <div className="flex flex-wrap gap-1">
              {s.keywords.map((keyword, idx) => (
                <kbd key={idx}>{keyword}</kbd>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
