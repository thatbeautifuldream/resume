"use client";

import { Orb } from "@/components/ui/orb";
import { useState, useRef, useCallback, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

type AgentState = null | "thinking" | "listening" | "talking";

export default function VoicePage() {
  const [agentState, setAgentState] = useState<AgentState>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const inputVolumeRef = useRef<number>(0);
  const outputVolumeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Track input volume from microphone
  const startVolumeTracking = useCallback((stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      inputVolumeRef.current = average / 255;

      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  }, []);

  // Track output volume
  const trackOutputVolume = useCallback(
    (audioElement: HTMLAudioElement) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);

      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        outputVolumeRef.current = average / 255;

        if (agentState === "talking") {
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };

      updateVolume();
    },
    [agentState]
  );

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAgentState("listening");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startVolumeTracking(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start recording"
      );
      setAgentState(null);
    }
  }, [startVolumeTracking]);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || agentState !== "listening") return;

    return new Promise<void>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        const stream = mediaRecorder.stream;
        stream.getTracks().forEach((track) => track.stop());

        // Stop volume tracking
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        inputVolumeRef.current = 0;
        setAgentState("thinking");
        setIsProcessing(true);

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          // Transcribe audio
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const sttResponse = await fetch("/api/stt", {
            method: "POST",
            body: formData,
          });

          if (!sttResponse.ok) {
            throw new Error("Failed to transcribe audio");
          }

          const { text: transcript } = await sttResponse.json();

          // Add user message
          const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            text: transcript,
          };
          setMessages((prev) => [...prev, userMessage]);

          // Get AI response - format as UIMessage[]
          const uiMessages = [
            ...messages.map((m) => ({
              id: m.id,
              role: m.role,
              parts: [{ type: "text" as const, text: m.text }],
            })),
            {
              id: userMessage.id,
              role: "user" as const,
              parts: [{ type: "text" as const, text: transcript }],
            },
          ];

          const chatResponse = await fetch("/api/voice-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: uiMessages }),
          });

          if (!chatResponse.ok) {
            throw new Error("Failed to get AI response");
          }

          // Read the complete streaming response
          const fullResponse = await chatResponse.text();

          // Parse the stream to extract text
          let aiResponseText = "";
          const lines = fullResponse.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            // Parse SSE format: data: {...}
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.substring(6); // Remove "data: " prefix
                if (jsonStr === "[DONE]") continue;

                const data = JSON.parse(jsonStr);

                // Extract text from text-delta events
                if (data.type === "text-delta" && data.delta) {
                  aiResponseText += data.delta;
                }
              } catch (e) {
                // Skip invalid JSON or [DONE] marker
              }
            }
          }

          // Add assistant message
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: aiResponseText,
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Convert response to speech
          if (!aiResponseText || aiResponseText.trim().length === 0) {
            throw new Error("No response text to convert to speech");
          }

          setAgentState("talking");
          const ttsResponse = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: aiResponseText }),
          });

          if (!ttsResponse.ok) {
            const errorData = await ttsResponse.json().catch(() => ({}));
            throw new Error(
              `Failed to generate speech: ${
                errorData.error || ttsResponse.statusText
              }`
            );
          }

          const ttsAudioBlob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(ttsAudioBlob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;

          // Track output volume
          trackOutputVolume(audio);

          audio.onended = () => {
            setAgentState(null);
            outputVolumeRef.current = 0;
            currentAudioRef.current = null;
            URL.revokeObjectURL(audioUrl);
            setIsProcessing(false);
          };

          audio.onerror = () => {
            setError("Failed to play audio");
            setAgentState(null);
            outputVolumeRef.current = 0;
            currentAudioRef.current = null;
            setIsProcessing(false);
          };

          await audio.play();
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setAgentState(null);
          setIsProcessing(false);
        }

        resolve();
      };

      mediaRecorder.stop();
    });
  }, [agentState, messages, trackOutputVolume]);

  const handleOrbClick = () => {
    if (agentState === "listening") {
      stopRecording();
    } else if (agentState === null && !isProcessing) {
      startRecording();
    } else if (agentState === "talking") {
      // Stop speaking
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      setAgentState(null);
      outputVolumeRef.current = 0;
      setIsProcessing(false);
    }
  };

  const getInputVolume = () => inputVolumeRef.current;
  const getOutputVolume = () => outputVolumeRef.current;

  return (
    <main className="fixed inset-0 flex flex-col pt-12">
      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-full lg:max-w-[896px] lg:mx-auto lg:w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`w-full ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div className="p-2">
                <div className="text-xs opacity-60 mb-1">
                  {message.role === "user" ? "You" : "Assistant"}
                </div>
                <div className="text-sm">{message.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orb Container - Centered when no messages */}
      <div
        className={`${
          messages.length === 0
            ? "flex-1 flex flex-col items-center justify-center"
            : "flex items-center justify-center py-8"
        }`}
      >
        {messages.length === 0 && (
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4">
              Voice Chat with Milind's Resume
            </h1>
            <p className="text-base sm:text-lg md:text-xl opacity-60">
              Click the orb and start asking about experience and projects
            </p>
          </div>
        )}

        {/* Orb */}
        <div
          className="w-80 h-80 cursor-pointer transition-transform hover:scale-105"
          onClick={handleOrbClick}
        >
          <Orb
            agentState={agentState}
            getInputVolume={getInputVolume}
            getOutputVolume={getOutputVolume}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-full lg:max-w-[896px] lg:mx-auto p-4 print:hidden flex-shrink-0">
        {messages.length > 0 && (
          <div className="mb-2 flex justify-end">
            <button
              onClick={() => setMessages([])}
              className="text-sm cursor-pointer hover:underline opacity-60 hover:opacity-100 transition-opacity"
              title="Clear conversation"
            >
              start new ?
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
