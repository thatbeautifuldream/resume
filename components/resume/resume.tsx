import type { Resume } from "@/lib/resume-schema";
import { range } from "@/lib/format";
import { ResumeHeader } from "./header";
import { Section } from "./section";
import { WorkItem } from "./work-item";
import { EducationItem } from "./education-item";
import { CertificateItem } from "./certificate-item";
import { TalkItem } from "./talk-item";
import { Skills } from "./skills";
import { References } from "./references";
import { DarkModeToggle } from "../dark-mode-toggle";

export function ResumeView({ data }: { data: Resume }) {
  return (
    <>
      <DarkModeToggle />
      <main>
        <article>
          <ResumeHeader basics={data.basics} />

          {!!data.work?.length && (
            <Section title="Experience">
              <div className="space-y-8">
                {data.work.map((w, i) => (
                  <WorkItem key={i} item={w} />
                ))}
              </div>
            </Section>
          )}

          {!!data.projects?.length && (
            <Section title="Projects">
              <div className="space-y-5">
                {data.projects.map((p, i) => (
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
              </div>
            </Section>
          )}

          {!!data.education?.length && (
            <Section title="Education">
              <div className="space-y-5">
                {data.education.map((e, i) => (
                  <EducationItem key={i} item={e} />
                ))}
              </div>
            </Section>
          )}

          {!!data.certificates?.length && (
            <Section title="Certificates">
              <div className="space-y-5">
                {data.certificates.map((c, i) => (
                  <CertificateItem key={i} item={c} />
                ))}
              </div>
            </Section>
          )}

          {!!data.talks?.length && (
            <Section title="Talks">
              <div className="space-y-5">
                {data.talks.map((t, i) => (
                  <TalkItem key={i} item={t} />
                ))}
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
      </main>
    </>
  );
}
