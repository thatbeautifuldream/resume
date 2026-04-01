import { groq } from "@ai-sdk/groq";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { withSupermemory } from "@supermemory/tools/ai-sdk";
import * as ai from "ai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  type UIMessage,
} from "ai";
import { wrapAISDK } from "langsmith/experimental/vercel";
import { NextRequest } from "next/server";
import { MAX_CHAT_MESSAGES, validateChatMessages } from "@/lib/chat-validation";
import { getRandomRateLimitMessage } from "@/lib/rate-limit-messages";
import { notifyTelegram } from "@/lib/telegram";
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

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(8, "1h"),
});

const GENERIC_ERROR_MESSAGE =
  "Something went wrong while generating a response. Please try again.";

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function createAssistantMessageResponse(
  message: string,
  originalMessages: UIMessage[],
): Response {
  const stream = createUIMessageStream({
    originalMessages,
    execute({ writer }) {
      const textId = "chat-system-0";
      writer.write({ type: "start" });
      writer.write({ type: "start-step" });
      writer.write({ type: "text-start", id: textId });
      writer.write({ type: "text-delta", id: textId, delta: message });
      writer.write({ type: "text-end", id: textId });
      writer.write({ type: "finish-step" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  let messages: UIMessage[];

  try {
    const body = (await req.json()) as { messages?: UIMessage[] };

    if (!Array.isArray(body.messages)) {
      void notifyTelegram({
        type: "bad_request",
        ip,
        reason: "messages payload is not an array",
        messageCount: null,
      });
      return new Response("Bad request", { status: 400 });
    }

    messages = body.messages;
  } catch {
    void notifyTelegram({
      type: "bad_request",
      ip,
      reason: "request body could not be parsed as JSON",
      messageCount: null,
    });
    return new Response("Bad request", { status: 400 });
  }

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    void notifyTelegram({ type: "rate_limit", ip, limit, remaining, reset });
    return createAssistantMessageResponse(
      getRandomRateLimitMessage(),
      messages,
    );
  }

  if (messages.length > MAX_CHAT_MESSAGES) {
    void notifyTelegram({
      type: "bad_request",
      ip,
      reason: `message count ${messages.length} exceeds ${MAX_CHAT_MESSAGES}`,
      messageCount: messages.length,
    });
    return new Response("Bad request", { status: 400 });
  }

  const validation = validateChatMessages(messages);

  if (!validation.valid) {
    void notifyTelegram({
      type: "validation_error",
      ip,
      reason: validation.reason,
      messageCount: messages.length,
    });
    return new Response("Bad request", { status: 400 });
  }

  const modelMessages = await convertToModelMessages(messages);
  const modelId = "openai/gpt-oss-20b";
  const modelWithMemory = withSupermemory(
    groq(modelId),
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
    onError: ({ error }) => {
      void notifyTelegram({
        type: "api_error",
        ip,
        model: modelId,
        messageCount: messages.length,
        error: error instanceof Error ? error.message : String(error),
      });
    },
  });

  return result.toUIMessageStreamResponse({
    onError: () => GENERIC_ERROR_MESSAGE,
  });
}
