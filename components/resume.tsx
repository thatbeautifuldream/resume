"use client";

import {
	useSidebarActions,
	useSidebarOpen,
} from "@/components/providers/chat-sidebar-store";
import {
	calculateDuration,
	formatDate,
	range,
	rangeCompact,
} from "@/lib/format";
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
import Link from "next/link";
import type * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { TextMorph } from "torph/react";

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
		<section className="space-y-3 sm:space-y-4">
			<div className="flex items-baseline justify-between gap-3 border-l-[2.5px] border-primary pl-2.5 rounded-r-sm">
				<h4 className="font-serif font-medium text-base sm:text-lg text-balance leading-tight">
					{title}
				</h4>
				{rightContent ? (
					<span className="text-xs font-sans text-stone whitespace-nowrap tabular-nums tracking-wide">
						{rightContent}
					</span>
				) : null}
			</div>
			<div>{children}</div>
		</section>
	);
}

function ResumeFooter({ source }: { source: string }) {
	const sourceLink = source.startsWith("http") ? source : `https://${source}`;
	return (
		<footer className="mt-6 sm:mt-8 pt-3 sm:pt-4 text-center text-xs font-sans print:hidden border-t border-border/60">
			<p className="text-stone">
				Source ·{" "}
				<a
					href={sourceLink}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline underline-offset-[3px] decoration-primary/40 hover:decoration-primary"
				>
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

const COPIED_DISPLAY_DURATION_MS = 1800;

function EmailWithCopy({ email }: { email: string }) {
	const [displayText, setDisplayText] = useState(email);
	const { trigger } = useWebHaptics();

	const handleClick = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(email);
			void trigger("success", { intensity: 0.8 });
			setDisplayText("Copied to clipboard!");
		} catch (error) {
			if (process.env.NODE_ENV !== "production") {
				console.warn("Failed to copy email:", error);
			}
		}
	}, [email, trigger]);

	useEffect(() => {
		if (displayText !== "Copied to clipboard!") return;
		const t = setTimeout(() => setDisplayText(email), COPIED_DISPLAY_DURATION_MS);
		return () => clearTimeout(t);
	}, [displayText, email]);

	return (
		<button
			type="button"
			onClick={handleClick}
			className="bg-transparent border-none p-0 font-inherit text-inherit cursor-pointer hover:underline"
			title={`Copy ${email}`}
		>
			<TextMorph duration={300} as="span" className="inline">
				{displayText}
			</TextMorph>
		</button>
	);
}

function ResumeHeaderItem({ basics }: { basics: Basics }) {
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
		basics.profiles.forEach((p) => {
			contactItems.push({
				key: p.network || p.url || "",
				element: <ProfileLinkWithNetwork profile={p} />,
			});
		});
	}

	return (
		<header className="border-l-[2.5px] border-primary pl-3 rounded-r-sm space-y-1">
			<h1 className="font-serif font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-balance leading-none">
				{basics.name}
			</h1>
			{basics.label && (
				<p className="font-serif text-primary text-base sm:text-lg font-medium">
					{basics.label}
				</p>
			)}

			<div className="text-xs sm:text-sm font-sans text-olive flex flex-wrap items-center gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-1 pt-1">
				{contactItems.map((item, i) => (
					<div key={item.key} className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4">
						{i > 0 && <span className="text-border select-none" aria-hidden>·</span>}
						{item.element}
					</div>
				))}
			</div>
		</header>
	);
}

function WorkExperienceItem({ item }: { item: Work }) {
	const duration = calculateDuration(item.startDate, item.endDate);
	return (
		<div className="space-y-2 sm:space-y-3 border-t border-border/70 pt-3 sm:pt-4 first:border-t-0 first:pt-0">
			<div className="space-y-0.5 sm:space-y-1">
				<div className="flex gap-2 sm:gap-3 items-start">
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-baseline gap-2 text-sm md:text-base">
							<strong className="font-serif font-medium text-foreground">
								{item.position || "Role"}
							</strong>
							{item.workType && (
								<span className="font-sans text-stone text-[10px] uppercase tracking-wider">
									{item.workType}
								</span>
							)}
						</div>
						<div className="flex justify-between items-baseline gap-2 text-sm md:text-base">
							<span className="font-serif text-primary">
								{item.name}
							</span>
							<span className="font-sans text-xs text-stone whitespace-nowrap tabular-nums">
								<span className="sm:hidden">
									{rangeCompact(item.startDate, item.endDate)}
									{duration && ` · ${duration}`}
								</span>
								<span className="hidden sm:inline">
									{range(item.startDate, item.endDate)}
									{duration && ` · ${duration}`}
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				{item.summary && (
					<p className="text-sm md:text-base text-pretty text-olive leading-relaxed">
						{item.summary}
					</p>
				)}
				{!!item.highlights?.length && (
					<ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-sm md:text-base marker:text-primary/60">
						{item.highlights.map((h) => (
							<li key={h} className="text-pretty leading-relaxed">
								{h}
							</li>
						))}
					</ul>
				)}
				{!!item.proofLinks?.length && (
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-sans font-medium pt-0.5">
						{item.proofLinks.map((link) => {
							const href = link.url.startsWith("http")
								? link.url
								: `https://${link.url}`;
							return (
								<a
									key={`${item.name}-${link.label}`}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary underline underline-offset-[3px] decoration-primary/40 hover:decoration-primary"
								>
									{link.label}
								</a>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

function ProjectPortfolioItem({ item }: { item: Project }) {
	// Use single date if available, otherwise fall back to date range
	const dateDisplay = item.date
		? formatDate(item.date)
		: range(item.startDate, item.endDate);
	const urlHref = item.url
		? item.url.startsWith("http")
			? item.url
			: `https://${item.url}`
		: undefined;

	return (
		<div className="space-y-2 sm:space-y-3 border-t border-border/70 pt-3 sm:pt-4 first:border-t-0 first:pt-0">
			<div className="space-y-0.5 sm:space-y-1">
				<div className="flex gap-2 sm:gap-3 items-start">
					<div className="flex-1 min-w-0">
						<div className="flex justify-between sm:flex-row flex-col sm:items-baseline items-start text-sm md:text-base">
							{urlHref ? (
								<a
									href={urlHref}
									target="_blank"
									rel="noreferrer"
									className="font-serif font-medium text-foreground hover:underline underline-offset-4 decoration-primary/40"
								>
									{item.name}
								</a>
							) : (
								<strong className="font-serif font-medium text-foreground">
									{item.name}
								</strong>
							)}
							<span className="sm:mt-0 mt-0.5 font-sans text-xs text-stone tabular-nums">
								{dateDisplay}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				{item.description && (
					<p className="text-sm md:text-base text-pretty text-olive leading-relaxed">
						{item.description}
					</p>
				)}
				<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-sans text-stone">
					{item.role && (
						<span>
							<span className="uppercase tracking-wider text-primary font-semibold text-[10px]">Role</span>{" "}
							{item.role}
						</span>
					)}
					{item.teamSize && (
						<span>
							<span className="uppercase tracking-wider text-primary font-semibold text-[10px]">Team</span>{" "}
							{item.teamSize}
						</span>
					)}
					{item.duration && (
						<span>
							<span className="uppercase tracking-wider text-primary font-semibold text-[10px]">Duration</span>{" "}
							{item.duration}
						</span>
					)}
					{item.status && (
						<span>
							<span className="uppercase tracking-wider text-primary font-semibold text-[10px]">Status</span>{" "}
							{item.status}
						</span>
					)}
				</div>
				{!!item.impactMetrics?.length && (
					<div className="flex flex-wrap gap-1.5">
						{item.impactMetrics.map((metric) => (
							<span
								key={`${item.name}-${metric.label}`}
								className="rounded-sm bg-accent text-primary px-2 py-0.5 text-[11px] font-sans font-medium tabular-nums"
								title={metric.window}
							>
								<span className="uppercase tracking-wider text-[10px] font-semibold">
									{metric.label}
								</span>{" "}
								{metric.value}
							</span>
						))}
					</div>
				)}
				{!!item.highlights?.length && (
					<ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-sm md:text-base marker:text-primary/60">
						{item.highlights.map((h) => (
							<li key={h} className="text-pretty leading-relaxed">
								{h}
							</li>
						))}
					</ul>
				)}
				{!!item.proofLinks?.length && (
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-sans font-medium pt-0.5">
						{item.proofLinks.map((link) => {
							const href = link.url.startsWith("http")
								? link.url
								: `https://${link.url}`;
							return (
								<a
									key={`${item.name}-${link.label}`}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary underline underline-offset-[3px] decoration-primary/40 hover:decoration-primary"
								>
									{link.label}
								</a>
							);
						})}
					</div>
				)}
			</div>
		</div>
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
		<div className="flex justify-between items-baseline gap-2 text-sm md:text-base">
			<div className="flex-1 min-w-0 truncate">
				{urlHref ? (
					<a
						href={urlHref}
						target="_blank"
						rel="noopener noreferrer"
						className="font-serif font-medium hover:underline underline-offset-4 decoration-primary/40"
					>
						{item.institution}
					</a>
				) : (
					<strong className="font-serif font-medium">{item.institution}</strong>
				)}
				{item.studyType && <span className="text-olive"> · {item.studyType}</span>}
			</div>
			<span className="font-sans text-xs text-stone whitespace-nowrap flex-shrink-0 tabular-nums">
				{dateDisplay}
			</span>
		</div>
	);
}

function CertificateAchievementItem({ item }: { item: Certificates }) {
	const urlHref = item.url
		? item.url.startsWith("http")
			? item.url
			: `https://${item.url}`
		: undefined;

	return (
		<span className="inline-flex items-baseline gap-1 text-sm md:text-base">
			{urlHref ? (
				<a
					href={urlHref}
					target="_blank"
					rel="noopener noreferrer"
					className="font-serif font-medium hover:underline underline-offset-4 decoration-primary/40"
				>
					{item.name}
				</a>
			) : (
				<span className="font-serif font-medium">{item.name}</span>
			)}
			{item.issuer && (
				<span className="text-olive font-sans text-xs">· {item.issuer}</span>
			)}
			{item.date && (
				<span className="font-sans text-xs text-stone tabular-nums">
					· {item.date}
				</span>
			)}
		</span>
	);
}

function OpenSourceContributionItem({ item }: { item: Contribution }) {
	const extractOrgAndRepo = (url: string) => {
		try {
			const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
			const parsedUrl = new URL(urlWithProtocol);
			const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
			// URL format: github.com/org/repo/pull/123
			if (pathParts.length >= 2) {
				return {
					org: pathParts[0],
					orgRepo: `${pathParts[0]}/${pathParts[1]}`,
				};
			}
			return { org: "", orgRepo: "" };
		} catch {
			return { org: "", orgRepo: "" };
		}
	};

	const { org, orgRepo } = extractOrgAndRepo(item.url);

	const href = item.url.startsWith("http") ? item.url : `https://${item.url}`;

	return (
		<div className="flex justify-between items-baseline gap-2">
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm md:text-base hover:underline underline-offset-4 decoration-primary/40 flex-1 leading-tight truncate text-foreground"
			>
				{item.title}
			</a>
			{orgRepo && (
				<>
					<span className="font-sans text-xs text-stone whitespace-nowrap md:hidden flex-shrink-0 tabular-nums">
						{org}
					</span>
					<span className="hidden md:inline font-sans text-xs text-stone whitespace-nowrap flex-shrink-0 tabular-nums">
						{orgRepo}
					</span>
				</>
			)}
		</div>
	);
}

function TalkPresentationItem({ item }: { item: Talks }) {
	const href = item.link
		? item.link.startsWith("http")
			? item.link
			: `https://${item.link}`
		: undefined;

	return (
		<div className="flex justify-between items-baseline gap-2">
			{href ? (
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm md:text-base hover:underline underline-offset-4 decoration-primary/40 flex-1 leading-tight truncate text-foreground"
				>
					{item.title}
				</a>
			) : (
				<span className="text-sm md:text-base flex-1 leading-tight truncate">
					{item.title}
				</span>
			)}
			{item.organiser && (
				<span className="font-sans text-xs text-stone whitespace-nowrap flex-shrink-0">
					{item.organiser}
				</span>
			)}
		</div>
	);
}

function SkillsProficiency({ skills }: { skills: Skill[] }) {
	const { sendPromptToChat } = useSidebarActions();
	const { trigger } = useWebHaptics();

	if (!skills?.length) return null;

	return (
		<div className="flex flex-wrap gap-1.5 text-xs font-sans">
			{skills.map((skill) => (
				<button
					type="button"
					key={skill}
					onClick={() => {
						const prompt = `Tell me about ${skill} - what is it, and how has Milind used this skill in his work? How proficient is he with ${skill}?`;
						void trigger("medium", { intensity: 0.75 });
						sendPromptToChat(prompt);
					}}
					className="rounded-sm bg-accent text-primary px-2 py-0.5 font-medium hover:bg-brand-tint-strong/80 cursor-pointer transition-colors"
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
		<div className="space-y-4 sm:space-y-5">
			{items.map((r) => (
				<blockquote
					key={r.name}
					className="border-l-[2px] border-primary pl-4 space-y-1.5 sm:space-y-2 text-sm md:text-base text-olive italic leading-relaxed"
				>
					<div>{r.reference}</div>
					<footer className="text-xs md:text-sm font-medium not-italic text-foreground font-sans">
						— {r.name}, <span className="text-olive">{r.title}</span>
					</footer>
				</blockquote>
			))}
		</div>
	);
}

const DEFAULT_SECTION_ORDER: (keyof Resume)[] = [
	"basics",
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

const SECTION_CONFIG: Partial<
	Record<keyof Resume, ResumeSectionConfig>
> = {
	work: {
		title: "Experience",
		render: (items) => (
			<div className="space-y-5 sm:space-y-8">
				{(items as Work[]).map((w) => (
					<WorkExperienceItem key={w.name} item={w} />
				))}
			</div>
		),
	},
	projects: {
		title: "Selected Projects",
		render: (items) => (
			<div className="space-y-5 sm:space-y-8">
				{(items as Project[]).map((p) => (
					<ProjectPortfolioItem key={`${p.url || p.name}-${p.date || "project"}`} item={p} />
				))}
			</div>
		),
	},
	education: {
		title: "Education",
		render: (items) => (
			<div className="space-y-2 sm:space-y-3">
				{(items as Education[]).map((e) => (
					<EducationCredentialItem key={e.institution} item={e} />
				))}
			</div>
		),
	},
	talks: {
		title: "Talks",
		render: (items) => (
			<div className="space-y-1.5 sm:space-y-2">
				{(items as Talks[]).map((t) => (
					<TalkPresentationItem key={t.title} item={t} />
				))}
			</div>
		),
	},
	contributions: {
		title: "Open Source Contributions",
		render: (items) => (
			<div className="space-y-1.5 sm:space-y-2">
				{(items as Contribution[]).map((c) => (
					<OpenSourceContributionItem key={c.url} item={c} />
				))}
			</div>
		),
	},
	certificates: {
		title: "Certificates",
		render: (items) => (
			<div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 items-baseline">
				{(items as Certificates[]).map((c) => (
					<CertificateAchievementItem key={c.name} item={c} />
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
	const isOpen = useSidebarOpen();
	const { close } = useSidebarActions();
	const sectionOrder = useMemo(() => DEFAULT_SECTION_ORDER, []);
	const totalExperience = useMemo(() => {
		if (!data.work?.length) return undefined;

		const earliestStartDate = data.work.reduce<string | undefined>((earliest, item) => {
			if (!item.startDate) return earliest;
			if (!earliest) return item.startDate;
			return item.startDate < earliest ? item.startDate : earliest;
		}, undefined);

		return calculateDuration(earliestStartDate);
	}, [data.work]);

	// Handle print from any source (browser menu, Ctrl+P, etc.)
	useEffect(() => {
		const handleBeforePrint = () => {
			if (isOpen) {
				close();
			}
		};

		window.addEventListener("beforeprint", handleBeforePrint);
		return () => window.removeEventListener("beforeprint", handleBeforePrint);
	}, [isOpen, close]);

	return (
		<article className="space-y-6 sm:space-y-8 py-3 sm:py-4 md:py-8 print:py-0 max-w-[62ch] md:max-w-none mx-auto">
			<ResumeHeaderItem basics={data.basics} />

			{sectionOrder.map((sectionKey) => {
				const section = SECTION_CONFIG[sectionKey];
				const sectionData = data[sectionKey];

				if (!section) return null;
				if (!sectionData || (Array.isArray(sectionData) && !sectionData.length))
					return null;

				return (
					<ResumeSection
						key={sectionKey}
						title={section.title}
						rightContent={
							sectionKey === "work" && totalExperience
								? `(${totalExperience} total)`
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
