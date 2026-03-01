import { tool } from "ai";
import { z } from "zod";
import { resume } from "@/lib/resume";
import Fuse from "fuse.js";

type TearchableItem = {
  id: string;
  section: string;
  title?: string;
  content: string;
};

const searchableData: TearchableItem[] = [
  ...resume.work.map((item) => ({
    id: `work-${item.name}`,
    section: "work",
    title: item.position,
    content: `${item.name} ${item.position} ${item.summary || ""} ${item.highlights?.join(" ") || ""}`,
  })),
  ...resume.projects.map((item) => ({
    id: `projects-${item.name}`,
    section: "projects",
    title: item.name,
    content: `${item.name} ${item.description || ""} ${item.highlights?.join(" ") || ""}`,
  })),
  ...resume.skills.map((skill) => ({
    id: `skills-${skill}`,
    section: "skills",
    title: skill,
    content: skill,
  })),
  ...resume.education.map((item) => ({
    id: `education-${item.institution}`,
    section: "education",
    title: item.institution,
    content: `${item.institution} ${item.studyType || ""}`,
  })),
  ...resume.talks.map((item) => ({
    id: `talks-${item.title}`,
    section: "talks",
    title: item.title,
    content: `${item.title} ${item.organiser || ""}`,
  })),
  ...resume.contributions.map((item) => ({
    id: `contributions-${item.title}`,
    section: "contributions",
    title: item.title,
    content: `${item.title} ${item.url || ""}`,
  })),
];

const resumeIndex = new Fuse(searchableData, {
  keys: [
    { name: "title", weight: 2 },
    { name: "content", weight: 1.5 },
    { name: "section", weight: 0.5 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
});

export const queryResumeTool = tool({
  description:
    "Query candidate Milind Kumar Mishra's resume. Returns relevant sections like work, skills, projects, education, talks, and contributions based on query.",
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

    if (queryLower === "all") {
      return {
        summary: "Full resume data",
        data: resume,
      };
    }

    const searchResults = resumeIndex.search(query);

    if (searchResults.length === 0) {
      return {
        summary: `No matches found for "${query}"`,
        data: {},
      };
    }

    const sectionsMatched = new Set<string>();

    for (const result of searchResults) {
      sectionsMatched.add(result.item.section);
    }

    for (const section of sectionsMatched) {
      if (section in resume) {
        results[section] = (resume as Record<string, unknown>)[section];
      }
    }

    if (
      queryLower.includes("name") ||
      queryLower.includes("contact") ||
      queryLower.includes("email") ||
      queryLower.includes("phone") ||
      queryLower.includes("location") ||
      sectionsMatched.has("basics")
    ) {
      results.basics = resume.basics;
    }

    let summary = `Found ${searchResults.length} matches for "${query}" across ${sectionsMatched.size} sections`;

    if ("work" in results && resume.work.length > 0) {
      const dates = resume.work
        .map((job) => new Date(job.startDate || ""))
        .filter((d) => !isNaN(d.getTime()));

      if (dates.length > 1) {
        const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
        const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
        const totalDays = Math.floor(
          (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24),
        );
        const years = Math.floor(totalDays / 365.25);
        summary += `. Milind has ${years}+ years of experience`;
      }
    }

    return {
      summary,
      data: results,
    };
  },
});
