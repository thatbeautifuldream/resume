import type { UIMessage } from "ai";

export const MAX_CHAT_MESSAGES = 30;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_TOTAL_CONTEXT = 20000;

export type ChatValidationResult =
	| { valid: true }
	| { valid: false; reason: string };

export function validateChatMessages(messages: UIMessage[]): ChatValidationResult {
	let totalLength = 0;

	for (const [index, message] of messages.entries()) {
		if (message.role !== "user" && message.role !== "assistant") {
			return {
				valid: false,
				reason: `message[${index}] has invalid role "${message.role}"`,
			};
		}

		if (!Array.isArray(message.parts)) {
			return {
				valid: false,
				reason: `message[${index}] is missing a parts array`,
			};
		}

		let messageLength = 0;

		for (const part of message.parts) {
			if (part.type !== "text") {
				continue;
			}

			if (typeof part.text !== "string") {
				return {
					valid: false,
					reason: `message[${index}] has a non-string text part`,
				};
			}

			if (message.role === "user" && part.text.trim().length === 0) {
				return {
					valid: false,
					reason: `message[${index}] is an empty user message`,
				};
			}

			messageLength += part.text.length;
		}

		if (messageLength > MAX_MESSAGE_LENGTH) {
			return {
				valid: false,
				reason: `message[${index}] length ${messageLength} exceeds ${MAX_MESSAGE_LENGTH}`,
			};
		}

		totalLength += messageLength;
	}

	if (totalLength > MAX_TOTAL_CONTEXT) {
		return {
			valid: false,
			reason: `total context length ${totalLength} exceeds ${MAX_TOTAL_CONTEXT}`,
		};
	}

	return { valid: true };
}
