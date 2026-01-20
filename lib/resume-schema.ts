import { title } from "process";
import { z } from "zod";

const url = z.string().url();
const isoDate = z
  .string()
  .regex(
    /^\d{4}(-\d{2})?(-\d{2})?$/,
    "Expected ISO-like date (YYYY or YYYY-MM or YYYY-MM-DD)",
  );

export const ResumeSchema = z.object({
  source: z.string(),
  basics: z.object({
    name: z.string(),
    label: z.string().optional(),
    image: url.optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    url: url.optional(),
    summary: z.string().optional(),
    location: z
      .object({
        address: z.string().optional(),
        postalCode: z.string().optional(),
        city: z.string().optional(),
        countryCode: z.string().optional(),
        region: z.string().optional(),
      })
      .optional(),
    timezone: z.string().optional(),
    profiles: z
      .array(
        z.object({
          network: z.string(),
          username: z.string().optional(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),
  }),
  work: z
    .array(
      z.object({
        name: z.string().optional(),
        position: z.string().optional(),
        location: z.string().optional(),
        url: url.optional(),
        startDate: isoDate.optional(),
        endDate: isoDate.optional(),
        summary: z.string().optional(),
        highlights: z.array(z.string()).default([]),
        workType: z
          .enum([
            "Full Time",
            "Part Time",
            "Contract",
            "Internship",
            "Freelance",
            "Full Time / Contract",
          ])
          .optional(),
      }),
    )
    .default([]),
  volunteer: z
    .array(
      z.object({
        organization: z.string(),
        position: z.string().optional(),
        url: url.optional(),
        startDate: isoDate.optional(),
        endDate: isoDate.optional(),
        summary: z.string().optional(),
        highlights: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string(),
        area: z.string().optional(),
        url: url.optional(),
        studyType: z.string().optional(),
        startDate: isoDate.optional(),
        endDate: isoDate.optional(),
        score: z.string().optional(),
      }),
    )
    .default([]),
  awards: z
    .array(
      z.object({
        title: z.string(),
        date: isoDate.optional(),
        awarder: z.string().optional(),
        summary: z.string().optional(),
      }),
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  languages: z
    .array(
      z.object({
        language: z.string(),
        fluency: z.string().optional(),
      }),
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        highlights: z.array(z.string()).default([]),
        keywords: z.array(z.string()).default([]),
        date: isoDate.optional(),
        startDate: isoDate.optional(),
        endDate: isoDate.optional(),
        url: url.optional(),
        roles: z.array(z.string()).optional(),
        entity: z.string().optional(),
        type: z.string().optional(),
      }),
    )
    .default([]),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        date: isoDate.optional(),
        issuer: z.string().optional(),
        url: url.optional(),
      }),
    )
    .default([]),
  talks: z
    .array(
      z.object({
        title: z.string(),
        organiser: z.string(),
        link: url.optional(),
      }),
    )
    .default([]),
  references: z
    .array(
      z.object({
        name: z.string(),
        title: z.string(),
        reference: z.string(),
      }),
    )
    .default([]),
  contributions: z
    .array(
      z.object({
        title: z.string(),
        url: url,
      }),
    )
    .default([]),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type Basics = Resume["basics"];
export type Location = NonNullable<Resume["basics"]["location"]>;
export type Profile = NonNullable<Resume["basics"]["profiles"]>[number];
export type Work = Resume["work"][number];
export type Volunteer = Resume["volunteer"][number];
export type Education = Resume["education"][number];
export type Award = Resume["awards"][number];
export type Skill = string;
export type Language = Resume["languages"][number];
export type Project = Resume["projects"][number];
export type Certificates = Resume["certificates"][number];
export type Talks = Resume["talks"][number];
export type Reference = Resume["references"][number];
export type Contribution = Resume["contributions"][number];
