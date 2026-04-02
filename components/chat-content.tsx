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
	useChatReset,
	useMessageCount,
} from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { ArrowUp, MessageSquareText, Plus, Square, X } from "lucide-react";
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
import { useWebHaptics } from "web-haptics/react";

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

const ASSISTANT_NAME = "Milo (Milind's Resume Butler)";

type ToolPart = {
	type: string;
	toolCallId?: string;
	state?: string;
	input?: unknown;
	output?: unknown;
	errorText?: string;
};

function toToolPart(part: unknown): ToolPart | null {
	if (!part || typeof part !== "object") return null;
	const candidate = part as Record<string, unknown>;
	if (typeof candidate.type !== "string" || !candidate.type.startsWith("tool-")) {
		return null;
	}
	return {
		type: candidate.type,
		toolCallId:
			typeof candidate.toolCallId === "string" ? candidate.toolCallId : undefined,
		state: typeof candidate.state === "string" ? candidate.state : undefined,
		input: candidate.input,
		output: candidate.output,
		errorText:
			typeof candidate.errorText === "string" ? candidate.errorText : undefined,
	};
}

const Message = memo(function Message({
	message,
}: {
	message: ExtendedUIMessage;
}) {
	const isUser = message.role === "user";
	const isAssistant = message.role === "assistant";

	const getToolName = (toolName: string): string => {
		return toolName;
	};

	// Extract all text content from the message for TTS
	const messageText = message.parts
		.filter(
			(
				part,
			): part is typeof part & {
				type: "text";
				text: string;
			} => part.type === "text" && typeof part.text === "string",
		)
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
						"relative overflow-hidden border px-3 py-2.5 sm:px-3.5 sm:py-3",
						isUser
							? "rounded-[1.4rem] rounded-br-md border-border/70 bg-primary text-primary-foreground"
							: "rounded-[1.4rem] rounded-bl-md border-border/70 bg-card/96 text-foreground shadow-sm",
					)}
				>
					{isAssistant && (
						<span
							className={cn(
								"mb-1 block px-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground text-left",
							)}
						>
							Milo
						</span>
					)}
					<div className="break-words">
						{message.parts.map((part, index) => {
							const toolPart = toToolPart(part);
							const partText =
								"text" in part && typeof part.text === "string"
									? part.text
									: undefined;

							if (part.type === "text") {
								return isUser ? (
									<p
										key={`text-${index}`}
										className="text-sm leading-relaxed whitespace-pre-wrap"
									>
										{partText}
									</p>
								) : (
									<Response key={`text-${index}`}>{partText}</Response>
								);
							}

							if (part.type === "reasoning" && message.role === "assistant") {
								return (
									<details key={`reasoning-${index}`} className="mb-2">
										<summary className="text-xs cursor-pointer hover:opacity-80 transition-opacity italic">
											{part.type.toSentenceCase()}
										</summary>
										<div className="text-xs mt-2 pl-2 italic whitespace-pre-wrap opacity-80">
											{partText}
										</div>
									</details>
								);
							}

							// Tool parts - combined tool execution (has both input and output)
							if (
								toolPart &&
								toolPart.toolCallId
							) {
								const toolNameFromType = toolPart.type.replace("tool-", "") || "Tool";
								const isError = toolPart.state === "output-error";

								return (
									<details key={toolPart.toolCallId} className="mb-2">
										<summary className="text-xs cursor-pointer hover:opacity-80 transition-opacity italic">
											<span>{getToolName(toolNameFromType)}</span>
											{isError && "[Errored]"}
										</summary>
										<div className="text-xs mt-2 pl-2 flex flex-col space-y-2 whitespace-pre-wrap opacity-80">
												{toolPart.input !== undefined && (
												<div className=" flex flex-col space-y-2">
													<strong className="font-mono font-medium tracking-widest uppercase">
														Parameters
													</strong>
													<pre className="bg-muted/50 p-2 rounded-md border whitespace-pre-wrap">
														<code>{JSON.stringify(toolPart.input, null, 2)}</code>
													</pre>
												</div>
											)}
												{toolPart.output !== undefined && (
												<div className=" flex flex-col space-y-2">
													<strong className="font-mono font-medium tracking-widest uppercase">
														{isError ? "Error" : "Result"}
													</strong>
													<pre className="bg-muted/50 p-2 rounded-md border whitespace-pre-wrap">
														<code>
															{typeof toolPart.output === "object"
																? JSON.stringify(toolPart.output, null, 2)
																: String(toolPart.output)}
														</code>
													</pre>
													{toolPart.errorText && <p>{toolPart.errorText}</p>}
												</div>
											)}
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
	const { messages, status, hasMessages, isLoaded } = useChatContext();
	const { trigger } = useWebHaptics();
	const messageCount = useMessageCount();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const prevMessageCountRef = useRef(0);
	const shouldAutoScrollRef = useRef(true);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const lastAssistantMessageIdRef = useRef<string | null>(null);
	const hasTrackedInitialAssistantRef = useRef(false);

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

	useEffect(() => {
		const lastAssistantMessage = [...messages]
			.reverse()
			.find((message) => message.role === "assistant");

		if (!isLoaded) return;

		if (!hasTrackedInitialAssistantRef.current) {
			lastAssistantMessageIdRef.current = lastAssistantMessage?.id ?? null;
			hasTrackedInitialAssistantRef.current = true;
			return;
		}

		if (
			status === "ready" &&
			lastAssistantMessage?.id &&
			lastAssistantMessage.id !== lastAssistantMessageIdRef.current
		) {
			lastAssistantMessageIdRef.current = lastAssistantMessage.id;
			void trigger("soft", { intensity: 0.5 });
		}
	}, [isLoaded, messages, status, trigger]);

	if (!hasMessages) return null;

	return (
		<div
			ref={scrollContainerRef}
			className="w-full space-y-4 px-2 pb-24 pt-2 sm:px-3"
		>
			{chatItems.map((item, index) => {
				if (item.type === "date-separator") {
					return (
						<div
							key={`date-${item.timestamp}`}
							className="flex justify-center py-2"
						>
							<div className="rounded-full border border-border/60 bg-background/88 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
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
	const { trigger } = useWebHaptics();

	if (hasMessages) return null;

	const starterPrompts = [
		"Summarize this resume",
		"What's the background?",
		"Tell me about recent projects",
		"What are the key skills?",
		"What's the work experience?",
	];

	const handlePromptClick = (prompt: string) => {
		void trigger("rigid", { intensity: 0.9 });
		sendMessage({ text: prompt });
	};

	return (
		<motion.div
			className="mb-4 text-center sm:mb-5"
			animate={{ opacity: hasMessages ? 0 : 1 }}
			transition={{ duration: 0.3 }}
		>
			<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-border/70 bg-background/92 text-primary shadow-sm">
				<MessageSquareText className="size-6" />
			</div>
			<h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground @md:text-[1.7rem]">
				Ask Milo for context
			</h1>
			<p className="mx-auto mb-4 max-w-[28ch] text-base text-muted-foreground @md:text-sm">
				Ask about projects, metrics, design work, stack choices, or how each role connects.
			</p>

			<div className="mx-auto flex max-w-lg flex-wrap justify-center gap-2">
				{starterPrompts.map((prompt) => (
					<button
						type="button"
						key={prompt}
						onClick={() => handlePromptClick(prompt)}
						className="cursor-pointer rounded-full border border-border/70 bg-background/84 px-3.5 py-2 text-base text-foreground transition-colors hover:bg-accent hover:border-accent-foreground/20 sm:text-sm"
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
		<motion.div layout="position" className="mb-2 flex justify-end">
			<button
				type="button"
				onClick={clearChat}
				aria-label="Clear chat history"
				className="cursor-pointer rounded-full border border-border/70 bg-background/84 px-3 py-1.5 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:text-sm"
				title="Clear chat history"
			>
				Start new chat
			</button>
		</motion.div>
	);
}

function ChatSidebarHeader() {
	const { hasMessages, clearChat } = useChatContext();
	const { close } = useSidebarActions();
	const { trigger } = useWebHaptics();

	return (
		<header className="shrink-0 border-b border-border/70 bg-background/82 supports-[backdrop-filter]:backdrop-blur-xl">
			<div className="px-4 py-3">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2 min-w-0">
						<div className="min-w-0">
							<span className="block text-base font-semibold tracking-tight text-foreground sm:text-sm">
								Milo
							</span>
							<span className="block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
								Resume copilot
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{hasMessages && (
							<button
								type="button"
								onClick={() => {
									void trigger("light", { intensity: 0.35 });
									void clearChat();
								}}
								aria-label="Start new chat"
								title="Start new chat"
								className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/88 transition-colors hover:bg-accent"
							>
								<Plus className="size-4" />
							</button>
						)}
						<button
							type="button"
							onClick={() => {
								void trigger("light", { intensity: 0.45 });
								close();
							}}
							aria-label="Close chat sidebar"
							title="Close chat sidebar"
							className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/88 transition-colors hover:bg-accent"
						>
							<X className="size-4" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}

function Input() {
	const { sendMessage, status, stop, input, setInput } = useChatContext();
	const { trigger } = useWebHaptics();

	const handleSubmit = useCallback(() => {
		if (input.trim() && status === "ready") {
			void trigger("rigid", { intensity: 0.9 });
			sendMessage({ text: input });
			setInput("");
		}
	}, [input, sendMessage, setInput, status, trigger]);

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
					className="px-2 py-2"
				>
					<div className="flex items-end gap-2">
						<div className="flex-1 min-w-0">
							<PromptInputTextarea
								placeholder="Ask something about Milind's work..."
								className="min-h-10 px-2"
							/>
						</div>
						<PromptInputActions>
							<Button
								type={status === "ready" ? "submit" : "button"}
								size="icon"
								onClick={(e) => {
									if (status === "submitted") {
										e.preventDefault();
										void trigger("soft", { intensity: 0.7 });
										stop();
									}
								}}
								disabled={status === "ready" && !input.trim()}
								className="size-10 shrink-0 cursor-pointer shadow-sm disabled:cursor-not-allowed"
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
	const chatOptions = {
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	};
	const chatHelpers = useChat<ExtendedUIMessage>(
		chatOptions as unknown as NonNullable<Parameters<typeof useChat<ExtendedUIMessage>>[0]>,
	);
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
	} = chatHelpers;
	const reset = useChatReset();

	const clearChat = useCallback(async () => {
		try {
			// Stop any in-flight stream first
			stop();
			// Clear persisted storage
			await clearMessages();
			// Full store reset: messages, status, error, throttled state, etc.
			reset();
			// Clear local input state
			setInput("");
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.warn("Failed to clear chat:", error);
			}
		}
	}, [stop, reset]);

	// Load messages on mount (non-blocking)
	useEffect(() => {
		let mounted = true;
		let timeoutId: NodeJS.Timeout;

		const loadPersistedMessages = async () => {
			try {
				const persistedMessages = await loadMessages();
				if (mounted && persistedMessages && persistedMessages.length > 0) {
					setMessages(persistedMessages);
				}
			} catch (error) {
				if (process.env.NODE_ENV !== "production") {
					console.warn("Failed to load persisted messages:", error);
				}
			} finally {
				if (mounted) {
					setIsLoaded(true);
				}
			}
		};

		timeoutId = setTimeout(loadPersistedMessages, 0);

		return () => {
			mounted = false;
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, []);

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
	const needsNormalization = messages.some((msg) => !msg.createdAt);

	useEffect(() => {
		if (!isLoaded || messageCount === 0 || !needsNormalization) return;

		const baseTime = Date.now();
		setMessages((prev) =>
			prev.map((msg, index) => ({
				...msg,
				createdAt: msg.createdAt ?? baseTime + index,
			})),
		);
	}, [isLoaded, messageCount, needsNormalization]);

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
			<div className="flex-1 overflow-y-auto pb-36 pt-4">
				<div className="px-4">
					{!isLoaded ? (
						<div className="flex min-h-[60vh] items-center justify-center p-4">
							<Loading />
						</div>
					) : (
						<>
							<Chat.Messages />
							{!hasMessages && (
								<div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
									<Chat.Welcome />
								</div>
							)}
						</>
					)}
				</div>
			</div>

			<div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
				<div className="h-16 bg-linear-to-t from-background via-background/70 to-transparent" />

				<div className="bg-background/90 px-4 pb-3 pointer-events-auto supports-[backdrop-filter]:backdrop-blur-xl">
					<Chat.Input />
				</div>
			</div>
		</div>
	);
}

export function ChatContent() {
	return (
		<Chat>
			<div className="flex h-full min-h-0 flex-col">
				<ChatSidebarHeader />
				<div className="chat-sidebar-scroll flex-1 min-h-0 overflow-y-auto bg-sidebar">
					<ChatContentLayout />
				</div>
			</div>
		</Chat>
	);
}
