import type { Resume } from "../resume-schema";

export function resumeToMarkdown(resume: Resume): string {
  const sections: string[] = [];

  sections.push(`# ${resume.basics.name} - ${resume.basics.label}`);

  const contact = [
    `📧 ${resume.basics.email}`,
    `📱 ${resume.basics.phone}`,
    `🌐 ${resume.basics.url}`,
    `📍 ${resume.basics.location?.city || "Unknown"}, ${
      resume.basics.location?.countryCode || "Unknown"
    }`,
  ];
  sections.push(contact.join(" | "));

  if (resume.basics.summary) {
    sections.push(`\n## Summary\n${resume.basics.summary}`);
  }

  if (resume.basics.profiles?.length) {
    sections.push("\n## Profiles");
    resume.basics.profiles.forEach((profile) => {
      sections.push(
        `- **${profile.network}**: [${profile.username}](${profile.url})`
      );
    });
  }

  if (resume.work?.length) {
    sections.push("\n## Experience");
    resume.work.forEach((job) => {
      const startDate = job.startDate ? formatDate(job.startDate) : "Unknown";
      const endDate = job.endDate ? formatDate(job.endDate) : "Present";
      const dateRange = `${startDate} - ${endDate}`;

      sections.push(`\n**${job.name}** (${dateRange}) - ${job.position}`);
      if (job.location) sections.push(`*${job.location}*`);
      if (job.summary) sections.push(`\n${job.summary}`);

      if (job.highlights?.length) {
        job.highlights.forEach((highlight) => {
          sections.push(`- ${highlight}`);
        });
      }
    });
  }

  if (resume.education?.length) {
    sections.push("\n## Education");
    resume.education.forEach((edu) => {
      const startDate = edu.startDate ? formatDate(edu.startDate) : "Unknown";
      const endDate = edu.endDate ? formatDate(edu.endDate) : "Unknown";
      const dateRange = `${startDate} - ${endDate}`;
      sections.push(`\n**${edu.institution}** (${dateRange})`);
      sections.push(`${edu.studyType}`);
    });
  }

  if (resume.skills?.length) {
    sections.push("\n## Skills");
    sections.push(resume.skills.join(" • "));
  }

  if (resume.projects?.length) {
    sections.push("\n## Projects");
    resume.projects.forEach((project) => {
      sections.push(`\n**${project.name}** - [Link](${project.url})`);
      sections.push(project?.description ?? "");

      if (project.highlights?.length) {
        project.highlights.forEach((highlight) => {
          sections.push(`- ${highlight}`);
        });
      }

      if (project.keywords?.length) {
        sections.push(`*Tech: ${project.keywords.join(", ")}*`);
      }
    });
  }

  if (resume.talks?.length) {
    sections.push("\n## Speaking");
    resume.talks.forEach((talk) => {
      sections.push(`\n**${talk.title}** - ${talk.organiser}`);
      if (talk.link) sections.push(`[Event Link](${talk.link})`);
    });
  }

  if (resume.contributions?.length) {
    sections.push("\n## Open Source");
    resume.contributions.forEach((contrib) => {
      const extractOrgAndRepo = (url: string) => {
        try {
          const parsedUrl = new URL(url);
          const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
          if (pathParts.length >= 2) {
            return `${pathParts[0]}/${pathParts[1]}`;
          }
          return "";
        } catch {
          return "";
        }
      };
      const orgAndRepo = extractOrgAndRepo(contrib.url);
      sections.push(
        `- [${contrib.title}](${contrib.url})${orgAndRepo ? ` [${orgAndRepo}]` : ""}`
      );
    });
  }

  if (resume.certificates?.length) {
    sections.push("\n## Certifications");
    resume.certificates.forEach((cert) => {
      sections.push(
        `- **${cert.name}** by ${cert.issuer} - [Verify](${cert.url})`
      );
    });
  }

  return sections.join("\n");
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}
