import type { Resume } from "@/lib/resume-schema";
import { range } from "@/lib/format";
import { ResumeHeader } from "./header";
import { Section } from "./section";
import { WorkItem } from "./work-item";
import { EducationItem } from "./education-item";
import { CertificateItem } from "./certificate-item";
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
              <div>
                {data.work.map((w, i) => (
                  <div key={i} className="mb-8">
                    <WorkItem item={w} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {!!data.projects?.length && (
            <Section title="Projects">
              <div>
                {data.projects.map((p, i) => (
                  <div key={i} className="mb-5">
                    <div className="flex justify-between items-baseline">
                      <strong>{p.name}</strong>
                      <em>{range(p.startDate, p.endDate)}</em>
                    </div>
                    {p.url && (
                      <div className="mb-2">
                        <a href={p.url} target="_blank" rel="noreferrer">
                          {p.url.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    {p.description && <p className="mb-2">{p.description}</p>}
                    {!!p.highlights?.length && (
                      <ul className="list-disc pl-5 space-y-1 mt-2">
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
              <div>
                {data.education.map((e, i) => (
                  <div key={i} className="mb-5">
                    <EducationItem item={e} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {!!data.certificates?.length && (
            <Section title="Certificates">
              <div>
                {data.certificates.map((c, i) => (
                  <div key={i} className="mb-5">
                    <CertificateItem item={c} />
                  </div>
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
