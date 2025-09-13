import { resume } from "@/lib/data";
import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const maxDuration = 30;

/**
 * Creates a privacy-safe version of the resume by redacting sensitive PII fields
 * and preserving only professional information needed for chat responses.
 * 
 * Redacted fields: email, phone, street address, postal code
 * Preserved fields: skills, experience, education, projects, certifications
 */
function createRedactedResume(fullResume: typeof resume) {
  return {
    basics: {
      name: fullResume.basics.name,
      label: fullResume.basics.label,
      email: "[REDACTED]",
      phone: "[REDACTED]",
      url: fullResume.basics.url,
      summary: fullResume.basics.summary,
      location: {
        address: "[REDACTED]",
        postalCode: "[REDACTED]",
        city: fullResume.basics.location?.city,
        countryCode: fullResume.basics.location?.countryCode,
        region: fullResume.basics.location?.region,
      },
      profiles: fullResume.basics.profiles,
    },
    work: fullResume.work,
    education: fullResume.education,
    certificates: fullResume.certificates,
    skills: fullResume.skills,
    projects: fullResume.projects,
    talks: fullResume.talks,
    references: fullResume.references,
    contributions: fullResume.contributions,
    volunteer: fullResume.volunteer,
    awards: fullResume.awards,
    languages: fullResume.languages,
  };
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const redactedResume = createRedactedResume(resume);
  const resumeText = JSON.stringify(redactedResume, null, 2);

  const system = `You are an expert assistant tasked with helping potential employers by answering questions strictly based on the candidate's resume. Use the resume information below to provide concise, clear, and relevant answers about the candidate's skills, experience, education, projects, and background.

Resume Information:
${resumeText}

Instructions:
- Answer only with information contained in the resume. Do not guess or invent details.
- Keep answers concise and focused on what is most relevant to the question.
- If a question is vague or ambiguous, ask for clarification.
- If a question is unrelated to the candidate's qualifications or experience, politely inform the user that you can only assist with questions about the resume.
- Do not provide personal opinions or advice unrelated to the candidate’s qualifications.
- Respect the privacy of the candidate by not divulging sensitive personal information.

Your goal is to represent the candidate accurately and professionally, helping potential employers understand the candidate’s strengths and fit for a role.`;

  const result = streamText({
    model: groq("openai/gpt-oss-20b"),
    system,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
