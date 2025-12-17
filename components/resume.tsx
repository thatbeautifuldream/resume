import { Badge } from "@/components/ui/badge";
import { formatDate, range, rangeCompact } from "@/lib/format";
import type {
  Basics,
  Certificates,
  Contribution,
  Education,
  Profile,
  Project,
  Reference,
  Resume,
  Skill,
  Talks,
  Work,
} from "@/lib/resume-schema";
import Link from "next/link";
import type * as React from "react";

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h4 className="pb-1 uppercase font-semibold border-b">{title}</h4>
      <div>{children}</div>
    </section>
  );
}

function ResumeFooter() {
  return (
    <footer className="mt-8 pt-4 text-center text-xs md:text-sm">
      <p className="text-muted-foreground">
        Source :{" "}
        <a
          href="https://github.com/thatbeautifuldream/resume"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/thatbeautifuldream/resume
        </a>
      </p>
    </footer>
  );
}

function ProfileLinkWithNetwork({ profile }: { profile: Profile }) {
  const getNetworkLabel = (network: string, username?: string) => {
    const n = network.toLowerCase();
    if (n.includes("github")) return `github/${username || ""}`;
    if (n.includes("twitter") || n === "x") return `x/${username || ""}`;
    if (n.includes("linkedin")) return `linkedin/${username || ""}`;
    if (n.includes("youtube")) return `youtube/${username || ""}`;
    if (n.includes("cal")) return `cal.com/${username || ""}`;
    return username || profile.url || network;
  };

  const label = getNetworkLabel(profile.network || "", profile.username);
  const href = profile.url || "#";

  return href !== "#" ? (
    <Link href={href} target="_blank" rel="noreferrer">
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
}

function ResumeHeaderItem({ basics }: { basics: Basics }) {
  return (
    <header className="text-left space-y-3 md:space-y-4">
      <div className="space-y-3 md:space-y-4">
        <h2 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">
          {basics.name.toUpperCase()}
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
          {basics.email && (
            <a
              href={`mailto:${basics.email}`}
              className="hover:underline cursor-pointer print:cursor-default active:opacity-75 transition-opacity"
            >
              {basics.email}
            </a>
          )}
          {basics.phone && <a href={`tel:${basics.phone}`}>{basics.phone}</a>}
          {basics.url && (
            <Link href={basics.url} target="_blank" rel="noreferrer">
              {basics.url.replace(/^https?:\/\//, "")}
            </Link>
          )}
          {basics.profiles?.map((p) => (
            <ProfileLinkWithNetwork key={p.network} profile={p} />
          ))}
        </div>

        {basics.summary && (
          <div className="border-l-4 pl-3 sm:pl-4 space-y-2">
            <p className="text-xs sm:text-sm md:text-base">{basics.summary}</p>
          </div>
        )}
      </div>
    </header>
  );
}

function WorkExperienceItem({ item }: { item: Work }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex gap-3 items-start print:gap-2 print:items-center">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline gap-2">
              <strong className="text-sm md:text-base print:text-sm">
                {item.position || "Role"}
              </strong>
              {item.workType && (
                <em className="text-xs md:text-sm print:text-xs text-muted-foreground">
                  {item.workType}
                </em>
              )}
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="italic text-sm md:text-base print:text-sm">
                {item.name}
              </span>
              <em className="text-xs md:text-sm print:text-xs whitespace-nowrap">
                <span className="sm:hidden">
                  {rangeCompact(item.startDate, item.endDate)}
                </span>
                <span className="hidden sm:inline">
                  {range(item.startDate, item.endDate)}
                </span>
              </em>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {item.summary && <p className="text-sm md:text-base">{item.summary}</p>}
        {!!item.highlights?.length && (
          <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
            {item.highlights.map((h) => (
              <li key={h} className="text-justify">
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ProjectPortfolioItem({ item }: { item: Project }) {
  // Use single date if available, otherwise fall back to date range
  const dateDisplay = item.date
    ? formatDate(item.date)
    : range(item.startDate, item.endDate);

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
                {dateDisplay}
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
            {item.highlights.map((h) => (
              <li key={h} className="text-justify">
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EducationCredentialItem({ item }: { item: Education }) {
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

function CertificateAchievementItem({ item }: { item: Certificates }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline sm:flex-row flex-col sm:items-baseline">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline text-sm md:text-base"
          >
            <strong>{item.name}</strong>
          </a>
        ) : (
          <strong className="text-sm md:text-base">{item.name}</strong>
        )}
        <div className="sm:flex sm:gap-4 sm:items-baseline">
          {item.issuer && (
            <div className="italic hidden sm:block float-right text-sm md:text-base">
              {item.issuer}
            </div>
          )}
          {item.date && (
            <em className="sm:mt-0 mt-1 text-xs md:text-sm">{item.date}</em>
          )}
        </div>
      </div>
      {item.issuer && (
        <div className="italic sm:hidden text-sm md:text-base">
          {item.issuer}
        </div>
      )}
    </div>
  );
}

function OpenSourceContributionItem({ item }: { item: Contribution }) {
  const extractRepoPathAndName = (url: string) => {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname.slice(1);
    return {
      repoPath: path,
      repoName: path.split("/")[1],
    };
  };

  const { repoPath, repoName } = extractRepoPathAndName(item.repository);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <strong className="text-sm md:text-base">{repoName}</strong>
        <a
          href={item.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm hover:underline"
        >
          {repoPath}
        </a>
      </div>

      {!!item.prs?.length && (
        <div className="space-y-1">
          {item.prs.map((pr) => (
            <div key={pr.title} className="text-sm md:text-base">
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

function TalkPresentationItem({ item }: { item: Talks }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between sm:flex-row flex-col sm:items-baseline items-start">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline text-sm md:text-base"
          >
            <strong>{item.title}</strong>
          </a>
        ) : (
          <strong className="text-sm md:text-base">{item.title}</strong>
        )}
        {item.date && (
          <em className="sm:mt-0 mt-1 text-xs md:text-sm">
            {formatDate(item.date)}
          </em>
        )}
      </div>
      {item.event && (
        <div className="italic text-xs md:text-sm">{item.event}</div>
      )}
      {item.summary && (
        <p className="text-justify text-sm md:text-base">{item.summary}</p>
      )}
    </div>
  );
}

function SkillsProficiency({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;
  return (
    <div className="space-y-3">
      {skills.map((s) => (
        <div key={s.name} className="space-y-2">
          <div className="font-semibold text-sm md:text-base">{s.name}</div>
          {!!s.keywords?.length && (
            <div className="flex flex-wrap gap-2">
              {s.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="text-xs md:text-sm"
                >
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

function ReferenceTestimonial({ items }: { items: Reference[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-4">
      {items.map((r) => (
        <blockquote
          key={r.name}
          className="italic border-l-4 border-border pl-4 space-y-2 text-sm md:text-base"
        >
          <div>{r.reference}</div>
          <footer className="text-xs md:text-sm font-semibold">
            — {r.name} ({r.title})
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

export function ResumeView({ data }: { data: Resume }) {
  return (
    <article className="space-y-6 py-4 md:py-8">
      <ResumeHeaderItem basics={data.basics} />

      {!!data.talks?.length && (
        <ResumeSection title="Talks">
          <div className="space-y-5">
            {data.talks.map((t) => (
              <TalkPresentationItem key={t.title} item={t} />
            ))}
          </div>
        </ResumeSection>
      )}

      {!!data.contributions?.length && (
        <ResumeSection title="Open Source Contributions">
          <div className="space-y-5">
            {data.contributions.map((c) => (
              <OpenSourceContributionItem key={c.repository} item={c} />
            ))}
          </div>
        </ResumeSection>
      )}

      {!!data.work?.length && (
        <ResumeSection title="Experience">
          <div className="space-y-8">
            {data.work.map((w) => (
              <WorkExperienceItem key={w.name} item={w} />
            ))}
          </div>
        </ResumeSection>
      )}

      {!!data.projects?.length && (
        <ResumeSection title="Products">
          <div className="space-y-8">
            {data.projects.map((p) => (
              <ProjectPortfolioItem key={p.name} item={p} />
            ))}
          </div>
        </ResumeSection>
      )}

      {!!data.education?.length && (
        <ResumeSection title="Education">
          <div className="space-y-5">
            {data.education.map((e) => (
              <EducationCredentialItem key={e.institution} item={e} />
            ))}
          </div>
        </ResumeSection>
      )}

      {!!data.certificates?.length && (
        <ResumeSection title="Certificates">
          <div className="space-y-5">
            {data.certificates.map((c) => (
              <CertificateAchievementItem key={c.name} item={c} />
            ))}
          </div>
        </ResumeSection>
      )}

      {!!data.skills?.length && (
        <ResumeSection title="Skills">
          <SkillsProficiency skills={data.skills} />
        </ResumeSection>
      )}

      {!!data.references?.length && (
        <ResumeSection title="References">
          <ReferenceTestimonial items={data.references} />
        </ResumeSection>
      )}

      <ResumeFooter />
    </article>
  );
}
