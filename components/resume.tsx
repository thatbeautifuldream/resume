"use client";

import {
	useSidebarActions,
	useSidebarOpen,
} from "@/components/providers/chat-sidebar-store";
import {
	registerJsonToggleHandler,
	unregisterJsonToggleHandler,
} from "@/components/providers/keyboard-shortcuts";
import { calculateDuration, formatDate, range, rangeCompact } from "@/lib/format";
import type {
	Basics,
	Certificates,
	Contribution,
	Education,
	Profile,
	Project,
	Reference,
	Resume,
	Skill,
	Talks,
	Work,
} from "@/lib/resume-schema";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";
import type * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWebHaptics } from "web-haptics/react";

const SyntaxHighlighter = dynamic(
	() =>
		import("react-syntax-highlighter").then((mod) => ({ default: mod.Prism })),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center py-12 text-base text-muted-foreground sm:text-sm">
				Loading code viewer...
			</div>
		),
	},
);

let vsTheme: typeof import("react-syntax-highlighter/dist/esm/styles/prism").vs;
let vscDarkPlusTheme: typeof import("react-syntax-highlighter/dist/esm/styles/prism").vscDarkPlus;

const loadThemes = async () => {
	if (!vsTheme || !vscDarkPlusTheme) {
		const themes = await import("react-syntax-highlighter/dist/esm/styles/prism");
		vsTheme = themes.vs;
		vscDarkPlusTheme = themes.vscDarkPlus;
	}
};

const COPIED_DISPLAY_DURATION_MS = 1800;

function SectionEyebrow({
	title,
	rightContent,
}: {
	title: string;
	rightContent?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
			<div className="space-y-2">
				<div className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-primary">
					{title}
				</div>
				<div className="h-px w-16 bg-primary/45" />
			</div>
			{rightContent ? (
				<div className="text-base text-muted-foreground sm:text-sm">
					{rightContent}
				</div>
			) : null}
		</div>
	);
}

function ResumeSection({
	title,
	rightContent,
	children,
}: {
	title: string;
	rightContent?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-[1.85rem] border border-border/75 bg-card/92 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">
			<div className="space-y-5">
				<SectionEyebrow title={title} rightContent={rightContent} />
				<div>{children}</div>
			</div>
		</section>
	);
}

function ResumeFooter({ source }: { source: string }) {
	const sourceLink = source.startsWith("http") ? source : `https://${source}`;

	return (
		<footer className="pb-4 pt-2 text-center">
			<p className="text-base text-muted-foreground sm:text-sm">
				Source:{" "}
				<a href={sourceLink} target="_blank" rel="noopener noreferrer">
					{source}
				</a>
			</p>
		</footer>
	);
}

function ProfileLinkWithNetwork({ profile }: { profile: Profile }) {
	const getNetworkLabel = (network: string, username?: string) => {
		const n = network.toLowerCase();
		if (n.includes("github")) return `gh/${username || ""}`;
		if (n.includes("twitter") || n === "x") return `x/${username || ""}`;
		if (n.includes("linkedin")) return `li/${username || ""}`;
		if (n.includes("youtube")) return `yt/${username || ""}`;
		if (n.includes("cal")) return `cal/${username || ""}`;
		return username || profile.url || network;
	};

	const label = getNetworkLabel(profile.network || "", profile.username);
	const rawHref = profile.url || "#";
	const href =
		rawHref !== "#"
			? rawHref.startsWith("http")
				? rawHref
				: `https://${rawHref}`
			: "#";

	return href !== "#" ? (
		<Link href={href} target="_blank" rel="noreferrer">
			{label}
		</Link>
	) : (
		<span>{label}</span>
	);
}

function EmailWithCopy({ email }: { email: string }) {
	const [displayText, setDisplayText] = useState(email);
	const { trigger } = useWebHaptics();

	const handleClick = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(email);
			void trigger("success", { intensity: 0.8 });
			setDisplayText("Copied to clipboard");
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.warn("Failed to copy email:", error);
			}
		}
	}, [email, trigger]);

	useEffect(() => {
		if (displayText !== "Copied to clipboard") return;
		const timeout = setTimeout(
			() => setDisplayText(email),
			COPIED_DISPLAY_DURATION_MS,
		);
		return () => clearTimeout(timeout);
	}, [displayText, email]);

	return (
		<button
			type="button"
			onClick={handleClick}
			className="cursor-pointer bg-transparent p-0 text-inherit transition-colors hover:text-foreground"
			title={`Copy ${email}`}
		>
			{displayText}
		</button>
	);
}

function ResumeHeaderItem({
	basics,
	totalExperience,
	projectCount,
}: {
	basics: Basics;
	totalExperience?: string;
	projectCount: number;
}) {
	const contactItems: { key: string; element: React.ReactNode }[] = [];

	if (basics.email) {
		contactItems.push({
			key: "email",
			element: <EmailWithCopy email={basics.email} />,
		});
	}

	if (basics.url) {
		const urlHref = basics.url.startsWith("http")
			? basics.url
			: `https://${basics.url}`;
		contactItems.push({
			key: "url",
			element: (
				<Link href={urlHref} target="_blank" rel="noreferrer">
					{basics.url}
				</Link>
			),
		});
	}

	if (basics.profiles) {
		basics.profiles.forEach((profile) => {
			contactItems.push({
				key: profile.network || profile.url || "",
				element: <ProfileLinkWithNetwork profile={profile} />,
			});
		});
	}

	const metaItems = [
		basics.label,
		basics.location?.city ? `${basics.location.city}, ${basics.location.countryCode}` : undefined,
		basics.timezone,
	].filter(Boolean);

	const statCards = [
		{ label: "Experience", value: totalExperience || "3+ years" },
		{ label: "Projects", value: `${projectCount}` },
		{ label: "Focus", value: "AI-native product UI" },
	];

	return (
		<section className="grain-overlay overflow-hidden rounded-[2rem] border border-border/75 bg-card/96 shadow-[var(--page-shadow)]">
			<div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,3fr)_minmax(17rem,1.4fr)] lg:gap-10">
				<div className="space-y-6">
					<div className="space-y-4">
						<div className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-primary">
							Product engineer • design systems • motion
						</div>
						<div className="space-y-3">
							<h1 className="max-w-[14ch] text-4xl font-semibold tracking-tight text-foreground sm:text-[2.8rem]">
								{basics.name}
							</h1>
							<p className="max-w-[48ch] text-base text-muted-foreground sm:text-sm">
								I design and ship ambitious product interfaces that make AI
								workflows feel clear, quick, and deeply usable.
							</p>
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						{metaItems.map((item) => (
							<div
								key={item}
								className="rounded-full border border-border/70 bg-background/72 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground"
							>
								{item}
							</div>
						))}
					</div>

					<div className="flex flex-wrap gap-2.5 text-base text-muted-foreground sm:text-sm">
						{contactItems.map((item) => (
							<div
								key={item.key}
								className="rounded-full border border-border/70 bg-background/72 px-3 py-2 transition-colors hover:border-primary/35 hover:text-foreground"
							>
								{item.element}
							</div>
						))}
					</div>
				</div>

				<div className="space-y-3 self-end">
					{statCards.map((stat) => (
						<div
							key={stat.label}
							className="rounded-[1.4rem] border border-border/70 bg-background/82 p-4"
						>
							<div className="text-[0.72rem] font-mono uppercase tracking-[0.2em] text-muted-foreground">
								{stat.label}
							</div>
							<div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
								{stat.value}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function ProofLinks({
	itemName,
	links,
}: {
	itemName: string;
	links?: Array<{ label: string; url: string }>;
}) {
	if (!links?.length) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{links.map((link) => {
				const href = link.url.startsWith("http")
					? link.url
					: `https://${link.url}`;
				return (
					<a
						key={`${itemName}-${link.label}`}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-full border border-border/70 bg-background/76 px-3 py-1.5 text-base text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground sm:text-sm"
					>
						{link.label}
					</a>
				);
			})}
		</div>
	);
}

function WorkExperienceItem({ item }: { item: Work }) {
	const duration = calculateDuration(item.startDate, item.endDate);
	const isPresent = !item.endDate;

	return (
		<article className="grid gap-4 border-b border-border/65 pb-6 last:border-b-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
			<div className="space-y-2">
				<div className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-primary">
					{item.workType || "Role"}
				</div>
				<div className="space-y-1 text-base text-muted-foreground sm:text-sm">
					<div>{range(item.startDate, item.endDate)}</div>
					{duration ? (
						<div className={isPresent ? "print:hidden" : undefined}>{duration}</div>
					) : null}
					{item.location ? <div>{item.location}</div> : null}
				</div>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-xl">
						{item.position || "Role"}
					</h3>
					<div className="text-lg text-muted-foreground sm:text-base">
						{item.name}
					</div>
					{item.summary ? (
						<p className="max-w-[64ch] text-base text-foreground/88 sm:text-sm">
							{item.summary}
						</p>
					) : null}
				</div>

				{!!item.highlights?.length && (
					<ul className="list-disc space-y-2 pl-5 text-base text-foreground/88 sm:text-sm" role="list">
						{item.highlights.map((highlight) => (
							<li key={highlight} className="text-pretty">
								{highlight}
							</li>
						))}
					</ul>
				)}

				<ProofLinks itemName={item.name || item.position || "work"} links={item.proofLinks} />
			</div>
		</article>
	);
}

function ProjectPortfolioItem({ item }: { item: Project }) {
	const dateDisplay = item.date
		? formatDate(item.date)
		: range(item.startDate, item.endDate);
	const urlHref = item.url
		? item.url.startsWith("http")
			? item.url
			: `https://${item.url}`
		: undefined;

	return (
		<article className="rounded-[1.5rem] border border-border/70 bg-background/72 p-5">
			<div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-primary">
						Selected build
					</div>
					{urlHref ? (
						<a
							href={urlHref}
							target="_blank"
							rel="noreferrer"
							className="text-2xl font-semibold tracking-tight text-foreground hover:text-primary sm:text-xl"
						>
							{item.name}
						</a>
					) : (
						<h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-xl">
							{item.name}
						</h3>
					)}
					{item.description ? (
						<p className="max-w-[62ch] text-base text-muted-foreground sm:text-sm">
							{item.description}
						</p>
					) : null}
				</div>
				<div className="rounded-full border border-border/65 bg-card/80 px-3 py-1.5 text-base text-muted-foreground sm:text-sm">
					{dateDisplay}
				</div>
			</div>

			<div className="mt-4 space-y-4">
				<div className="flex flex-wrap gap-2 text-base text-muted-foreground sm:text-sm">
					{item.role ? (
						<div className="rounded-full border border-border/65 px-3 py-1.5">
							Role · {item.role}
						</div>
					) : null}
					{item.teamSize ? (
						<div className="rounded-full border border-border/65 px-3 py-1.5">
							Team · {item.teamSize}
						</div>
					) : null}
					{item.duration ? (
						<div className="rounded-full border border-border/65 px-3 py-1.5">
							Duration · {item.duration}
						</div>
					) : null}
					{item.status ? (
						<div className="rounded-full border border-border/65 px-3 py-1.5">
							Status · {item.status}
						</div>
					) : null}
				</div>

				{!!item.impactMetrics?.length && (
					<div className="grid gap-3 sm:grid-cols-2">
						{item.impactMetrics.map((metric) => (
							<div
								key={`${item.name}-${metric.label}`}
								className="rounded-[1.2rem] border border-border/65 bg-card/84 p-4"
								title={metric.window}
							>
								<div className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground">
									{metric.label}
								</div>
								<div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
									{metric.value}
								</div>
								{metric.window ? (
									<div className="mt-1 text-base text-muted-foreground sm:text-sm">
										{metric.window}
									</div>
								) : null}
							</div>
						))}
					</div>
				)}

				{!!item.highlights?.length && (
					<ul className="list-disc space-y-2 pl-5 text-base text-foreground/88 sm:text-sm" role="list">
						{item.highlights.map((highlight) => (
							<li key={highlight} className="text-pretty">
								{highlight}
							</li>
						))}
					</ul>
				)}

				<ProofLinks itemName={item.name} links={item.proofLinks} />
			</div>
		</article>
	);
}

function EducationCredentialItem({ item }: { item: Education }) {
	const dateDisplay = item.endDate
		? formatDate(item.endDate)
		: range(item.startDate, item.endDate);
	const urlHref = item.url
		? item.url.startsWith("http")
			? item.url
			: `https://${item.url}`
		: undefined;

	return (
		<article className="flex flex-col gap-3 rounded-[1.4rem] border border-border/70 bg-background/72 p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-1">
				<div className="text-lg font-semibold tracking-tight text-foreground sm:text-base">
					{urlHref ? (
						<a href={urlHref} target="_blank" rel="noopener noreferrer">
							{item.institution}
						</a>
					) : (
						item.institution
					)}
				</div>
				<div className="text-base text-muted-foreground sm:text-sm">
					{item.studyType}
				</div>
			</div>
			<div className="text-base text-muted-foreground sm:text-sm">{dateDisplay}</div>
		</article>
	);
}

function CertificateAchievementItem({ item }: { item: Certificates }) {
	const urlHref = item.url
		? item.url.startsWith("http")
			? item.url
			: `https://${item.url}`
		: undefined;

	return (
		<div className="rounded-full border border-border/70 bg-background/76 px-3 py-2 text-base text-foreground sm:text-sm">
			{urlHref ? (
				<a href={urlHref} target="_blank" rel="noopener noreferrer">
					{item.name}
				</a>
			) : (
				item.name
			)}
			{item.issuer ? ` · ${item.issuer}` : ""}
			{item.date ? ` · ${item.date}` : ""}
		</div>
	);
}

function OpenSourceContributionItem({ item }: { item: Contribution }) {
	const href = item.url.startsWith("http") ? item.url : `https://${item.url}`;

	return (
		<article className="flex flex-col gap-2 rounded-[1.3rem] border border-border/70 bg-background/72 p-4 sm:flex-row sm:items-center sm:justify-between">
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="text-base text-foreground hover:text-primary sm:text-sm"
			>
				{item.title}
			</a>
			<div className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
				OSS contribution
			</div>
		</article>
	);
}

function TalkPresentationItem({ item }: { item: Talks }) {
	const href = item.link
		? item.link.startsWith("http")
			? item.link
			: `https://${item.link}`
		: undefined;

	return (
		<article className="flex flex-col gap-2 rounded-[1.3rem] border border-border/70 bg-background/72 p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-1">
				<div className="text-base font-medium text-foreground sm:text-sm">
					{href ? (
						<a href={href} target="_blank" rel="noopener noreferrer">
							{item.title}
						</a>
					) : (
						item.title
					)}
				</div>
				<div className="text-base text-muted-foreground sm:text-sm">
					{item.organiser}
				</div>
			</div>
		</article>
	);
}

function SkillsProficiency({ skills }: { skills: Skill[] }) {
	const { sendPromptToChat } = useSidebarActions();
	const { trigger } = useWebHaptics();

	if (!skills?.length) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{skills.map((skill) => (
				<button
					type="button"
					key={skill}
					onClick={() => {
						const prompt = `Tell me about ${skill} - what is it, and how has Milind used this skill in his work? How proficient is he with ${skill}?`;
						void trigger("medium", { intensity: 0.75 });
						sendPromptToChat(prompt);
					}}
					className="cursor-pointer rounded-full border border-border/70 bg-background/76 px-3 py-2 text-base text-foreground transition-colors hover:border-primary/30 hover:text-primary sm:text-sm"
				>
					{skill}
				</button>
			))}
		</div>
	);
}

function ReferenceTestimonial({ items }: { items: Reference[] }) {
	if (!items?.length) return null;

	return (
		<div className="space-y-4">
			{items.map((reference) => (
				<blockquote
					key={reference.name}
					className="rounded-[1.4rem] border border-border/70 bg-background/72 p-5"
				>
					<div className="space-y-3">
						<p className="text-base italic text-foreground/88 sm:text-sm">
							{reference.reference}
						</p>
						<footer className="text-base text-muted-foreground sm:text-sm">
							{reference.name} · {reference.title}
						</footer>
					</div>
				</blockquote>
			))}
		</div>
	);
}

const DEFAULT_SECTION_ORDER: (keyof Resume)[] = [
	"work",
	"projects",
	"talks",
	"contributions",
	"certificates",
	"education",
	"skills",
	"references",
];

type ResumeSectionConfig = {
	title: string;
	render: (items: unknown) => React.ReactNode;
};

const SECTION_CONFIG: Partial<Record<keyof Resume, ResumeSectionConfig>> = {
	work: {
		title: "Experience",
		render: (items) => (
			<div className="space-y-6">
				{(items as Work[]).map((workItem) => (
					<WorkExperienceItem key={`${workItem.name}-${workItem.startDate}`} item={workItem} />
				))}
			</div>
		),
	},
	projects: {
		title: "Selected Projects",
		render: (items) => (
			<div className="space-y-4">
				{(items as Project[]).map((project) => (
					<ProjectPortfolioItem key={project.name} item={project} />
				))}
			</div>
		),
	},
	education: {
		title: "Education",
		render: (items) => (
			<div className="space-y-3">
				{(items as Education[]).map((educationItem) => (
					<EducationCredentialItem
						key={educationItem.institution}
						item={educationItem}
					/>
				))}
			</div>
		),
	},
	talks: {
		title: "Talks",
		render: (items) => (
			<div className="space-y-3">
				{(items as Talks[]).map((talk) => (
					<TalkPresentationItem key={talk.title} item={talk} />
				))}
			</div>
		),
	},
	contributions: {
		title: "Open Source",
		render: (items) => (
			<div className="space-y-3">
				{(items as Contribution[]).map((contribution) => (
					<OpenSourceContributionItem key={contribution.url} item={contribution} />
				))}
			</div>
		),
	},
	certificates: {
		title: "Certificates",
		render: (items) => (
			<div className="flex flex-wrap gap-2">
				{(items as Certificates[]).map((certificate) => (
					<CertificateAchievementItem key={certificate.name} item={certificate} />
				))}
			</div>
		),
	},
	skills: {
		title: "Skills",
		render: (items) => <SkillsProficiency skills={items as Skill[]} />,
	},
	references: {
		title: "References",
		render: (items) => <ReferenceTestimonial items={items as Reference[]} />,
	},
};

export function ResumeView({ data }: { data: Resume }) {
	const [showJson, setShowJson] = useState(false);
	const [themesLoaded, setThemesLoaded] = useState(false);
	const isOpen = useSidebarOpen();
	const { close } = useSidebarActions();
	const { resolvedTheme } = useTheme();

	const sectionOrder = useMemo(() => DEFAULT_SECTION_ORDER, []);
	const totalExperience = useMemo(() => {
		if (!data.work?.length) return undefined;

		const earliestStartDate = data.work.reduce<string | undefined>(
			(earliest, item) => {
				if (!item.startDate) return earliest;
				if (!earliest) return item.startDate;
				return item.startDate < earliest ? item.startDate : earliest;
			},
			undefined,
		);

		return calculateDuration(earliestStartDate);
	}, [data.work]);

	useEffect(() => {
		if (!themesLoaded) {
			loadThemes().then(() => setThemesLoaded(true));
		}
	}, [themesLoaded]);

	useEffect(() => {
		registerJsonToggleHandler(() => setShowJson((previous) => !previous));
		return () => unregisterJsonToggleHandler();
	}, []);

	useEffect(() => {
		const handleBeforePrint = () => {
			if (isOpen) close();
		};

		window.addEventListener("beforeprint", handleBeforePrint);
		return () => window.removeEventListener("beforeprint", handleBeforePrint);
	}, [close, isOpen]);

	if (showJson) {
		if (!themesLoaded) {
			return (
				<article className="py-4 sm:py-6">
					<div className="flex items-center justify-center py-12 text-base text-muted-foreground sm:text-sm">
						Loading themes...
					</div>
				</article>
			);
		}

		const jsonString = JSON.stringify(data, null, 2);
		const isDark = resolvedTheme === "dark";
		const syntaxTheme = isDark ? vscDarkPlusTheme! : vsTheme!;

		return (
			<article className="py-4 sm:py-6">
				<div className="overflow-hidden rounded-[1.8rem] border border-border/75 bg-card/94 p-3 shadow-[var(--page-shadow)] sm:p-4">
					<SyntaxHighlighter
						language="json"
						style={syntaxTheme}
						customStyle={{
							margin: 0,
							borderRadius: "1rem",
							maxHeight: "calc(100vh - 8rem)",
							fontSize: "0.8rem",
							fontFamily:
								"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
							lineHeight: "1.6",
							padding: "1rem",
						}}
						codeTagProps={{
							style: {
								fontFamily: "inherit",
								fontSize: "inherit",
								lineHeight: "inherit",
							},
						}}
					>
						{jsonString}
					</SyntaxHighlighter>
				</div>
			</article>
		);
	}

	return (
		<article className="space-y-5 py-4 sm:space-y-6 sm:py-6">
			<ResumeHeaderItem
				basics={data.basics}
				totalExperience={totalExperience}
				projectCount={data.projects?.length || 0}
			/>

			{sectionOrder.map((sectionKey) => {
				const section = SECTION_CONFIG[sectionKey];
				const sectionData = data[sectionKey];

				if (!section) return null;
				if (!sectionData || (Array.isArray(sectionData) && !sectionData.length)) {
					return null;
				}

				return (
					<ResumeSection
						key={sectionKey}
						title={section.title}
						rightContent={
							sectionKey === "work" && totalExperience
								? `${totalExperience} of hands-on product work`
								: undefined
						}
					>
						{section.render(sectionData)}
					</ResumeSection>
				);
			})}

			<ResumeFooter source={data.source} />
		</article>
	);
}
