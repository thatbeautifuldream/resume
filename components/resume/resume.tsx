"use client";

import type { Resume } from "@/lib/resume-schema";
import { CertificateItem } from "./certificate-item";
import { ContributionItem } from "./contribution-item";
import { EducationItem } from "./education-item";
import { ResumeHeader } from "./header";
import { ProjectItem } from "./project-item";
import { References } from "./references";
import { Section } from "./section";
import { Skills } from "./skills";
import { TalkItem } from "./talk-item";
import { WorkItem } from "./work-item";

export function ResumeView({ data }: { data: Resume }) {
  return (
    <article className="space-y-6 py-4 md:py-8">
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

      {!!data.contributions?.length && (
        <Section title="Open Source Contributions">
          <div className="space-y-5">
            {data.contributions.map((c, i) => (
              <ContributionItem key={i} item={c} />
            ))}
          </div>
        </Section>
      )}

      {!!data.projects?.length && (
        <Section title="Projects">
          <div className="space-y-8">
            {data.projects.map((p, i) => (
              <ProjectItem key={i} item={p} />
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
    </article>
  );
}
