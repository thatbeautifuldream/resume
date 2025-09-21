"use client";

import { Response } from "@/components/ai-elements/response";
import {
  clearFromIndexedDB,
  loadFromIndexedDB,
  saveToIndexedDB,
} from "@/lib/chat-storage";
import { AIDevtools } from "@ai-sdk-tools/devtools";
import {
  useChat,
  useChatMessages,
  useChatStoreState,
} from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Square } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Suspense, useEffect, useRef, useState } from "react";

function ChatContent() {
  const { sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    storeId: "persistent-chat",
  });
  const messages = useChatMessages("persistent-chat");
  const chatState = useChatStoreState("persistent-chat");
  const { setTheme } = useTheme();
  const [theme] = useQueryState(
    "theme",
    parseAsStringLiteral(["dark", "light"]).withDefault("light")
  );
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMessages = messages.length > 0;
  const [isLoaded, setIsLoaded] = useState(false);

  // Clear chat function
  const clearChat = async () => {
    try {
      // Clear from IndexedDB
      await clearFromIndexedDB("resume-chat-history");
      // Clear from current state
      setMessages([]);
    } catch (error) {
      console.warn("Failed to clear chat:", error);
    }
  };

  // Load persisted messages on mount
  useEffect(() => {
    const loadPersistedMessages = async () => {
      try {
        const persistedData = await loadFromIndexedDB("resume-chat-history");
        if (persistedData?.messages && persistedData.messages.length > 0) {
          setMessages(persistedData.messages);
        }
      } catch (error) {
        console.warn("Failed to load persisted messages:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPersistedMessages();
  }, [setMessages]);

  // Save messages to IndexedDB when they change
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      saveToIndexedDB("resume-chat-history", {
        messages,
        id: chatState.id,
      }).catch((error) => {
        console.warn("Failed to save messages:", error);
      });
    }
  }, [messages, chatState.id, isLoaded]);

  // Sync URL theme with next-themes
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input on '/' key
      if (e.key === "/" && e.target !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Blur input on 'Escape' key
      if (e.key === "Escape" && e.target === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="fixed inset-0 flex flex-col select-none pt-16">
      {hasMessages && (
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 max-w-full lg:max-w-[896px] lg:mx-auto lg:w-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`w-full ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {message.parts
                .filter((part) => part.type === "text")
                .map((part, index) =>
                  message.role === "user" ? (
                    <div key={index} className="p-2">
                      {part.text}
                    </div>
                  ) : (
                    <Response key={index}>{part.text}</Response>
                  )
                )}
            </div>
          ))}
          {status === "submitted" && (
            <div className="w-full text-left">
              <div className="flex items-center space-x-1 p-2">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                >
                  *
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  *
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                >
                  *
                </motion.span>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`${
          !hasMessages
            ? "flex-1 flex flex-col items-center justify-center p-4"
            : ""
        }`}
        style={!hasMessages ? { transform: "translateY(-10vh)" } : {}}
      >
        {!hasMessages && (
          <motion.div
            className="text-center mb-8"
            animate={{ opacity: hasMessages ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-base">Chat with Milind's Resume</h1>
            <p className="text-md opacity-60">
              Ask anything about my work, projects, or experience
            </p>
          </motion.div>
        )}

        <motion.div
          layout
          className={`w-full max-w-full lg:max-w-[896px] lg:mx-auto p-4 ${
            hasMessages ? "flex-shrink-0" : ""
          }`}
        >
          {hasMessages && (
            <motion.div layout="position" className="mb-2 flex justify-end">
              <button
                onClick={clearChat}
                className="text-sm cursor-pointer hover:underline opacity-60 hover:opacity-100 transition-opacity"
                title="Clear chat history"
              >
                start new ?
              </button>
            </motion.div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && status === "ready") {
                sendMessage({ text: input });
                setInput("");
              }
            }}
            className="w-full"
          >
            <div className="relative flex items-end border border-input focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all duration-200">
              <textarea
                ref={inputRef as any}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && status === "ready") {
                      sendMessage({ text: input });
                      setInput("");
                    }
                  }
                }}
                disabled={status !== "ready"}
                placeholder="Ask something about Milind's work..."
                rows={1}
                className="flex-1 min-w-0 px-4 py-3 text-base bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground min-h-[48px] max-h-[200px] overflow-y-scroll"
                style={{
                  height: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 200) + "px";
                }}
              />

              <button
                type={status === "ready" ? "submit" : "button"}
                onClick={() => {
                  if (status === "submitted") {
                    stop();
                  }
                }}
                disabled={status === "ready" && !input.trim()}
                className={`mr-2 mb-2 p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                  status === "ready" && input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    : status === "submitted"
                    ? "bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
              >
                {status === "submitted" ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </Suspense>
  );
}
