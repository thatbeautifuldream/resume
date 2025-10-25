import { pinnedProjects } from "@/lib/pinned-projects";

export default function Page() {
  return (
    <code className="whitespace-pre-wrap break-words">
      {JSON.stringify(pinnedProjects, null, 2)}
    </code>
  );
}
