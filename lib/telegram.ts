type MonitorEvent =
	| { type: "rate_limit"; ip: string; limit: number; remaining: number; reset: number }
	| { type: "bad_request"; ip: string; reason: string; messageCount: number | null }
	| { type: "validation_error"; ip: string; reason: string; messageCount: number }
	| { type: "api_error"; ip: string; model: string; messageCount: number; error: string };

const LABEL: Record<MonitorEvent["type"], string> = {
	rate_limit: "Rate limit exceeded",
	bad_request: "Bad request",
	validation_error: "Validation error",
	api_error: "API error",
};

function buildDetail(event: MonitorEvent): string {
	switch (event.type) {
		case "rate_limit":
			return [
				`Limit: ${event.limit}`,
				`Remaining: ${event.remaining}`,
				`Reset: ${new Date(event.reset).toISOString()}`,
			].join("\n");
		case "bad_request":
			return [
				`Reason: ${event.reason}`,
				`Message count: ${event.messageCount ?? "unparseable payload"}`,
			].join("\n");
		case "validation_error":
			return [`Reason: ${event.reason}`, `Message count: ${event.messageCount}`].join(
				"\n",
			);
		case "api_error":
			return [
				`Model: ${event.model}`,
				`Message count: ${event.messageCount}`,
				`Error: ${event.error}`,
			].join("\n");
	}
}

export async function notifyTelegram(event: MonitorEvent): Promise<void> {
	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!botToken || !chatId) {
		return;
	}

	const text = [
		`Resume Chat | ${LABEL[event.type]}`,
		`IP: ${event.ip}`,
		buildDetail(event),
		`Time: ${new Date().toISOString()}`,
	].join("\n");

	await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			chat_id: chatId,
			text,
			disable_web_page_preview: true,
		}),
	}).catch(() => {
			// Monitoring failures must never affect chat responses.
		});
}
