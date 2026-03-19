"use client";

import { useEffect, useMemo, useState } from "react";

const INSTALL_STRIP_DISMISSED_KEY = "resume-pwa-install-strip-dismissed-v1";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
}

function isStandaloneMode() {
	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		Boolean(
			(window.navigator as Navigator & { standalone?: boolean }).standalone,
		)
	);
}

function isIosSafari() {
	const ua = window.navigator.userAgent;
	const isIOSDevice =
		/iPad|iPhone|iPod/.test(ua) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
	const isWebKit = /WebKit/i.test(ua);
	const isOtherIOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
	return isIOSDevice && isWebKit && !isOtherIOSBrowser;
}

export function usePwaInstall() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isIos, setIsIos] = useState(false);
	const [isDismissed, setIsDismissed] = useState(true);

	useEffect(() => {
		setIsInstalled(isStandaloneMode());
		setIsIos(isIosSafari());
		setIsDismissed(
			window.localStorage.getItem(INSTALL_STRIP_DISMISSED_KEY) === "true",
		);

		const mediaQuery = window.matchMedia("(display-mode: standalone)");
		const handleDisplayModeChange = (event: MediaQueryListEvent) => {
			setIsInstalled(event.matches);
		};
		const handleBeforeInstallPrompt = (event: Event) => {
			event.preventDefault();
			setDeferredPrompt(event as BeforeInstallPromptEvent);
		};
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		};

		mediaQuery.addEventListener("change", handleDisplayModeChange);

		window.addEventListener(
			"beforeinstallprompt",
			handleBeforeInstallPrompt as EventListener,
		);
		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			mediaQuery.removeEventListener("change", handleDisplayModeChange);
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt as EventListener,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const dismiss = () => {
		window.localStorage.setItem(INSTALL_STRIP_DISMISSED_KEY, "true");
		setIsDismissed(true);
	};

	const promptToInstall = async () => {
		if (!deferredPrompt) return false;

		await deferredPrompt.prompt();
		const choice = await deferredPrompt.userChoice;
		setDeferredPrompt(null);
		if (choice.outcome === "accepted") {
			setIsInstalled(true);
		}
		return choice.outcome === "accepted";
	};

	const canInstall = useMemo(
		() => !isInstalled && !isDismissed && (Boolean(deferredPrompt) || isIos),
		[deferredPrompt, isDismissed, isInstalled, isIos],
	);

	return {
		canInstall,
		isIos,
		hasPrompt: Boolean(deferredPrompt),
		dismiss,
		promptToInstall,
	};
}
