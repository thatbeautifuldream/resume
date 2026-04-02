"use client";

import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { cn } from "@/lib/utils";
import { Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";

const INSTALL_STRIP_HEIGHT_VAR = "--install-strip-height";

export function InstallStrip() {
	const { canInstall, dismiss, hasPrompt, isIos, promptToInstall } =
		usePwaInstall();
	const { trigger } = useWebHaptics();
	const [showIosHelp, setShowIosHelp] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!canInstall || !ref.current) {
			document.documentElement.style.setProperty(INSTALL_STRIP_HEIGHT_VAR, "0px");
			return;
		}

		const element = ref.current;
		const updateHeight = () => {
			document.documentElement.style.setProperty(
				INSTALL_STRIP_HEIGHT_VAR,
				`${element.offsetHeight}px`,
			);
		};

		updateHeight();
		const observer = new ResizeObserver(updateHeight);
		observer.observe(element);

		return () => {
			observer.disconnect();
			document.documentElement.style.setProperty(INSTALL_STRIP_HEIGHT_VAR, "0px");
		};
	}, [canInstall, showIosHelp]);

	if (!canInstall) return null;

	const handlePrimaryAction = async () => {
		if (hasPrompt) {
			const installed = await promptToInstall();
			void trigger(installed ? "success" : "selection", {
				intensity: installed ? 0.8 : 0.55,
			});
			return;
		}

		if (isIos) {
			void trigger("selection", { intensity: 0.55 });
			setShowIosHelp((current) => !current);
		}
	};

	return (
		<div
			ref={ref}
			className="border-t border-border/70 bg-muted/35"
		>
			<div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
				<div className="min-w-0">
					<p className="text-base font-medium tracking-tight sm:text-sm">
						Install this resume as an app for faster launch and offline access.
					</p>
					<p
						className={cn(
							"text-base text-muted-foreground sm:text-sm",
							!showIosHelp && isIos && "hidden",
						)}
					>
						{isIos
							? "In Safari, tap Share, then choose Add to Home Screen."
							: "Use the install prompt to add it to your home screen or desktop."}
					</p>
				</div>
				<div className="flex items-center gap-2 self-end sm:self-auto">
					<Button
						size="sm"
						onClick={handlePrimaryAction}
						className="rounded-full px-4"
					>
						<Download className="size-4" />
						{hasPrompt ? "Install App" : "How to Install"}
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label="Dismiss install prompt"
						onClick={() => {
							void trigger("light", { intensity: 0.35 });
							dismiss();
						}}
						className="rounded-full"
					>
						<X className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
