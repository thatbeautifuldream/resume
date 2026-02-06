"use client";

import { Response } from "@/components/ai-elements/response";
import { Loading } from "@/components/loading";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-area";
import { useSidebarActions } from "@/components/providers/chat-sidebar-store";
import { Button } from "@/components/ui/button";
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
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
      className={`w-full ${
        message.role === "user" ? "text-right" : "text-left"
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

  const isNearBottom = useCallback(() => {
    const scrollContainer = scrollContainerRef.current?.parentElement;
    if (!scrollContainer) return false;

    const threshold = 100;
    const position =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      scrollContainer.clientHeight;
    return position < threshold;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    });
  }, []);

  useEffect(() => {
    const hasNewMessage = messages.length > prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    if (
      hasNewMessage ||
      status === "submitted" ||
      (shouldAutoScrollRef.current && isNearBottom())
    ) {
      scrollToBottom();
    }
  }, [messages, status, isNearBottom, scrollToBottom]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current?.parentElement;
    if (!scrollContainer) return;

    const handleScroll = () => {
      shouldAutoScrollRef.current = isNearBottom();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (!shouldAutoScrollRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          if (isNearBottom()) {
            shouldAutoScrollRef.current = true;
          }
        }, 200);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isNearBottom]);

  const hasScrolledInitiallyRef = useRef(false);
  useEffect(() => {
    if (
      hasMessages &&
      messages.length > 0 &&
      !hasScrolledInitiallyRef.current
    ) {
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
        aria-label="Clear chat history"
        className="text-sm cursor-pointer hover:underline opacity-60 hover:opacity-100 transition-opacity"
        title="Clear chat history"
      >
        start new ?
      </button>
    </motion.div>
  );
}

function Input() {
  const { sendMessage, status, stop, input, setInput } = useChatContext();

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
  const { registerChatHandler, unregisterChatHandler } = useSidebarActions();

  const clearChat = useCallback(async () => {
    try {
      await clearFromIndexedDB(CHAT_HISTORY_KEY);
      setMessages([]);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to clear chat:", error);
      }
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
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to load persisted messages:", error);
        }
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
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to save messages:", error);
        }
      });
    }
  }, [messages, chatState.id, isLoaded]);

  useHotkeys(
    "/",
    (e) => {
      if (document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    },
    {
      enableOnFormTags: false,
    },
  );

  useHotkeys(
    "escape",
    () => {
      if (document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    },
    {
      enableOnFormTags: true,
    },
  );

  const handleInjectPrompt = useCallback(
    (prompt: string) => {
      if (isLoaded && status === "ready") {
        sendMessage({ text: prompt });
      } else {
        setInput(prompt);
        inputRef.current?.focus();
      }
    },
    [isLoaded, status, sendMessage, setInput],
  );

  useEffect(() => {
    registerChatHandler(handleInjectPrompt);
    return () => {
      unregisterChatHandler();
    };
  }, [registerChatHandler, unregisterChatHandler, handleInjectPrompt]);

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
    ],
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="h-full flex flex-col">{children}</div>
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
      <div className="flex-1 overflow-y-auto">
        {!isLoaded ? (
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
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="h-16 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
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
