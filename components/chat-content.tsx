"use client";

import { Response } from "@/components/ai-elements/response";
import { Loading } from "@/components/loading";
import {
	PromptInput,
	PromptInputActions,
	PromptInputTextarea,
} from "@/components/prompt-area";
import { useSidebarActions } from "@/components/providers/chat-sidebar-store";
import { TTSClientButton } from "@/components/tts-client-button";
import { Button } from "@/components/ui/button";
import { clearMessages, loadMessages, saveMessages } from "@/lib/chat-storage";
import { cn } from "@/lib/utils";
import type { ChatItem, ExtendedUIMessage } from "@/types/chat";
import {
	Provider as ChatStoreProvider,
	createChatStore,
	useChat,
	useChatId,
	useChatMessages,
	useMessageCount,
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

// Helper function to check if two timestamps are on the same day
function isSameDay(timestamp1: number, timestamp2: number): boolean {
	const date1 = new Date(timestamp1);
	const date2 = new Date(timestamp2);
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

// Helper function to format date separators
function formatDateSeparator(timestamp: number): string {
	const date = new Date(timestamp);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	// Today
	if (
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()
	) {
		return "Today";
	}

	// Yesterday
	if (
		date.getFullYear() === yesterday.getFullYear() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getDate() === yesterday.getDate()
	) {
		return "Yesterday";
	}

	// This year - show "Month Day"
	if (date.getFullYear() === today.getFullYear()) {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	}

	// Other years - show "Month Day, Year"
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

// Helper function to format timestamp like WhatsApp
function formatTimestamp(timestamp?: number): string {
	if (!timestamp) return "";
	const date = new Date(timestamp);
	return date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

// Removed hardcoded session ID - now using dynamic sessions from SessionContext

const ChatContext = createContext<
	| (ReturnType<typeof useChat> & {
			messages: ExtendedUIMessage[];
			chatId: string | undefined;
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

const ASSISTANT_NAME = "Milo, Your Resume Guide";

const Message = memo(function Message({
	message,
}: {
	message: ExtendedUIMessage;
}) {
	const isUser = message.role === "user";
	const isAssistant = message.role === "assistant";

	// Extract all text content from the message for TTS
	const messageText = message.parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join(" ");

	return (
		<div
			className={cn(
				"flex w-full min-w-0",
				isUser ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={cn(
					"flex flex-col max-w-[85%] @sm:max-w-[80%] min-w-0",
					isUser ? "items-end" : "items-start",
				)}
			>
				<div
					className={cn(
						"relative px-2.5 sm:px-3 py-1.5 sm:py-2 overflow-hidden",
						isUser
							? "rounded-2xl rounded-br-none bg-secondary border text-secondary-foreground"
							: "rounded-2xl rounded-bl-none bg-background border text-foreground",
					)}
				>
					{isAssistant && (
						<span
							className={cn(
								"text-xs font-semibold block mb-1 px-1 text-muted-foreground text-left",
							)}
						>
							{ASSISTANT_NAME}
						</span>
					)}
					<div className="break-words">
						{message.parts.map((part, index) => {
							if (part.type === "text") {
								return isUser ? (
									<p
										key={String(part.providerMetadata?.id ?? index)}
										className="text-sm leading-relaxed whitespace-pre-wrap"
									>
										{part.text}
									</p>
								) : (
									<Response key={String(part.providerMetadata?.id ?? index)}>
										{part.text}
									</Response>
								);
							}

							if (part.type === "reasoning" && message.role === "assistant") {
								return (
									<details
										key={String(part.providerMetadata?.id ?? index)}
										className="mb-2"
									>
										<summary className="text-xs cursor-pointer hover:opacity-80 transition-opacity italic">
											Thinking...
										</summary>
										<div className="text-xs mt-2 pl-2 italic whitespace-pre-wrap opacity-80">
											{part.text}
										</div>
									</details>
								);
							}

							return null;
						})}

						{/* WhatsApp-style timestamp */}
						{message.createdAt && (
							<div className="flex justify-end mt-1">
								<span
									className={cn(
										"text-[10px] leading-none",
										isUser
											? "text-secondary-foreground/70"
											: "text-muted-foreground/70",
									)}
								>
									{formatTimestamp(message.createdAt)}
								</span>
							</div>
						)}
					</div>
				</div>
				{!isUser && messageText && (
					<div className="mt-1 ml-1">
						<TTSClientButton text={messageText} />
					</div>
				)}
			</div>
		</div>
	);
});

function Messages() {
	const { messages, status, hasMessages } = useChatContext();
	const messageCount = useMessageCount();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const prevMessageCountRef = useRef(0);
	const shouldAutoScrollRef = useRef(true);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	// Compute chat items with date separators
	const chatItems = useMemo((): ChatItem[] => {
		const items: ChatItem[] = [];
		let lastDate: number | null = null;

		(messages as ExtendedUIMessage[]).forEach((msg, index) => {
			const msgTimestamp = msg.createdAt || Date.now();

			// Add date separator if day changed
			if (lastDate === null || !isSameDay(lastDate, msgTimestamp)) {
				items.push({
					type: "date-separator",
					date: formatDateSeparator(msgTimestamp),
					timestamp: msgTimestamp,
				});
				lastDate = msgTimestamp;
			}

			// Add message
			items.push({
				type: "message",
				data: msg,
				originalIndex: index,
			});
		});

		return items;
	}, [messages]);

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
		const hasNewMessage = messageCount > prevMessageCountRef.current;
		prevMessageCountRef.current = messageCount;

		if (
			hasNewMessage ||
			status === "submitted" ||
			(shouldAutoScrollRef.current && isNearBottom())
		) {
			scrollToBottom();
		}
	}, [messageCount, status, isNearBottom, scrollToBottom]);

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
		if (hasMessages && messageCount > 0 && !hasScrolledInitiallyRef.current) {
			scrollToBottom("instant");
			hasScrolledInitiallyRef.current = true;
		}
	}, [hasMessages, messageCount, scrollToBottom]);

	if (!hasMessages) return null;

	return (
		<div
			ref={scrollContainerRef}
			className="p-3 sm:p-4 pb-20 space-y-3 sm:space-y-4 w-full"
		>
			{chatItems.map((item, index) => {
				if (item.type === "date-separator") {
					return (
						<div
							key={`date-${item.timestamp}`}
							className="flex justify-center py-2"
						>
							<div className="px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground font-medium">
								{item.date}
							</div>
						</div>
					);
				}

				// Regular message
				return <Message key={item.data.id} message={item.data} />;
			})}
			{status === "submitted" && <Loading />}
			{/* Invisible anchor element for auto-scroll */}
			<div ref={messagesEndRef} />
		</div>
	);
}

function Welcome() {
	const { hasMessages, sendMessage } = useChatContext();

	if (hasMessages) return null;

	const starterPrompts = [
		"Summarize this resume",
		"What's the background?",
		"Tell me about recent projects",
		"What are the key skills?",
		"What's the work experience?",
	];

	const handlePromptClick = (prompt: string) => {
		sendMessage({ text: prompt });
	};

	return (
		<motion.div
			className="text-center mb-3 sm:mb-4"
			animate={{ opacity: hasMessages ? 0 : 1 }}
			transition={{ duration: 0.3 }}
		>
			<h1 className="text-base @md:text-lg @lg:text-xl font-medium mb-1.5 sm:mb-2">
				Chat with Milind's Resume
			</h1>
			<p className="text-xs @md:text-sm opacity-60 mb-3 sm:mb-4">
				Ask anything about my work, projects, or experience
			</p>

			<div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center max-w-md mx-auto">
				{starterPrompts.map((prompt) => (
					<button
						key={prompt}
						onClick={() => handlePromptClick(prompt)}
						className="text-xs @md:text-sm px-2.5 sm:px-3 py-1.5 rounded-full border border-border hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer"
					>
						{prompt}
					</button>
				))}
			</div>
		</motion.div>
	);
}

function ClearButton() {
	const { hasMessages, clearChat } = useChatContext();

	if (!hasMessages) return null;

	return (
		<motion.div layout="position" className="mb-1.5 sm:mb-2 flex justify-end">
			<button
				type="button"
				onClick={clearChat}
				aria-label="Clear chat history"
				className="text-xs sm:text-sm cursor-pointer hover:underline opacity-60 hover:opacity-100 transition-opacity"
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
		<div>
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

function ChatInner({ children }: { children: React.ReactNode }) {
	// Type cast needed: ai@6.x + @ai-sdk-tools/store@1.2.0 version mismatch
	// Still get all performance benefits (O(1) lookups, batching, typed returns)
	const chatHelpers = useChat<ExtendedUIMessage>({
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}) as any,
	});
	const messages = useChatMessages<ExtendedUIMessage>();
	const chatId = useChatId();
	const messageCount = useMessageCount();
	const [input, setInput] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const hasMessages = messageCount > 0;
	const [isLoaded, setIsLoaded] = useState(false);
	const { registerChatHandler, unregisterChatHandler } = useSidebarActions();

	const {
		sendMessage,
		status,
		stop,
		setMessages,
		regenerate,
		resumeStream,
		addToolResult,
		clearError,
	} = chatHelpers;

	const clearChat = useCallback(async () => {
		try {
			await clearMessages();
			setMessages([]);
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.warn("Failed to clear chat:", error);
			}
		}
	}, [setMessages]);

	// Load messages on mount
	useEffect(() => {
		const loadPersistedMessages = async () => {
			try {
				const persistedMessages = await loadMessages();
				if (persistedMessages && persistedMessages.length > 0) {
					setMessages(persistedMessages);
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

	// Save messages when they change
	useEffect(() => {
		if (isLoaded && messageCount > 0) {
			saveMessages(messages).catch((error) => {
				if (process.env.NODE_ENV !== "production") {
					console.warn("Failed to save messages:", error);
				}
			});
		}
	}, [messages, messageCount, isLoaded]);

	// Ensure all messages have createdAt timestamps for immediate display (fixes missing timestamps on first render)
	useEffect(() => {
		if (!isLoaded || messageCount === 0) return;

		const needsNormalization = messages.some((msg) => !msg.createdAt);

		if (needsNormalization) {
			const baseTime = Date.now();
			const normalizedMessages = messages.map((msg, index) => {
				if (!msg.createdAt) {
					return {
						...msg,
						createdAt: baseTime + index,
					};
				}
				return msg;
			});

			setMessages(normalizedMessages);
		}
	}, [messages, messageCount, isLoaded, setMessages]);

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
		[isLoaded, status, sendMessage],
	);

	useEffect(() => {
		registerChatHandler(handleInjectPrompt);
		return () => {
			unregisterChatHandler();
		};
	}, [registerChatHandler, unregisterChatHandler, handleInjectPrompt]);

	const contextValue = useMemo(
		() => ({
			...chatHelpers,
			messages,
			chatId,
			input,
			setInput,
			inputRef,
			hasMessages,
			isLoaded,
			clearChat,
		}),
		[
			chatHelpers,
			messages,
			chatId,
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

function Chat({ children }: { children: React.ReactNode }) {
	const store = useMemo(() => createChatStore([]), []);

	return (
		<ChatStoreProvider store={store}>
			<ChatInner>{children}</ChatInner>
		</ChatStoreProvider>
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
			{/* Messages - Scrollable area with padding for input + gradient */}
			<div className="flex-1 overflow-y-auto pt-3 sm:pt-4 pb-32">
				<div className="px-3 sm:px-4">
					{!isLoaded ? (
						<div className="flex items-center justify-center p-3 sm:p-4 min-h-[60vh]">
							<Loading />
						</div>
					) : (
						<>
							<Chat.Messages />
							{!hasMessages && (
								<div className="flex flex-col items-center justify-center p-3 sm:p-4 min-h-[60vh]">
									<Chat.Welcome />
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Input - Fixed at bottom with gradient fade */}
			<div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
				{/* Smooth gradient fade from transparent to bg */}
				<div className="h-12 bg-gradient-to-t from-background via-background/60 to-transparent" />

				<div className="bg-background px-3 sm:px-4 pb-2 sm:pb-3 pointer-events-auto">
					<Chat.Input />
				</div>
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
