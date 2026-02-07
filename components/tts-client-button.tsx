"use client";

import { Button } from "@/components/ui/button";
import { markdownToSpeech } from "@/lib/markdown-to-speech";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback } from "react";

interface TTSClientButtonProps {
  text: string;
}

/**
 * Client-side Text-to-Speech button using Web Speech API
 * No API calls, works offline, free!
 */
export function TTSClientButton({ text }: TTSClientButtonProps) {
  const { speak, cancel, isSpeaking, isSupported } = useSpeechSynthesis();

  const handleToggle = useCallback(() => {
    if (isSpeaking) {
      cancel();
    } else {
      // Clean markdown formatting before speaking
      const cleanText = markdownToSpeech(text);

      if (!cleanText || cleanText.trim().length === 0) {
        console.warn('No readable text content for speech');
        return;
      }

      speak(cleanText);
    }
  }, [isSpeaking, text, speak, cancel]);

  // Hide button if browser doesn't support Web Speech API
  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-6 w-6 rounded-full hover:bg-accent cursor-pointer"
      aria-label={isSpeaking ? "Stop speech" : "Read aloud"}
      title={isSpeaking ? "Stop reading" : "Read message aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
