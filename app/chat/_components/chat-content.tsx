"use client";

import { Response } from "@/components/ai-elements/response";
import { Loading } from "@/components/loading";
import {
  clearFromIndexedDB,
  loadFromIndexedDB,
  saveToIndexedDB,
} from "@/lib/chat-storage";
import {
  useChat,
  useChatMessages,
  useChatStoreState,
} from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Square } from "lucide-react";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/prompt-area";
import { Button } from "@/components/ui/button";

const CHAT_STORE_ID = "persistent-chat";
const CHAT_HISTORY_KEY = "resume-chat-history";

const ChatContext = createContext<
  | (ReturnType<typeof useChat> & {
    messages: ReturnType<typeof useChatMessages>;
    chatState: ReturnType<typeof useChatStoreState>;
    input: string;
    setInput: (value: string) => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    hasMessages: boolean;
    isLoaded: boolean;
    clearChat: () => Promise<void>;
  })
  | null
>(null);

function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("Chat components must be used within a Chat provider");
  }
  return context;
}

function Message({ message }: { message: any }) {
  return (
    <div
      className={`w-full ${message.role === "user" ? "text-right" : "text-left"
        }`}
    >
      {message.parts.map((part: any, index: number) => {
        if (part.type === "text" && message.role === "user") {
          return (
            <div key={index} className="p-2">
              {part.text}
            </div>
          );
        }

        if (part.type === "text" && message.role === "assistant") {
          return <Response key={index}>{part.text}</Response>;
        }

        if (part.type === "reasoning" && message.role === "assistant") {
          return (
            <details key={index} className="mb-2 p-2">
              <summary className="text-sm cursor-pointer transition-opacity italic">
                Thinking...
              </summary>
              <div className="text-sm mt-2 pl-4 italic whitespace-pre-wrap">
                {part.text}
              </div>
            </details>
          );
        }

        return null;
      })}
    </div>
  );
}

function Messages() {
  const { messages, status, hasMessages } = useChatContext();

  if (!hasMessages) return null;

  return (
    <div
      className="flex-1 overflow-y-auto p-4 pb-32 space-y-4 max-w-full lg:max-w-[896px] lg:mx-auto lg:w-full"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {status === "submitted" && <Loading />}
    </div>
  );
}

function Welcome() {
  const { hasMessages } = useChatContext();

  if (hasMessages) return null;

  return (
    <motion.div
      className="text-center mb-8"
      animate={{ opacity: hasMessages ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4">
        Chat with Milind's Resume
      </h1>
      <p className="text-base sm:text-lg md:text-xl opacity-60">
        Ask anything about my work, projects, or experience
      </p>
    </motion.div>
  );
}

function ClearButton() {
  const { hasMessages, clearChat } = useChatContext();

  if (!hasMessages) return null;

  return (
    <motion.div layout="position" className="mb-2 flex justify-end">
      <button
        onClick={clearChat}
        className="text-sm cursor-pointer hover:underline opacity-60 hover:opacity-100 transition-opacity"
        title="Clear chat history"
      >
        start new ?
      </button>
    </motion.div>
  );
}

function Input() {
  const { sendMessage, status, stop, input, setInput, inputRef } =
    useChatContext();

  const handleSubmit = () => {
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Smooth gradient fade from transparent to bg */}
      <div className="h-16 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="bg-background px-4 pb-4 pointer-events-auto">
        <div className="container mx-auto max-w-4xl relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full"
          >
            <PromptInput
              value={input}
              onValueChange={setInput}
              onSubmit={handleSubmit}
              disabled={status !== "ready"}
              isLoading={status === "submitted"}
              maxHeight={200}
              className="py-1.5 pl-2 pr-2"
            >
              <div className="flex items-end gap-1.5">
                <div className="flex-1 min-w-0">
                  <PromptInputTextarea
                    placeholder="Ask something about Milind's work..."
                    className="min-h-[32px] py-1 pl-2 pr-0"
                  />
                </div>
                <PromptInputActions>
                  <Button
                    type={status === "ready" ? "submit" : "button"}
                    size="icon"
                    onClick={(e) => {
                      if (status === "submitted") {
                        e.preventDefault();
                        stop();
                      }
                    }}
                    disabled={status === "ready" && !input.trim()}
                    className="rounded-full size-8 shrink-0 shadow cursor-pointer disabled:cursor-not-allowed"
                  >
                    {status === "submitted" ? (
                      <Square className="size-4" fill="currentColor" />
                    ) : (
                      <ArrowUp className="size-4" />
                    )}
                  </Button>
                </PromptInputActions>
              </div>
            </PromptInput>
          </form>
        </div>
      </div>
    </div>
  );
}

function Chat({ children }: { children: React.ReactNode }) {
  const {
    sendMessage,
    status,
    stop,
    setMessages,
    regenerate,
    resumeStream,
    addToolResult,
    clearError,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    storeId: CHAT_STORE_ID,
  });
  const messages = useChatMessages(CHAT_STORE_ID);
  const chatState = useChatStoreState(CHAT_STORE_ID);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasMessages = messages.length > 0;
  const [isLoaded, setIsLoaded] = useState(false);
  const [queryParam, setQueryParam] = useQueryState("q");

  const clearChat = async () => {
    try {
      await clearFromIndexedDB(CHAT_HISTORY_KEY);
      setMessages([]);
    } catch (error) {
      console.warn("Failed to clear chat:", error);
    }
  };

  useEffect(() => {
    const loadPersistedMessages = async () => {
      try {
        const persistedData = await loadFromIndexedDB(CHAT_HISTORY_KEY);
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

  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      saveToIndexedDB(CHAT_HISTORY_KEY, {
        messages,
        id: chatState.id,
      }).catch((error) => {
        console.warn("Failed to save messages:", error);
      });
    }
  }, [messages, chatState.id, isLoaded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && e.target !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && e.target === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isLoaded && queryParam && status === "ready") {
      sendMessage({ text: queryParam });
      setQueryParam(null);
    }
  }, [isLoaded, queryParam, status, sendMessage, setQueryParam]);

  const contextValue = {
    sendMessage,
    status,
    stop,
    setMessages,
    regenerate,
    resumeStream,
    addToolResult,
    clearError,
    messages,
    chatState,
    input,
    setInput,
    inputRef,
    hasMessages,
    isLoaded,
    clearChat,
    id: chatState.id,
    error: undefined,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      <main className="fixed inset-0 flex flex-col pt-12 print:static print:pt-0">
        {children}
      </main>
    </ChatContext.Provider>
  );
}

Chat.Messages = Messages;
Chat.Welcome = Welcome;
Chat.ClearButton = ClearButton;
Chat.Input = Input;
Chat.Message = Message;

function ChatContentLayout() {
  const { hasMessages } = useChatContext();

  return (
    <>
      <Chat.Messages />
      <div
        className={`${!hasMessages
            ? "flex-1 flex flex-col items-center justify-center p-4 pb-32"
            : ""
          }`}
        style={!hasMessages ? { transform: "translateY(-10vh)" } : {}}
      >
        <Chat.Welcome />
        {hasMessages && (
          <motion.div
            layout
            className="w-full max-w-full lg:max-w-[896px] lg:mx-auto p-4 print:hidden"
          >
            <Chat.ClearButton />
          </motion.div>
        )}
      </div>
      {/* Input is now fixed at the bottom */}
      <Chat.Input />
    </>
  );
}

export function ChatContent() {
  return (
    <Chat>
      <ChatContentLayout />
    </Chat>
  );
}
