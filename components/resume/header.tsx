"use client";

import { useState } from "react";
import Link from "next/link";
import type { Basics, Profile } from "@/lib/resume-schema";

export function ResumeHeader({ basics }: { basics: Basics }) {
  const [emailCopied, setEmailCopied] = useState(false);

  const location = basics.location
    ? [
        basics.location.city,
        basics.location.region,
        basics.location.countryCode,
      ]
        .filter(Boolean)
        .join(", ")
    : undefined;

  const handleEmailClick = async () => {
    if (basics.email) {
      await navigator.clipboard.writeText(basics.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  return (
    <header className="text-left mb-8">
      <div className="space-y-4">
        <h2 className="font-semibold">{basics.name.toUpperCase()}</h2>

        <div className="flex flex-wrap gap-3 text-sm">
          {/* {location && <span>{location}</span>} */}
          {basics.email && (
            <Link
              href="#"
              onClick={handleEmailClick}
              className="hover:underline cursor-pointer"
            >
              {emailCopied ? "Copied to clipboard!" : basics.email}
            </Link>
          )}
          {basics.phone && <a href={`tel:${basics.phone}`}>{basics.phone}</a>}
          {basics.url && (
            <Link href={basics.url} target="_blank" rel="noreferrer">
              {basics.url.replace(/^https?:\/\//, "")}
            </Link>
          )}
          {basics.profiles?.map((p, i) => (
            <ProfileLinkWithNetwork key={i} profile={p} />
          ))}
        </div>

        {basics.summary && (
          <div className="border-l-4 border-border pl-4 space-y-2">
            <p>{basics.summary}</p>
          </div>
        )}
      </div>
    </header>
  );
}

function ProfileLinkWithNetwork({ profile }: { profile: Profile }) {
  const getNetworkLabel = (network: string, username?: string) => {
    const n = network.toLowerCase();
    if (n.includes("github")) return `github/${username || ""}`;
    if (n.includes("twitter") || n === "x") return `x/${username || ""}`;
    if (n.includes("linkedin")) return `linkedin/${username || ""}`;
    if (n.includes("youtube")) return `youtube/${username || ""}`;
    if (n.includes("cal")) return `cal.com/${username || ""}`;
    return username || profile.url || network;
  };

  const label = getNetworkLabel(profile.network || "", profile.username);
  const href = profile.url || "#";

  return href !== "#" ? (
    <Link href={href} target="_blank" rel="noreferrer">
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
}
