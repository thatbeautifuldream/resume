"use client";

import { range } from "@/lib/format";
import type { Resume } from "@/lib/resume-schema";
import { CertificateItem } from "./certificate-item";
import { ContributionItem } from "./contribution-item";
import { EducationItem } from "./education-item";
import { ResumeHeader } from "./header";
import { References } from "./references";
import { Section } from "./section";
import { Skills } from "./skills";
import { TalkItem } from "./talk-item";
import { WorkItem } from "./work-item";
import Link from "next/link";
import { useState } from "react";

const DEFAULT_ITEMS_TO_SHOW = 2;

export function ResumeView({ data }: { data: Resume }) {
  const [showAllWork, setShowAllWork] = useState(false);
  const [showAllContributions, setShowAllContributions] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllTalks, setShowAllTalks] = useState(false);

  return (
    <main className="select-none">
      <header className="mb-8 pb-4 text-center text-sm print:hidden">
        <div>
          <span className="hidden md:inline">
            <strong>[NEW]</strong> Try the interactive resume chat - ask
            questions about my experience, skills, and projects!{" "}
            <Link href="/chat">Chat with Resume</Link>
          </span>
          <span className="md:hidden">
            <strong>[NEW]</strong> Try the interactive resume chat!{" "}
            <Link href="/chat">Chat with Resume</Link>
          </span>
        </div>
      </header>
      <article>
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
              {data.work.length > DEFAULT_ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllWork(!showAllWork)}
                  className="print:hidden text-sm cursor-pointer"
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
              {data.contributions.length > DEFAULT_ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllContributions(!showAllContributions)}
                  className="print:hidden text-sm cursor-pointer"
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
                    <em>{range(p.startDate, p.endDate)}</em>
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
              {data.projects.length > DEFAULT_ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="print:hidden text-sm cursor-pointer"
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
              {data.education.length > DEFAULT_ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllEducation(!showAllEducation)}
                  className="print:hidden text-sm cursor-pointer"
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
              {data.certificates.length > DEFAULT_ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllCertificates(!showAllCertificates)}
                  className="print:hidden text-sm cursor-pointer"
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
              {data.talks.length > DEFAULT_ITEMS_TO_SHOW && (
                <button
                  onClick={() => setShowAllTalks(!showAllTalks)}
                  className="print:hidden text-sm cursor-pointer"
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
          This resume is open sourced at{" "}
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
