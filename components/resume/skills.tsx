import type { Skill } from "@/lib/resume-schema";
import { Badge } from "@/components/ui/badge";

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;
  return (
    <div className="space-y-3">
      {skills.map((s, i) => (
        <div key={i} className="space-y-2">
          <div className="font-semibold text-sm md:text-base">{s.name}</div>
          {!!s.keywords?.length && (
            <div className="flex flex-wrap gap-2">
              {s.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs md:text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
