"use client";

import { Button } from "@/components/ui/button";
import { useAppHaptics } from "@/hooks/use-app-haptics";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { cn } from "@/lib/utils";
import { Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const INSTALL_STRIP_HEIGHT_VAR = "--install-strip-height";

export function InstallStrip() {
	const { canInstall, dismiss, hasPrompt, isIos, promptToInstall } =
		usePwaInstall();
	const { trigger } = useAppHaptics();
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
			className="border-t bg-muted/60 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur"
		>
			<div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0">
					<p className="text-sm font-medium">
						Install this resume as an app for faster launch and offline access.
					</p>
					<p
						className={cn(
							"text-xs text-muted-foreground",
							!showIosHelp && isIos && "hidden",
						)}
					>
						{isIos
							? "In Safari, tap Share, then choose Add to Home Screen."
							: "Use the install prompt to add it to your home screen or desktop."}
					</p>
				</div>
				<div className="flex items-center gap-2 self-end sm:self-auto">
					<Button size="sm" onClick={handlePrimaryAction}>
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
					>
						<X className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
