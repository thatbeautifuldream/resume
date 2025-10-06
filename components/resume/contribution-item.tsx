import type { Contribution } from "@/lib/resume-schema";

function extractRepoPathAndName(url: string) {
  const parsedUrl = new URL(url);
  // The pathname is "/vercel/streamdown"
  // Remove the leading slash and return the rest
  const path = parsedUrl.pathname.slice(1);
  return {
    repoPath: path,
    repoName: path.split("/")[1],
  };
}

export function ContributionItem({ item }: { item: Contribution }) {
  const { repoPath, repoName } = extractRepoPathAndName(item.repository);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <strong>{repoName}</strong>
        <a
          href={item.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          {repoPath}
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
