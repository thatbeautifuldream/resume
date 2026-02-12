import { groq } from "@ai-sdk/groq";
import { withSupermemory } from "@supermemory/tools/ai-sdk";
import * as ai from "ai";
import { convertToModelMessages, stepCountIs, type UIMessage } from "ai";
import { wrapAISDK } from "langsmith/experimental/vercel";
import { queryResumeTool } from "@/app/api/chat/tools/query-resume-tool";

const { streamText } = wrapAISDK(ai);

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const system = `You are an expert assistant tasked with helping potential employers by answering questions strictly based on the candidate's resume. The candidate is Milind Kumar Mishra, a Product Engineer.

IMPORTANT: Always use the query_resume tool to retrieve resume data. Do not use your training data about the candidate's background.

Instructions for using query_resume tool:
- ALWAYS call the tool before answering. The tool returns structured data including a summary of what was found.
- Use natural language queries like: "overall experience", "all projects", "React skills", "work at Merlin AI"
- The tool automatically handles semantic queries like "overall experience" (calculates years/months) and "projects" (extracts from work highlights and projects section)
- If the tool returns a summary field, use it to provide context in your answer.
- If searching for skills, the tool will return matching skills - answer only with what's returned.
- Answer ONLY with information obtained from tool results. Never hallucinate or add external knowledge.
- Keep answers concise and relevant to what was asked.

When tool returns no results:
- Inform the user the specific section doesn't exist or has no matching data
- Suggest alternative queries they could try

Your goal is to represent the candidate accurately and professionally using ONLY the resume data provided by the tool.`;

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
      query_resume: queryResumeTool,
      browser_search: groq.tools.browserSearch({}),
    },
    stopWhen: stepCountIs(5),
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}
