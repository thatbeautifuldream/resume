"use client";

import {
  calculateDuration,
  formatDate,
  range,
  rangeCompact,
} from "@/lib/format";
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
import { useState, useEffect } from "react";
import type * as React from "react";
import {
  useSidebarOpen,
  useSidebarActions,
} from "@/components/providers/chat-sidebar-store";
import {
  registerJsonToggleHandler,
  unregisterJsonToggleHandler,
} from "@/components/providers/keyboard-shortcuts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-1.5 sm:space-y-2">
      <h4 className="uppercase font-semibold border-b text-sm sm:text-base">{title}</h4>
      <div>{children}</div>
    </section>
  );
}

function ResumeFooter({ source }: { source: string }) {
  const sourceLink = source.startsWith("http") ? source : `https://${source}`;
  return (
    <footer className="mt-6 sm:mt-8 pt-3 sm:pt-4 text-center text-xs md:text-sm print:hidden">
      <p className="text-muted-foreground">
        Source :{" "}
        <a href={sourceLink} target="_blank" rel="noopener noreferrer">
          {source}
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
  const rawHref = profile.url || "#";
  const href =
    rawHref !== "#"
      ? rawHref.startsWith("http")
        ? rawHref
        : `https://${rawHref}`
      : "#";

  return href !== "#" ? (
    <Link href={href} target="_blank" rel="noreferrer">
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
}

function ResumeHeaderItem({ basics }: { basics: Basics }) {
  const contactItems: { key: string; element: React.ReactNode }[] = [];

  if (basics.email) {
    contactItems.push({
      key: "email",
      element: (
        <a href={`mailto:${basics.email}`} className="hover:underline">
          {basics.email}
        </a>
      ),
    });
  }

  if (basics.url) {
    const urlHref = basics.url.startsWith("http")
      ? basics.url
      : `https://${basics.url}`;
    contactItems.push({
      key: "url",
      element: (
        <Link href={urlHref} target="_blank" rel="noreferrer">
          {basics.url}
        </Link>
      ),
    });
  }

  if (basics.profiles) {
    basics.profiles.forEach((p) => {
      contactItems.push({
        key: p.network || p.url || "",
        element: <ProfileLinkWithNetwork profile={p} />,
      });
    });
  }

  return (
    <header className="text-center space-y-1.5 sm:space-y-2">
      <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl uppercase">
        {basics.name}
      </h1>

      <div className="text-sm md:text-base flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-1">
        {contactItems.map((item) => (
          <div key={item.key}>{item.element}</div>
        ))}
      </div>
    </header>
  );
}

function WorkExperienceItem({ item }: { item: Work }) {
  const duration = calculateDuration(item.startDate, item.endDate);
  const isPresent = !item.endDate;
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="space-y-0.5 sm:space-y-1">
        <div className="flex gap-2 sm:gap-3 items-start print:gap-2 print:items-center">
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
                  {duration && (
                    <span className={isPresent ? "print:hidden" : ""}>
                      {` (${duration})`}
                    </span>
                  )}
                </span>
                <span className="hidden sm:inline">
                  {range(item.startDate, item.endDate)}
                  {duration && (
                    <span className={isPresent ? "print:hidden" : ""}>
                      {` (${duration})`}
                    </span>
                  )}
                </span>
              </em>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        {item.summary && <p className="text-sm md:text-base">{item.summary}</p>}
        {!!item.highlights?.length && (
          <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-sm md:text-base">
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
  const urlHref = item.url
    ? item.url.startsWith("http")
      ? item.url
      : `https://${item.url}`
    : undefined;

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="space-y-0.5 sm:space-y-1">
        <div className="flex gap-2 sm:gap-3 items-start print:gap-2 print:items-center">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between sm:flex-row flex-col sm:items-baseline items-start print:flex-row print:items-baseline">
              {urlHref ? (
                <a
                  href={urlHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm md:text-base print:text-sm font-bold hover:underline"
                >
                  {item.name}
                </a>
              ) : (
                <strong className="text-sm md:text-base print:text-sm">
                  {item.name}
                </strong>
              )}
              <em className="sm:mt-0 mt-0.5 text-xs md:text-sm print:text-xs print:mt-0">
                {dateDisplay}
              </em>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        {item.description && (
          <p className="text-sm md:text-base">{item.description}</p>
        )}
        {!!item.highlights?.length && (
          <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-sm md:text-base">
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
  const dateDisplay = item.endDate
    ? formatDate(item.endDate)
    : range(item.startDate, item.endDate);
  const urlHref = item.url
    ? item.url.startsWith("http")
      ? item.url
      : `https://${item.url}`
    : undefined;

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex-1 min-w-0 truncate text-sm md:text-base print:text-sm leading-tight">
        {urlHref ? (
          <a
            href={urlHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            {item.institution}
          </a>
        ) : (
          <strong>{item.institution}</strong>
        )}
        {item.studyType && <span className="italic"> - {item.studyType}</span>}
      </div>
      <em className="text-xs md:text-sm print:text-xs whitespace-nowrap flex-shrink-0">
        {dateDisplay}
      </em>
    </div>
  );
}

function CertificateAchievementItem({ item }: { item: Certificates }) {
  const urlHref = item.url
    ? item.url.startsWith("http")
      ? item.url
      : `https://${item.url}`
    : undefined;

  return (
    <span className="inline-flex items-baseline gap-1 text-sm md:text-base">
      {urlHref ? (
        <a
          href={urlHref}
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
      const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
      const parsedUrl = new URL(urlWithProtocol);
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

  const href = item.url.startsWith("http") ? item.url : `https://${item.url}`;

  return (
    <div className="flex justify-between items-center gap-2">
      <a
        href={href}
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
  const href = item.link
    ? item.link.startsWith("http")
      ? item.link
      : `https://${item.link}`
    : undefined;

  return (
    <div className="flex justify-between items-center gap-2">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm md:text-base hover:underline flex-1 leading-tight truncate"
        >
          {item.title}
        </a>
      ) : (
        <span className="text-sm md:text-base flex-1 leading-tight truncate">
          {item.title}
        </span>
      )}
      {item.organiser && (
        <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">
          [{item.organiser}]
        </span>
      )}
    </div>
  );
}

function SkillsProficiency({ skills }: { skills: Skill[] }) {
  const { sendPromptToChat } = useSidebarActions();

  if (!skills?.length) return null;

  return (
    <div className="flex flex-wrap gap-x-3 text-sm md:text-base font-semibold">
      {skills.map((skill) => (
        <button
          key={skill}
          onClick={() => {
            const prompt = `Tell me about ${skill} - what is it, and how has Milind used this skill in his work? How proficient is he with ${skill}?`;
            sendPromptToChat(prompt);
          }}
          className="hover:underline cursor-pointer"
        >
          {skill}
        </button>
      ))}
    </div>
  );
}

function ReferenceTestimonial({ items }: { items: Reference[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((r) => (
        <blockquote
          key={r.name}
          className="italic border-l-4 border-border pl-3 sm:pl-4 space-y-1.5 sm:space-y-2 text-sm md:text-base"
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
  "basics",
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
      <div className="space-y-5 sm:space-y-8">
        {items.map((w) => (
          <WorkExperienceItem key={w.name} item={w} />
        ))}
      </div>
    ),
  },
  projects: {
    title: "Projects",
    render: (items: Project[]) => (
      <div className="space-y-5 sm:space-y-8">
        {items.map((p) => (
          <ProjectPortfolioItem key={p.name} item={p} />
        ))}
      </div>
    ),
  },
  education: {
    title: "Education",
    render: (items: Education[]) => (
      <div className="space-y-2 sm:space-y-3">
        {items.map((e) => (
          <EducationCredentialItem key={e.institution} item={e} />
        ))}
      </div>
    ),
  },
  talks: {
    title: "Talks",
    render: (items: Talks[]) => (
      <div className="space-y-1.5 sm:space-y-2">
        {items.map((t) => (
          <TalkPresentationItem key={t.title} item={t} />
        ))}
      </div>
    ),
  },
  contributions: {
    title: "Open Source Contributions",
    render: (items: Contribution[]) => (
      <div className="space-y-1.5 sm:space-y-2">
        {items.map((c) => (
          <OpenSourceContributionItem key={c.url} item={c} />
        ))}
      </div>
    ),
  },
  certificates: {
    title: "Certificates",
    render: (items: Certificates[]) => (
      <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 items-baseline">
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
  const [showJson, setShowJson] = useState(false);
  const isOpen = useSidebarOpen();
  const { close } = useSidebarActions();
  const { resolvedTheme } = useTheme();

  // Register JSON toggle handler for centralized keyboard shortcuts
  useEffect(() => {
    registerJsonToggleHandler(() => setShowJson((prev) => !prev));
    return () => unregisterJsonToggleHandler();
  }, []);

  // Handle print from any source (browser menu, Ctrl+P, etc.)
  useEffect(() => {
    const handleBeforePrint = () => {
      if (isOpen) {
        close();
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, [isOpen, close]);

  if (showJson) {
    const jsonString = JSON.stringify(data, null, 2);
    const isDark = resolvedTheme === "dark";
    const syntaxTheme = isDark ? vscDarkPlus : vs;

    return (
      <article className="py-3 sm:py-4 md:py-8">
        <SyntaxHighlighter
          language="json"
          style={syntaxTheme}
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            maxHeight: "calc(100vh - 8rem)",
            fontSize: "0.75rem",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            lineHeight: "1.6",
            padding: "0.75rem",
          }}
          codeTagProps={{
            style: {
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "inherit",
            },
          }}
          className="md:text-sm border border-border shadow-sm md:!p-6"
        >
          {jsonString}
        </SyntaxHighlighter>
      </article>
    );
  }

  return (
    <article className="space-y-4 sm:space-y-6 py-3 sm:py-4 md:py-8">
      <ResumeHeaderItem basics={data.basics} />

      {RESUME_SECTION_ORDER.map((sectionKey) => {
        const section = SECTION_CONFIG[sectionKey];
        const sectionData = data[sectionKey];

        if (!section) return null;
        if (!sectionData || (Array.isArray(sectionData) && !sectionData.length))
          return null;

        return (
          <ResumeSection key={sectionKey} title={section.title}>
            {section.render(sectionData)}
          </ResumeSection>
        );
      })}

      <ResumeFooter source={data.source} />
    </article>
  );
}
