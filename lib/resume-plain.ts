import { range } from "@/lib/format";
import type { Resume } from "@/lib/resume-schema";

function normalizeUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `https://${url}`;
}

function line(value?: string) {
  return value?.trim() ? value.trim() : undefined;
}

export function resumeToPlainText(data: Resume): string {
  const sections: string[] = [];

  const profileUrls =
    data.basics.profiles
      ?.map((p) => normalizeUrl(p.url))
      .filter(Boolean)
      .join(" | ") ?? "";

  sections.push(
    [
      data.basics.name,
      data.basics.label,
      line(data.basics.email),
      line(data.basics.phone),
      normalizeUrl(data.basics.url),
      profileUrls || undefined,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  if (data.work?.length) {
    sections.push("EXPERIENCE");
    for (const work of data.work) {
      sections.push(
        [
          `${work.position || "Role"} | ${work.name || ""}`.trim(),
          line(range(work.startDate, work.endDate)),
          line(work.summary),
          ...(work.highlights?.map((h) => `- ${h}`) ?? []),
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }
  }

  if (data.projects?.length) {
    sections.push("PROJECTS");
    for (const project of data.projects) {
      const projectLine = [
        project.name,
        normalizeUrl(project.url),
        project.role ? `Role: ${project.role}` : undefined,
        project.status ? `Status: ${project.status}` : undefined,
      ]
        .filter(Boolean)
        .join(" | ");

      sections.push(projectLine);
      if (project.description) {
        sections.push(project.description);
      }

      for (const metric of project.impactMetrics ?? []) {
        const metricWindow = metric.window ? ` (${metric.window})` : "";
        sections.push(`- ${metric.label}: ${metric.value}${metricWindow}`);
      }

      for (const highlight of project.highlights ?? []) {
        sections.push(`- ${highlight}`);
      }
    }
  }

  if (data.skills?.length) {
    sections.push("SKILLS");
    sections.push(data.skills.join(", "));
  }

  if (data.education?.length) {
    sections.push("EDUCATION");
    for (const education of data.education) {
      sections.push(
        [
          education.institution,
          education.studyType,
          line(range(education.startDate, education.endDate)),
        ]
          .filter(Boolean)
          .join(" | "),
      );
    }
  }

  if (data.talks?.length) {
    sections.push("TALKS");
    for (const talk of data.talks) {
      sections.push(
        [talk.title, talk.organiser, normalizeUrl(talk.link)]
          .filter(Boolean)
          .join(" | "),
      );
    }
  }

  if (data.contributions?.length) {
    sections.push("OPEN SOURCE");
    for (const contribution of data.contributions) {
      sections.push(
        [contribution.title, normalizeUrl(contribution.url)]
          .filter(Boolean)
          .join(" | "),
      );
    }
  }

  return sections.filter(Boolean).join("\n\n");
}
