"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePromptInput } from "./prompt-area";

function getSpeechRecognition(): (new () => SpeechRecognition) | undefined {
	if (typeof window === "undefined") return undefined;
	return (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
		| (new () => SpeechRecognition)
		| undefined;
}

function capitalizeFirst(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SpeechToTextButton() {
	const { value, setValue, disabled } = usePromptInput();
	const valueRef = useRef(value);
	const [isListening, setIsListening] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	// Keep valueRef in sync for use in recognition callbacks
	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	const stopRecognition = useCallback(() => {
		const rec = recognitionRef.current;
		if (rec) {
			try {
				rec.stop();
			} catch {
				// Ignore if already stopped
			}
			recognitionRef.current = null;
		}
		setIsListening(false);
		setError(null);
	}, []);

	const startListening = useCallback(() => {
		const SpeechRecognition = getSpeechRecognition();
		if (!SpeechRecognition) {
			setError("Speech recognition is not supported in this browser.");
			return;
		}

		if (disabled) return;

		// Stop any existing recognition
		stopRecognition();

		try {
			const recognition = new SpeechRecognition();
			recognitionRef.current = recognition;

			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang =
				document.documentElement.lang || navigator.language || "en-US";

			recognition.onstart = () => {
				setIsListening(true);
				setError(null);
			};

			recognition.onresult = (event: SpeechRecognitionEvent) => {
				let finalTranscript = "";

				for (let i = event.resultIndex; i < event.results.length; i++) {
					const result = event.results[i];
					const transcript = result[0]?.transcript ?? "";

					if (result.isFinal) {
						finalTranscript += transcript;
					}
				}

				if (finalTranscript) {
					const normalized = capitalizeFirst(finalTranscript.trim());
					const currentValue = valueRef.current;
					const separator =
						currentValue && !currentValue.endsWith(" ") ? " " : "";
					setValue(currentValue + separator + normalized);
				}
			};

			recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
				const err = event.error;

				if (err === "aborted") {
					// User clicked stop or we called abort - not an error
					return;
				}

				if (err === "no-speech") {
					setError("No speech detected. Try again.");
					stopRecognition();
					return;
				}

				if (err === "not-allowed") {
					setError("Microphone permission denied.");
					stopRecognition();
					return;
				}

				if (err === "audio-capture") {
					setError("No microphone found.");
					stopRecognition();
					return;
				}

				if (err === "network") {
					setError("Network error. Check your connection.");
					stopRecognition();
					return;
				}

				if (err === "service-not-allowed") {
					setError("Speech recognition service is not allowed.");
					stopRecognition();
					return;
				}

				setError(`Speech recognition error: ${err}`);
				stopRecognition();
			};

			recognition.onend = () => {
				recognitionRef.current = null;
				setIsListening(false);
			};

			recognition.start();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to start speech recognition",
			);
			setIsListening(false);
		}
	}, [disabled, setValue, stopRecognition]);

	const handleClick = useCallback(() => {
		if (isListening) {
			stopRecognition();
		} else {
			startListening();
		}
	}, [isListening, startListening, stopRecognition]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stopRecognition();
		};
	}, [stopRecognition]);

	const isSupported = typeof window !== "undefined" && !!getSpeechRecognition();
	const isDisabled = disabled || !isSupported;

	const tooltipContent = error
		? error
		: isListening
			? "Click to stop listening"
			: !isSupported
				? "Speech recognition not supported"
				: "Speak to type";

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					className={cn(
						"rounded-full size-8 shrink-0 cursor-pointer",
						isListening && "text-destructive",
					)}
					onClick={handleClick}
					disabled={isDisabled}
					aria-label={tooltipContent}
					aria-pressed={isListening}
				>
					{isListening ? (
						<div className="relative flex items-center justify-center">
							<Mic className="size-4" />
							<span
								className="absolute inset-0 animate-ping rounded-full bg-destructive/20"
								aria-hidden
							/>
						</div>
					) : (
						<Mic className={cn("size-4", !isSupported && "opacity-50")} />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="top">{tooltipContent}</TooltipContent>
		</Tooltip>
	);
}
