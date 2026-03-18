"use client";

import { ResumeView } from "@/components/resume";
import { resume } from "@/lib/resume";
import { Header } from "@/components/header";

export default function Page() {
	return (
		<>
			<Header />
			<main className="container pt-[calc(env(safe-area-inset-top)+3.75rem)] sm:pt-[calc(env(safe-area-inset-top)+4.75rem)] print:pt-0">
				<ResumeView data={resume} />
			</main>
		</>
	);
}
