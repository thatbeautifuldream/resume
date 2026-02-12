import { tool } from "ai";
import { z } from "zod";
import { resume } from "@/lib/resume";

export const queryResumeTool = tool({
  description:
    "Query candidate Milind Kumar Mishra's resume. Returns relevant sections like work, skills, projects, education, talks, and contributions based on the query.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Search query in natural language (e.g., 'React experience', 'overall experience', 'skills list', 'all projects', 'work at Merlin AI')",
      ),
  }),
  execute: async ({ query }) => {
    const queryLower = query.toLowerCase();
    const results: Record<string, unknown> = {};

    // Search basics
    if (
      queryLower.includes("name") ||
      queryLower.includes("contact") ||
      queryLower.includes("email") ||
      queryLower.includes("phone") ||
      queryLower.includes("location") ||
      queryLower === "all"
    ) {
      results.basics = resume.basics;
    }

    // Search work experience
    const workTerms = ["work", "experience", "job", "position", "company"];
    const workMatch = workTerms.some((term) => queryLower.includes(term));
    if (workMatch || queryLower === "all") {
      results.work = resume.work;
    }

    // Search skills
    const skillsTerms = ["skill", "tech", "stack", "technology", "skills"];
    const skillsMatch = skillsTerms.some((term) => queryLower.includes(term));
    if (skillsMatch || queryLower === "all") {
      results.skills = resume.skills;
    }

    // Search projects (both standalone and work highlights)
    const projectsTerms = [
      "project",
      "portfolio",
      "product",
      "built",
      "app",
      "platform",
    ];
    const projectsMatch = projectsTerms.some((term) =>
      queryLower.includes(term),
    );
    if (projectsMatch || queryLower === "all") {
      results.projects = resume.projects;
    }

    // Search education
    const educationTerms = [
      "education",
      "university",
      "degree",
      "study",
      "college",
    ];
    const educationMatch = educationTerms.some((term) =>
      queryLower.includes(term),
    );
    if (educationMatch || queryLower === "all") {
      results.education = resume.education;
    }

    // Search talks
    const talksTerms = ["talk", "presentation", "meetup", "speak"];
    const talksMatch = talksTerms.some((term) => queryLower.includes(term));
    if (talksMatch || queryLower === "all") {
      results.talks = resume.talks;
    }

    // Search contributions
    const contributionsTerms = [
      "contribution",
      "open source",
      "github",
      "pr",
      "pull request",
    ];
    const contributionsMatch = contributionsTerms.some((term) =>
      queryLower.includes(term),
    );
    if (contributionsMatch || queryLower === "all") {
      results.contributions = resume.contributions;
    }

    // Calculate experience summary if work was returned
    let summary = `Found matching information for: ${query}`;
    if (results.work && resume.work.length > 0) {
      const dates = resume.work.map((job) => new Date(job.startDate || ""));
      const hasDates = dates.filter((d) => !isNaN(d.getTime()));
      if (hasDates.length > 1) {
        const earliest = new Date(
          Math.min(...hasDates.map((d) => d.getTime())),
        );
        const latest = new Date(Math.max(...hasDates.map((d) => d.getTime())));
        const totalDays = Math.floor(
          (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24),
        );
        const years = Math.floor(totalDays / 365.25);
        summary = `Milind has ${years}+ years of experience`;
      }
    }

    return {
      summary,
      data: results,
    };
  },
});
