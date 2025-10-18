"use client";

import { range } from "@/lib/format";
import type { Resume } from "@/lib/resume-schema";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useState, useEffect } from "react";
import { CertificateItem } from "./certificate-item";
import { ContributionItem } from "./contribution-item";
import { EducationItem } from "./education-item";
import { ResumeHeader } from "./header";
import { References } from "./references";
import { Section } from "./section";
import { Skills } from "./skills";
import { TalkItem } from "./talk-item";
import { WorkItem } from "./work-item";

const DEFAULT_ITEMS_TO_SHOW = 2;

export function ResumeView({ data }: { data: Resume }) {
  const [expandAll, setExpandAll] = useQueryState(
    "expand",
    parseAsBoolean.withDefault(false)
  );
  const [showAllWork, setShowAllWork] = useState(false);
  const [showAllContributions, setShowAllContributions] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllTalks, setShowAllTalks] = useState(false);

  useEffect(() => {
    if (expandAll) {
      setShowAllWork(true);
      setShowAllContributions(true);
      setShowAllProjects(true);
      setShowAllEducation(true);
      setShowAllCertificates(true);
      setShowAllTalks(true);
    } else {
      setShowAllWork(false);
      setShowAllContributions(false);
      setShowAllProjects(false);
      setShowAllEducation(false);
      setShowAllCertificates(false);
      setShowAllTalks(false);
    }
  }, [expandAll]);

  const createToggleHandler = (
    currentState: boolean,
    setState: (state: boolean) => void
  ) => {
    return () => {
      const newShowAll = !currentState;
      setState(newShowAll);
      if (!newShowAll) setExpandAll(false);
    };
  };

  return (
    <main className="pt-12 print:pt-0">
      <article className="space-y-6">
        <ResumeHeader basics={data.basics} />

        {!!data.work?.length && (
          <Section title="Experience">
            <div className="space-y-8">
              {(showAllWork
                ? data.work
                : data.work.slice(0, DEFAULT_ITEMS_TO_SHOW)
              ).map((w, i) => (
                <WorkItem key={i} item={w} />
              ))}
              {data.work.length > DEFAULT_ITEMS_TO_SHOW && !expandAll && (
                <button
                  type="button"
                  onClick={createToggleHandler(showAllWork, setShowAllWork)}
                  className="print:hidden text-sm cursor-pointer"
                  aria-expanded={showAllWork}
                  aria-label={
                    showAllWork
                      ? "Show less work experience"
                      : "Show more work experience"
                  }
                >
                  {showAllWork ? "show less" : "show more..."}
                </button>
              )}
            </div>
          </Section>
        )}

        {!!data.contributions?.length && (
          <Section title="Open Source Contributions">
            <div className="space-y-5">
              {(showAllContributions
                ? data.contributions
                : data.contributions.slice(0, DEFAULT_ITEMS_TO_SHOW)
              ).map((c, i) => (
                <ContributionItem key={i} item={c} />
              ))}
              {data.contributions.length > DEFAULT_ITEMS_TO_SHOW &&
                !expandAll && (
                  <button
                    type="button"
                    onClick={createToggleHandler(
                      showAllContributions,
                      setShowAllContributions
                    )}
                    className="print:hidden text-sm cursor-pointer"
                    aria-expanded={showAllContributions}
                    aria-label={
                      showAllContributions
                        ? "Show less contributions"
                        : "Show more contributions"
                    }
                  >
                    {showAllContributions ? "show less" : "show more..."}
                  </button>
                )}
            </div>
          </Section>
        )}

        {!!data.projects?.length && (
          <Section title="Projects">
            <div className="space-y-5">
              {(showAllProjects
                ? data.projects
                : data.projects.slice(0, DEFAULT_ITEMS_TO_SHOW)
              ).map((p, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <strong>{p.name}</strong>
                    <em className="text-sm">{range(p.startDate, p.endDate)}</em>
                  </div>
                  {p.url && (
                    <div>
                      <a href={p.url} target="_blank" rel="noreferrer">
                        {p.url.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {p.description && <p>{p.description}</p>}
                  {!!p.highlights?.length && (
                    <ul className="list-disc pl-5 space-y-1">
                      {p.highlights.map((h, j) => (
                        <li key={j} className="text-justify">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {data.projects.length > DEFAULT_ITEMS_TO_SHOW && !expandAll && (
                <button
                  type="button"
                  onClick={createToggleHandler(
                    showAllProjects,
                    setShowAllProjects
                  )}
                  className="print:hidden text-sm cursor-pointer"
                  aria-expanded={showAllProjects}
                  aria-label={
                    showAllProjects
                      ? "Show less projects"
                      : "Show more projects"
                  }
                >
                  {showAllProjects ? "show less" : "show more..."}
                </button>
              )}
            </div>
          </Section>
        )}

        {!!data.education?.length && (
          <Section title="Education">
            <div className="space-y-5">
              {(showAllEducation
                ? data.education
                : data.education.slice(0, DEFAULT_ITEMS_TO_SHOW)
              ).map((e, i) => (
                <EducationItem key={i} item={e} />
              ))}
              {data.education.length > DEFAULT_ITEMS_TO_SHOW && !expandAll && (
                <button
                  type="button"
                  onClick={createToggleHandler(
                    showAllEducation,
                    setShowAllEducation
                  )}
                  className="print:hidden text-sm cursor-pointer"
                  aria-expanded={showAllEducation}
                  aria-label={
                    showAllEducation
                      ? "Show less education"
                      : "Show more education"
                  }
                >
                  {showAllEducation ? "show less" : "show more..."}
                </button>
              )}
            </div>
          </Section>
        )}

        {!!data.certificates?.length && (
          <Section title="Certificates">
            <div className="space-y-5">
              {(showAllCertificates
                ? data.certificates
                : data.certificates.slice(0, DEFAULT_ITEMS_TO_SHOW)
              ).map((c, i) => (
                <CertificateItem key={i} item={c} />
              ))}
              {data.certificates.length > DEFAULT_ITEMS_TO_SHOW &&
                !expandAll && (
                  <button
                    type="button"
                    onClick={createToggleHandler(
                      showAllCertificates,
                      setShowAllCertificates
                    )}
                    className="print:hidden text-sm cursor-pointer"
                    aria-expanded={showAllCertificates}
                    aria-label={
                      showAllCertificates
                        ? "Show less certificates"
                        : "Show more certificates"
                    }
                  >
                    {showAllCertificates ? "show less" : "show more..."}
                  </button>
                )}
            </div>
          </Section>
        )}

        {!!data.talks?.length && (
          <Section title="Talks">
            <div className="space-y-5">
              {(showAllTalks
                ? data.talks
                : data.talks.slice(0, DEFAULT_ITEMS_TO_SHOW)
              ).map((t, i) => (
                <TalkItem key={i} item={t} />
              ))}
              {data.talks.length > DEFAULT_ITEMS_TO_SHOW && !expandAll && (
                <button
                  type="button"
                  onClick={createToggleHandler(showAllTalks, setShowAllTalks)}
                  className="print:hidden text-sm cursor-pointer"
                  aria-expanded={showAllTalks}
                  aria-label={
                    showAllTalks ? "Show less talks" : "Show more talks"
                  }
                >
                  {showAllTalks ? "show less" : "show more..."}
                </button>
              )}
            </div>
          </Section>
        )}

        {!!data.skills?.length && (
          <Section title="Skills">
            <Skills skills={data.skills} />
          </Section>
        )}

        {!!data.references?.length && (
          <Section title="References">
            <References items={data.references} />
          </Section>
        )}
      </article>
      <footer className="mt-8 pt-4 text-center text-sm print:hidden">
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
    </main>
  );
}
