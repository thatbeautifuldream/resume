import { groq } from "@ai-sdk/groq";
import * as ai from "ai";
import { convertToModelMessages, UIMessage, stepCountIs } from "ai";
import { wrapAISDK } from "langsmith/experimental/vercel";
import { getResumeAsMarkdown } from "@/lib/transformers";
import { withSupermemory } from "@supermemory/tools/ai-sdk";

const { streamText } = wrapAISDK(ai);

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const resumeMarkdown = getResumeAsMarkdown();

  const system = `You are an expert assistant tasked with helping potential employers by answering questions strictly based on the candidate's resume. Use the resume information below to provide concise, clear, and relevant answers about the candidate's skills, experience, education, projects, and background.

Resume Information:
${resumeMarkdown}

Instructions:
- Answer only with information contained in the resume. Do not guess or invent details.
- Keep answers concise and focused on what is most relevant to the question.
- If a question is vague or ambiguous, ask for clarification.
- If a question is unrelated to the candidate's qualifications or experience, politely inform the user that you can only assist with questions about the resume.
- Do not provide personal opinions or advice unrelated to the candidate's qualifications.

Your goal is to represent the candidate accurately and professionally, helping potential employers understand the candidate's strengths and fit for a role.`;

  const modelMessages = await convertToModelMessages(messages);

  const modelWithMemory = withSupermemory(
    groq("openai/gpt-oss-20b"),
    "milind_resume_assistant_memory",
  );

  const result = streamText({
    model: modelWithMemory,
    system,
    messages: modelMessages,
    tools: {
      browser_search: groq.tools.browserSearch({}),
    },
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}
