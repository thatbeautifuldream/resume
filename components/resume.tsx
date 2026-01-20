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
    if (n.includes("github")) return `gh/${username || ""}`;
    if (n.includes("twitter") || n === "x") return `x/${username || ""}`;
    if (n.includes("linkedin")) return `li/${username || ""}`;
    if (n.includes("youtube")) return `yt/${username || ""}`;
    if (n.includes("cal")) return `cal/${username || ""}`;
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
    <header className="text-left space-y-2 md:space-y-3">
      <div className="space-y-2 md:space-y-3">
        <h2 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">
          {basics.name.toUpperCase()}
        </h2>

        {basics.summary && (
          <div className="border-l-4 pl-3 sm:pl-4 space-y-2">
            <p className="text-xs sm:text-sm md:text-base italic">
              {basics.summary}
            </p>
          </div>
        )}

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
    <span className="inline-flex items-baseline gap-1 text-sm md:text-base">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          {item.name}
        </a>
      ) : (
        <span className="font-semibold">{item.name}</span>
      )}
      {item.issuer && <span className="italic">({item.issuer})</span>}
      {item.date && (
        <span className="text-xs md:text-sm text-muted-foreground">
          [{item.date}]
        </span>
      )}
    </span>
  );
}

function OpenSourceContributionItem({ item }: { item: Contribution }) {
  const extractOrgAndRepo = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      // URL format: github.com/org/repo/pull/123
      if (pathParts.length >= 2) {
        return {
          org: pathParts[0],
          orgRepo: `${pathParts[0]}/${pathParts[1]}`,
        };
      }
      return { org: "", orgRepo: "" };
    } catch {
      return { org: "", orgRepo: "" };
    }
  };

  const { org, orgRepo } = extractOrgAndRepo(item.url);

  return (
    <div className="flex justify-between items-center gap-2">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm md:text-base hover:underline flex-1 leading-tight truncate"
      >
        {item.title}
      </a>
      {orgRepo && (
        <>
          <span className="text-xs text-muted-foreground whitespace-nowrap md:hidden flex-shrink-0">
            [{org}]
          </span>
          <span className="hidden md:inline text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">
            [{orgRepo}]
          </span>
        </>
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
    <div className="flex flex-wrap gap-x-3 text-sm md:text-base font-semibold">
      {skills.map((skill) => (
        <a
          key={skill}
          href={`/chat?q=${encodeURIComponent(`Tell me about ${skill} - what is it, and how has Milind used this skill in his work? How proficient is he with ${skill}?`)}`}
          className="hover:underline"
        >
          {skill}
        </a>
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

const RESUME_SECTION_ORDER: (keyof Resume)[] = [
  "work",
  "projects",
  "talks",
  "contributions",
  "certificates",
  "education",
  "skills",
  "references",
];

const SECTION_CONFIG: Partial<
  Record<
    keyof Resume,
    {
      title: string;
      render: (items: any) => React.ReactNode;
    }
  >
> = {
  work: {
    title: "Experience",
    render: (items: Work[]) => (
      <div className="space-y-8">
        {items.map((w) => (
          <WorkExperienceItem key={w.name} item={w} />
        ))}
      </div>
    ),
  },
  projects: {
    title: "Projects",
    render: (items: Project[]) => (
      <div className="space-y-8">
        {items.map((p) => (
          <ProjectPortfolioItem key={p.name} item={p} />
        ))}
      </div>
    ),
  },
  education: {
    title: "Education",
    render: (items: Education[]) => (
      <div className="space-y-5">
        {items.map((e) => (
          <EducationCredentialItem key={e.institution} item={e} />
        ))}
      </div>
    ),
  },
  talks: {
    title: "Talks",
    render: (items: Talks[]) => (
      <div className="space-y-5">
        {items.map((t) => (
          <TalkPresentationItem key={t.title} item={t} />
        ))}
      </div>
    ),
  },
  contributions: {
    title: "Open Source Contributions",
    render: (items: Contribution[]) => (
      <div className="space-y-2">
        {items.map((c) => (
          <OpenSourceContributionItem key={c.url} item={c} />
        ))}
      </div>
    ),
  },
  certificates: {
    title: "Certificates",
    render: (items: Certificates[]) => (
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-baseline">
        {items.map((c) => (
          <CertificateAchievementItem key={c.name} item={c} />
        ))}
      </div>
    ),
  },
  skills: {
    title: "Skills",
    render: (items: Skill[]) => <SkillsProficiency skills={items} />,
  },
  references: {
    title: "References",
    render: (items: Reference[]) => <ReferenceTestimonial items={items} />,
  },
};

export function ResumeView({ data }: { data: Resume }) {
  return (
    <article className="space-y-6 py-4 md:py-8">
      <ResumeHeaderItem basics={data.basics} />

      {RESUME_SECTION_ORDER.map((sectionKey) => {
        const section = SECTION_CONFIG[sectionKey];
        const sectionData = data[sectionKey];

        if (!section) return null;
        if (!sectionData || (Array.isArray(sectionData) && !sectionData.length))
          return null;

        return (
          <ResumeSection key={sectionKey} title={section.title}>
            {section.render(sectionData as any)}
          </ResumeSection>
        );
      })}

      <ResumeFooter />
    </article>
  );
}
