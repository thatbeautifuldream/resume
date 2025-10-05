import { resume } from "@/lib/resume";
import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const maxDuration = 30;

function createRedactedResume(fullResume: typeof resume) {
  return {
    ...fullResume,
    basics: {
      ...fullResume.basics,
      phone: "[REDACTED]",
      location: {
        ...fullResume.basics.location,
        address: "[REDACTED]",
        postalCode: "[REDACTED]",
      },
    },
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
    tools: {
      browser_search: groq.tools.browserSearch({}),
    },
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}
