import { groq } from "@ai-sdk/groq";
import { withSupermemory } from "@supermemory/tools/ai-sdk";
import * as ai from "ai";
import { convertToModelMessages, stepCountIs, type UIMessage } from "ai";
import { wrapAISDK } from "langsmith/experimental/vercel";
import { resume } from "@/lib/resume";
import { resumeToPlainText } from "@/lib/resume-plain";

const { streamText } = wrapAISDK(ai);

const resumeText = resumeToPlainText(resume);

const system = `You are an expert assistant tasked with helping potential employers by answering questions strictly based on the candidate's resume. The candidate is Milind Kumar Mishra, a Product Engineer.

You are given the full resume below in plain text. Use ONLY this resume text as your source of truth. Do not use any external data or your training data about the candidate's background.

---------------- RESUME (PLAIN TEXT) ----------------
${resumeText}
-----------------------------------------------------

Guidelines:
- Answer ONLY with information that can be grounded in the resume text above.
- If something is not present in the resume, clearly state that the information is not available.
- Keep answers concise, professional, and directly relevant to the user's question.
- When summarizing, highlight impact, scope, and concrete outcomes where possible.`;

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

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
    stopWhen: stepCountIs(5),
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}
