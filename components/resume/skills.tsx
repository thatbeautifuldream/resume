import type { Skill } from "@/lib/resume-schema";

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;
  return (
    <div>
      {skills.map((s, i) => (
        <div key={i} className="mb-3">
          <div className="font-semibold text-sm mb-2">{s.name}</div>
          {!!s.keywords?.length && (
            <div className="flex flex-wrap gap-1">
              {s.keywords.map((keyword, idx) => (
                <kbd
                  key={idx}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  {keyword}
                </kbd>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
