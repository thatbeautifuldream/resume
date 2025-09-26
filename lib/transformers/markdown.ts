import type { Resume } from "../resume-schema";

export function resumeToMarkdown(resume: Resume): string {
  const sections: string[] = [];

  // Header
  sections.push(`# ${resume.basics.name} - ${resume.basics.label}`);

  // Contact info
  const contact = [
    `📧 ${resume.basics.email}`,
    `📱 ${resume.basics.phone}`,
    `🌐 ${resume.basics.url}`,
    `📍 ${resume.basics.location?.city || "Unknown"}, ${
      resume.basics.location?.countryCode || "Unknown"
    }`,
  ];
  sections.push(contact.join(" | "));

  // Summary
  if (resume.basics.summary) {
    sections.push(`\n## Summary\n${resume.basics.summary}`);
  }

  // Profiles
  if (resume.basics.profiles?.length) {
    sections.push("\n## Profiles");
    resume.basics.profiles.forEach((profile) => {
      sections.push(
        `- **${profile.network}**: [${profile.username}](${profile.url})`
      );
    });
  }

  // Work Experience
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

  // Education
  if (resume.education?.length) {
    sections.push("\n## Education");
    resume.education.forEach((edu) => {
      const startDate = edu.startDate ? formatDate(edu.startDate) : "Unknown";
      const endDate = edu.endDate ? formatDate(edu.endDate) : "Unknown";
      const dateRange = `${startDate} - ${endDate}`;
      sections.push(`\n**${edu.institution}** (${dateRange})`);
      sections.push(`${edu.studyType} in ${edu.area}`);
    });
  }

  // Skills
  if (resume.skills?.length) {
    sections.push("\n## Skills");
    resume.skills.forEach((skill) => {
      sections.push(`\n**${skill.name}** (${skill.level})`);
      if (skill.keywords?.length) {
        sections.push(skill.keywords.join(" • "));
      }
    });
  }

  // Projects
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

  // Talks
  if (resume.talks?.length) {
    sections.push("\n## Speaking");
    resume.talks.forEach((talk) => {
      const talkDate = talk.date ? formatDate(talk.date) : "Unknown";
      sections.push(`\n**${talk.title}** - ${talk.event} (${talkDate})`);
      if (talk.summary) sections.push(talk.summary);
      if (talk.url) sections.push(`[Event Link](${talk.url})`);
    });
  }

  // Contributions
  if (resume.contributions?.length) {
    sections.push("\n## Open Source");
    resume.contributions.forEach((contrib) => {
      sections.push(
        `\n**${contrib.organisation}** - [${contrib.repository}](${contrib.repository})`
      );
      contrib.prs?.forEach((pr) => {
        sections.push(`- [${pr.title}](${pr.url})`);
      });
    });
  }

  // Certificates
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
