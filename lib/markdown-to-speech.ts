import removeMd from "remove-markdown";

/**
 * Converts markdown text to plain text suitable for text-to-speech.
 * Removes all markdown formatting while preserving readable content.
 *
 * @param markdown - The markdown text to convert
 * @returns Clean plain text suitable for TTS
 */
export function markdownToSpeech(markdown: string): string {
  if (!markdown) return "";

  // Remove markdown formatting
  let text = removeMd(markdown, {
    stripListLeaders: true, // Remove list markers (-, *, 1., etc.)
    gfm: true, // Support GitHub Flavored Markdown
    useImgAltText: false, // Don't include image alt text
  });

  // Additional cleanup for better TTS output
  text = text
    // Remove multiple newlines (keep paragraph breaks)
    .replace(/\n{3,}/g, "\n\n")
    // Remove excessive whitespace
    .replace(/[ \t]+/g, " ")
    // Clean up line breaks followed by spaces
    .replace(/\n\s+/g, "\n")
    // Remove standalone brackets and parentheses that might be left over
    .replace(/\s*[\[\]\(\)]\s*/g, " ")
    // Remove multiple spaces
    .replace(/\s{2,}/g, " ")
    // Clean up quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Trim each line
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ")
    // Final trim
    .trim();

  return text;
}
