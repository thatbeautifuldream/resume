import { experimental_generateSpeech as generateSpeech } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const maxDuration = 120;

type TGroqTTSModel = "playai-tts" | "playai-tts-arabic";

type TGroqTTSVoice =
  | "Arista-PlayAI"
  | "Atlas-PlayAI"
  | "Basil-PlayAI"
  | "Briggs-PlayAI"
  | "Calum-PlayAI"
  | "Celeste-PlayAI"
  | "Cheyenne-PlayAI"
  | "Chip-PlayAI"
  | "Cillian-PlayAI"
  | "Deedee-PlayAI"
  | "Fritz-PlayAI"
  | "Gail-PlayAI"
  | "Indigo-PlayAI"
  | "Mamaw-PlayAI"
  | "Mason-PlayAI"
  | "Mikail-PlayAI"
  | "Mitch-PlayAI"
  | "Quinn-PlayAI"
  | "Thunder-PlayAI";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const modelId: TGroqTTSModel = "playai-tts";
  const voice: TGroqTTSVoice = "Arista-PlayAI";

  const { audio } = await generateSpeech({
    model: groq.speech(modelId),
    text: message,
    voice,
  });

  return new Response(Buffer.from(audio.uint8Array), {
    headers: {
      "Content-Type": audio.mediaType,
    },
  });
}
