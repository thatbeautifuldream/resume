import type { Skill } from "@/lib/resume-schema";

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;
  return (
    <div>
      {skills.map((s, i) => (
        <div key={i} className="mb-3">
          <div className="font-semibold text-md mb-2">{s.name}</div>
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
