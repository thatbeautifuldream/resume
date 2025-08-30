"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import type { Basics, Profile } from "@/lib/resume-schema";

export function ResumeHeader({ basics }: { basics: Basics }) {
  const location = basics.location
    ? [
        basics.location.city,
        basics.location.region,
        basics.location.countryCode,
      ]
        .filter(Boolean)
        .join(", ")
    : undefined;

  return (
    <header className="text-center mb-8">
      <h1 className="font-semibold">{basics.name}</h1>

      <div className="flex flex-wrap justify-center gap-2 text-sm mb-4">
        {location && (
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
        )}
        {basics.email && (
          <div className="flex items-center gap-1">
            <Mail size={16} />
            <Link href={`mailto:${basics.email}`}>{basics.email}</Link>
          </div>
        )}
        {basics.phone && (
          <div className="flex items-center gap-1">
            <Phone size={16} />
            <a href={`tel:${basics.phone}`}>{basics.phone}</a>
          </div>
        )}
        {basics.url && (
          <div className="flex items-center gap-1">
            <Globe size={16} />
            <Link href={basics.url} target="_blank" rel="noreferrer">
              {basics.url.replace(/^https?:\/\//, "")}
            </Link>
          </div>
        )}
        {basics.profiles?.slice(0, 4).map((p, i) => (
          <div key={i} className="flex items-center gap-1">
            {iconFor(p.network)}
            <ProfileLink profile={p} />
          </div>
        ))}
      </div>

      {basics.summary && (
        <div className="mt-4 text-left">
          <p>{basics.summary}</p>
        </div>
      )}
    </header>
  );
}

function ProfileLink({ profile }: { profile: Profile }) {
  const label = profile.username || profile.url || profile.network;
  const href = profile.url || "#";
  return href !== "#" ? (
    <Link href={href} target="_blank" rel="noreferrer">
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
}

function iconFor(network?: string) {
  const n = (network || "").toLowerCase();
  if (n.includes("github")) return <Github size={16} />;
  if (n.includes("twitter") || n === "x") return <Twitter size={16} />;
  if (n.includes("linkedin")) return <Linkedin size={16} />;
  if (n.includes("youtube")) return <Youtube size={16} />;
  return <Globe size={16} />;
}
