const RATE_LIMIT_MESSAGES = [
	"That was fast. The resume concierge just put up a velvet rope. Give it a bit, then come back with your next question.",
	"Milind's resume assistant is taking a short coffee break from rapid-fire questions. Try again in a little while.",
	"You've reached the chat limit for this window. Consider it a polite nudge to actually read the resume for a minute.",
	"The resume desk has temporarily paused new questions. Give it some time and the chat will open back up.",
	"We've hit the per-IP question budget for now. The assistant will be back after a short cooldown.",
	"Chat traffic is a little too enthusiastic right now. Take a breather, then try your next question shortly.",
	"The resume butler has capped this conversation for the moment. Come back after the cooldown and it will pick up again.",
	"Question quota reached. The assistant is still employed, just temporarily unavailable for extra rapid rounds.",
] as const;

export function getRandomRateLimitMessage(): string {
	return RATE_LIMIT_MESSAGES[
		Math.floor(Math.random() * RATE_LIMIT_MESSAGES.length)
	];
}
