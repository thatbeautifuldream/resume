import { resume } from "../resume";
import { resumeToMarkdown } from "./markdown";
import { resumeToJsonLd } from "./json-ld";
import type { PersonJsonLd } from "./json-ld";

export { resumeToMarkdown, resumeToJsonLd };
export type { PersonJsonLd };

// Utility functions that always use lib/resume.ts as source of truth
export function getResumeAsMarkdown(): string {
  return resumeToMarkdown(resume);
}

export function getResumeAsJsonLd(): PersonJsonLd {
  return resumeToJsonLd(resume);
}

// Get token count estimates (rough calculation)
export function getTokenEstimates() {
  const markdown = getResumeAsMarkdown();
  const jsonLd = JSON.stringify(getResumeAsJsonLd(), null, 2);
  const original = JSON.stringify(resume, null, 2);

  // Rough token estimation: ~4 characters per token
  return {
    original: Math.ceil(original.length / 4),
    markdown: Math.ceil(markdown.length / 4),
    jsonLd: Math.ceil(jsonLd.length / 4),
    markdownSavings: Math.round(((original.length - markdown.length) / original.length) * 100),
    jsonLdSavings: Math.round(((original.length - jsonLd.length) / original.length) * 100)
  };
}

// Export formats for easy consumption
export function exportFormats() {
  return {
    markdown: getResumeAsMarkdown(),
    jsonLd: getResumeAsJsonLd(),
    estimates: getTokenEstimates()
  };
}