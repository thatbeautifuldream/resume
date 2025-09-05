import type { Contribution } from "@/lib/resume-schema";

export function ContributionItem({ item }: { item: Contribution }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <strong>{item.organisation}</strong>
        <a
          href={item.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          {item.repository.replace(/^https:\/\/github\.com\//, "")}
        </a>
      </div>

      {!!item.prs?.length && (
        <div className="space-y-1">
          {item.prs.map((pr, i) => (
            <div key={i} className="text-md">
              <a
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {pr.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
