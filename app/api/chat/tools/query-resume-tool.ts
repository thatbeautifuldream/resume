import { tool } from "ai";
import { z } from "zod";
import Fuse from "fuse.js";
import { resume } from "@/lib/resume";

type SectionKey =
  | "basics"
  | "work"
  | "projects"
  | "skills"
  | "education"
  | "talks"
  | "contributions";

type SectionValueMap = {
  basics: typeof resume.basics;
  work: (typeof resume.work)[number];
  projects: (typeof resume.projects)[number];
  skills: string;
  education: (typeof resume.education)[number];
  talks: (typeof resume.talks)[number];
  contributions: (typeof resume.contributions)[number];
};

type QueryResultData = {
  basics?: typeof resume.basics;
  work?: (typeof resume.work)[number][];
  projects?: (typeof resume.projects)[number][];
  skills?: string[];
  education?: (typeof resume.education)[number][];
  talks?: (typeof resume.talks)[number][];
  contributions?: (typeof resume.contributions)[number][];
};

type SearchableItem = {
  id: string;
  section: SectionKey;
  title?: string;
  content: string;
  value: SectionValueMap[SectionKey];
  aliases?: string[];
};

const SECTION_ALIASES: Record<SectionKey, string[]> = {
  basics: ["contact", "email", "phone", "location", "profile"],
  work: ["experience", "employment", "career", "job"],
  projects: ["project", "portfolio", "build", "product", "side project"],
  skills: ["tech stack", "stack", "tools", "technologies"],
  education: ["university", "college", "degree", "study"],
  talks: ["speaking", "meetup", "presentation"],
  contributions: ["open source", "oss", "pull request", "contribution"],
};

const searchableData: SearchableItem[] = [
  {
    id: "basics-profile",
    section: "basics",
    title: resume.basics.name,
    content: `${resume.basics.name} ${resume.basics.label || ""} ${resume.basics.email || ""} ${resume.basics.location?.city || ""}`,
    value: resume.basics,
    aliases: SECTION_ALIASES.basics,
  },
  ...resume.work.map((item) => ({
    id: `work-${item.name}-${item.position}`,
    section: "work" as const,
    title: item.position,
    content: `${item.name} ${item.position} ${item.summary || ""} ${item.highlights?.join(" ") || ""}`,
    value: item,
    aliases: SECTION_ALIASES.work,
  })),
  ...resume.projects.map((item) => ({
    id: `projects-${item.name}`,
    section: "projects" as const,
    title: item.name,
    content: `${item.name} ${item.description || ""} ${item.highlights?.join(" ") || ""} ${item.keywords?.join(" ") || ""} ${item.proofLinks?.map((link) => link.label).join(" ") || ""}`,
    value: item,
    aliases: SECTION_ALIASES.projects,
  })),
  ...resume.skills.map((skill) => ({
    id: `skills-${skill}`,
    section: "skills" as const,
    title: skill,
    content: skill,
    value: skill,
    aliases: SECTION_ALIASES.skills,
  })),
  ...resume.education.map((item) => ({
    id: `education-${item.institution}`,
    section: "education" as const,
    title: item.institution,
    content: `${item.institution} ${item.studyType || ""}`,
    value: item,
    aliases: SECTION_ALIASES.education,
  })),
  ...resume.talks.map((item) => ({
    id: `talks-${item.title}`,
    section: "talks" as const,
    title: item.title,
    content: `${item.title} ${item.organiser || ""}`,
    value: item,
    aliases: SECTION_ALIASES.talks,
  })),
  ...resume.contributions.map((item) => ({
    id: `contributions-${item.title}`,
    section: "contributions" as const,
    title: item.title,
    content: `${item.title} ${item.url || ""}`,
    value: item,
    aliases: SECTION_ALIASES.contributions,
  })),
];

const resumeIndex = new Fuse(searchableData, {
  keys: [
    { name: "title", weight: 2.5 },
    { name: "content", weight: 1.8 },
    { name: "aliases", weight: 0.8 },
    { name: "section", weight: 0.5 },
  ],
  threshold: 0.36,
  minMatchCharLength: 2,
  includeScore: true,
});

const TOP_MATCH_LIMIT = 10;
const PER_SECTION_LIMIT = 3;

function toMonthIndex(date?: string) {
  if (!date) return undefined;
  const [yearRaw, monthRaw] = date.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw || "1");
  if (Number.isNaN(year) || Number.isNaN(month)) return undefined;
  return year * 12 + (month - 1);
}

function calculateExperienceText() {
  const now = new Date();
  const currentMonthIndex = now.getFullYear() * 12 + now.getMonth();
  const intervals = resume.work
    .map((job) => {
      const start = toMonthIndex(job.startDate);
      const end = job.endDate ? toMonthIndex(job.endDate) : currentMonthIndex;
      if (start === undefined || end === undefined || end < start)
        return undefined;
      return { start, end };
    })
    .filter((item): item is { start: number; end: number } => Boolean(item))
    .sort((a, b) => a.start - b.start);

  if (!intervals.length) return undefined;

  const merged: { start: number; end: number }[] = [];
  for (const interval of intervals) {
    const last = merged[merged.length - 1];
    if (!last || interval.start > last.end + 1) {
      merged.push({ ...interval });
      continue;
    }
    last.end = Math.max(last.end, interval.end);
  }

  const totalMonths = merged.reduce(
    (sum, interval) => sum + (interval.end - interval.start + 1),
    0,
  );
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months}m`;
  }

  if (months === 0) {
    return `${years}y`;
  }

  return `${years}y ${months}m`;
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

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
    const queryLower = normalizeQuery(query);
    const results: QueryResultData = {};
    const sectionsMatched = new Set<SectionKey>();

    if (queryLower === "all") {
      return {
        summary: "Full resume data",
        data: resume,
      };
    }

    if (queryLower.includes("all project") || queryLower === "projects") {
      results.projects = resume.projects;
      sectionsMatched.add("projects");
    }

    if (queryLower.includes("open source") || queryLower.includes("oss")) {
      results.contributions = resume.contributions;
      sectionsMatched.add("contributions");
    }

    if (queryLower.includes("talk")) {
      results.talks = resume.talks;
      sectionsMatched.add("talks");
    }

    if (
      queryLower.includes("contact") ||
      queryLower.includes("email") ||
      queryLower.includes("phone") ||
      queryLower.includes("location") ||
      queryLower.includes("profile")
    ) {
      results.basics = resume.basics;
      sectionsMatched.add("basics");
    }

    const searchResults = resumeIndex.search(query).slice(0, TOP_MATCH_LIMIT);

    const groupedMatches = new Map<SectionKey, SectionValueMap[SectionKey][]>();
    for (const result of searchResults) {
      const list = groupedMatches.get(result.item.section) ?? [];
      if (list.length >= PER_SECTION_LIMIT) continue;
      list.push(result.item.value);
      groupedMatches.set(result.item.section, list);
      sectionsMatched.add(result.item.section);
    }

    for (const [section, values] of groupedMatches.entries()) {
      if (section === "basics") {
        results.basics = resume.basics;
        continue;
      }

      if (section === "skills") {
        const mergedSkills = new Set<string>(
          (results.skills ?? []).concat(values as string[]),
        );
        results.skills = Array.from(mergedSkills);
        continue;
      }

      switch (section) {
        case "work":
          results.work = values as QueryResultData["work"];
          break;
        case "projects":
          results.projects = values as QueryResultData["projects"];
          break;
        case "education":
          results.education = values as QueryResultData["education"];
          break;
        case "talks":
          results.talks = values as QueryResultData["talks"];
          break;
        case "contributions":
          results.contributions = values as QueryResultData["contributions"];
          break;
        default:
          break;
      }
    }

    if (sectionsMatched.size === 0) {
      return {
        summary: `No matches found for "${query}"`,
        data: {},
      };
    }

    const sectionList = Array.from(sectionsMatched).join(", ");
    let summary = `Found ${searchResults.length} matches for "${query}" across: ${sectionList}`;

    if (sectionsMatched.has("work") || queryLower.includes("experience")) {
      const experience = calculateExperienceText();
      if (experience) {
        summary += `. Total professional experience: ${experience}`;
      }
    }

    return {
      summary,
      data: results,
    };
  },
});
