"use client";

import { ResumeView } from "@/components/resume";
import { resume } from "@/lib/resume";
import { Header } from "@/components/header";

export default function Page() {
	return (
		<>
			<Header />
			<main className="container pt-[calc(env(safe-area-inset-top)+5rem+var(--install-strip-height,0px))] sm:pt-[calc(env(safe-area-inset-top)+5.5rem+var(--install-strip-height,0px))] print:pt-0">
				<ResumeView data={resume} />
			</main>
		</>
	);
}
