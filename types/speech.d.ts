/**
 * Web Speech API types - shared for speech recognition components
 * @see https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api
 */

declare global {
	interface SpeechRecognitionAlternative {
		readonly transcript: string;
		readonly confidence: number;
	}

	interface SpeechRecognitionResult {
		readonly length: number;
		readonly isFinal: boolean;
		item(index: number): SpeechRecognitionAlternative;
		[index: number]: SpeechRecognitionAlternative;
	}

	interface SpeechRecognitionResultList {
		readonly length: number;
		item(index: number): SpeechRecognitionResult;
		[index: number]: SpeechRecognitionResult;
	}

	interface SpeechRecognitionEvent extends Event {
		readonly resultIndex: number;
		readonly results: SpeechRecognitionResultList;
	}

	interface SpeechRecognitionErrorEvent extends Event {
		readonly error: string;
	}

	interface SpeechRecognition extends EventTarget {
		continuous: boolean;
		interimResults: boolean;
		lang: string;
		start(): void;
		stop(): void;
		onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
		onend: ((this: SpeechRecognition, ev: Event) => void) | null;
		onresult:
			| ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
			| null;
		onerror:
			| ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
			| null;
	}

	interface Window {
		SpeechRecognition?: new () => SpeechRecognition;
		webkitSpeechRecognition?: new () => SpeechRecognition;
	}
}

export {};
