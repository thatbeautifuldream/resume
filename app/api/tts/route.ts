import { experimental_generateSpeech as generateSpeech } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";

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

type TOpenAITTSVoice =
  | "alloy"
  | "ash"
  | "ballad"
  | "coral"
  | "echo"
  | "fable"
  | "nova"
  | "onyx"
  | "sage"
  | "shimmer";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // const groq = createOpenAI({
    //   baseURL: "https://api.groq.com/openai/v1",
    //   apiKey: process.env.GROQ_API_KEY,
    // });

    // const modelId: TGroqTTSModel = "playai-tts";
    // const voice: TGroqTTSVoice = "Arista-PlayAI";

    // const { audio } = await generateSpeech({
    //   model: groq.speech(modelId),
    //   text: message,
    //   voice,
    // });

    const voice: TOpenAITTSVoice = "alloy";

    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text: message,
      voice: "alloy",
    });

    return new Response(Buffer.from(audio.uint8Array), {
      headers: {
        "Content-Type": audio.mediaType,
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
