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
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useQueryState } from "nuqs";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/prompt-area";
import { Button } from "@/components/ui/button";
import { useHotkeys } from "react-hotkeys-hook";

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

const Message = memo(function Message({ message }: { message: any }) {
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
});

function Messages() {
  const { messages, status, hasMessages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const shouldAutoScrollRef = useRef(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Helper to check if user is near bottom
  const isNearBottom = useCallback(() => {
    const scrollContainer = scrollContainerRef.current?.parentElement;
    if (!scrollContainer) return false;

    const threshold = 100; // pixels from bottom
    const position = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;
    return position < threshold;
  }, []);

  // Helper to scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    });
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const messageCountChanged = messages.length !== prevMessageCountRef.current;
    const hasNewMessage = messages.length > prevMessageCountRef.current;

    // Update ref for next render
    prevMessageCountRef.current = messages.length;

    // Always scroll when:
    // 1. New message added (user sent message or assistant started replying)
    // 2. Status changed to submitted (loading state appeared)
    // 3. User is already near bottom and content is streaming
    if (hasNewMessage || status === "submitted" || (shouldAutoScrollRef.current && isNearBottom())) {
      scrollToBottom();
    }
  }, [messages, status, isNearBottom, scrollToBottom]);

  // Track user scroll behavior
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current?.parentElement;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Update auto-scroll preference based on user position
      shouldAutoScrollRef.current = isNearBottom();

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // If user scrolls away from bottom, temporarily disable auto-scroll
      // Re-enable after they stop scrolling for 200ms
      if (!shouldAutoScrollRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          if (isNearBottom()) {
            shouldAutoScrollRef.current = true;
          }
        }, 200);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isNearBottom]);

  // Initial scroll to bottom when messages first load
  const hasScrolledInitiallyRef = useRef(false);
  useEffect(() => {
    if (hasMessages && messages.length > 0 && !hasScrolledInitiallyRef.current) {
      scrollToBottom("instant");
      hasScrolledInitiallyRef.current = true;
    }
  }, [hasMessages, messages.length, scrollToBottom]);

  if (!hasMessages) return null;

  return (
    <div ref={scrollContainerRef} className="p-4 pb-20 space-y-4 w-full">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {status === "submitted" && <Loading />}
      {/* Invisible anchor element for auto-scroll */}
      <div ref={messagesEndRef} />
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

  const handleSubmit = useCallback(() => {
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  }, [input, status, sendMessage, setInput]);

  return (
    <div className="p-4">
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

  const clearChat = useCallback(async () => {
    try {
      await clearFromIndexedDB(CHAT_HISTORY_KEY);
      setMessages([]);
    } catch (error) {
      console.warn("Failed to clear chat:", error);
    }
  }, [setMessages]);

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

  // Focus input on "/" key press (only when not already focused)
  useHotkeys(
    "/",
    (e) => {
      if (document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    },
    {
      enableOnFormTags: false, // Don't trigger when typing in forms
    }
  );

  // Blur input on Escape key press (only when input is focused)
  useHotkeys(
    "escape",
    () => {
      if (document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    },
    {
      enableOnFormTags: true, // Allow escape in form inputs
    }
  );

  useEffect(() => {
    if (isLoaded && queryParam && status === "ready") {
      sendMessage({ text: queryParam });
      setQueryParam(null);
    }
  }, [isLoaded, queryParam, status, sendMessage, setQueryParam]);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="h-full flex flex-col">
        {children}
      </div>
    </ChatContext.Provider>
  );
}

Chat.Messages = Messages;
Chat.Welcome = Welcome;
Chat.ClearButton = ClearButton;
Chat.Input = Input;
Chat.Message = Message;

function ChatContentLayout() {
  const { hasMessages, isLoaded } = useChatContext();

  return (
    <div className="@container h-full flex flex-col relative">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        {!isLoaded ? (
          // Loading state - prevents flash of empty state
          <div className="flex items-center justify-center p-4 min-h-[60vh]">
            <Loading />
          </div>
        ) : (
          <>
            <Chat.Messages />
            {!hasMessages && (
              <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
                <Chat.Welcome />
              </div>
            )}
          </>
        )}
      </div>
      {/* Gradient overlay - positioned above scroll area */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        {/* Smooth gradient fade from transparent to bg */}
        <div className="h-16 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      {/* Input at bottom */}
      <div className="bg-background relative z-10">
        <Chat.Input />
      </div>
    </div>
  );
}

export function ChatContent() {
  return (
    <Chat>
      <ChatContentLayout />
    </Chat>
  );
}
