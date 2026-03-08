import { z } from "zod";

const isoDateRegex = /^\d{4}(-\d{2})?(-\d{2})?$/;
const isoDate = z.string().regex(isoDateRegex).describe("ISO-like date");
const url = z.string();

const workTypeEnum = z.enum([
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Freelance",
  "Full Time / Contract",
]);

const BasicsSchema = z
  .object({
    name: z.string(),
    timezone: z.string(),
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
      .loose()
      .optional(),
    profiles: z
      .array(
        z
          .object({
            network: z.string(),
            username: z.string().optional(),
            url: url.optional(),
          })
          .loose(),
      )
      .optional(),
  })
  .loose();

const WorkProofLinkSchema = z
  .object({
    label: z.string(),
    url,
    type: z
      .enum(["live", "source", "case-study", "metrics", "demo", "other"])
      .optional(),
  })
  .loose();

const WorkSchema = z
  .object({
    name: z.string().optional(),
    position: z.string().optional(),
    location: z.string().optional(),
    url: url.optional(),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    proofLinks: z.array(WorkProofLinkSchema).optional(),
    workType: workTypeEnum.optional(),
  })
  .loose();

const VolunteerSchema = z
  .object({
    organization: z.string(),
    position: z.string().optional(),
    url: url.optional(),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })
  .loose();

const EducationSchema = z
  .object({
    institution: z.string(),
    url: url,
    studyType: z.string(),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
  })
  .loose();

const AwardSchema = z
  .object({
    title: z.string(),
    date: isoDate.optional(),
    awarder: z.string().optional(),
    summary: z.string().optional(),
  })
  .loose();

const LanguageSchema = z
  .object({
    language: z.string(),
    fluency: z.string().optional(),
  })
  .loose();

const ProjectImpactMetricSchema = z
  .object({
    label: z.string(),
    value: z.string(),
    window: z.string().optional(),
  })
  .loose();

const ProjectProofLinkSchema = z
  .object({
    label: z.string(),
    url,
    type: z
      .enum(["live", "source", "case-study", "metrics", "demo", "other"])
      .optional(),
  })
  .loose();

const ProjectSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    date: isoDate.optional(),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
    url: url.optional(),
    roles: z.array(z.string()).optional(),
    entity: z.string().optional(),
    type: z.string().optional(),
    role: z.string().optional(),
    teamSize: z.string().optional(),
    duration: z.string().optional(),
    status: z
      .enum(["Live", "Active", "Archived", "Paused", "Sunset", "Private"])
      .optional(),
    challenges: z.array(z.string()).optional(),
    impactMetrics: z.array(ProjectImpactMetricSchema).optional(),
    proofLinks: z.array(ProjectProofLinkSchema).optional(),
  })
  .loose();

const CertificateSchema = z
  .object({
    name: z.string(),
    date: isoDate.optional(),
    issuer: z.string().optional(),
    url: url.optional(),
  })
  .loose();

const TalkSchema = z
  .object({
    title: z.string(),
    organiser: z.string(),
    link: url.optional(),
  })
  .loose();

const ReferenceSchema = z
  .object({
    name: z.string(),
    title: z.string(),
    reference: z.string(),
  })
  .loose();

const ContributionSchema = z
  .object({
    title: z.string(),
    url: url,
  })
  .loose();

export const ResumeSchema = z
  .object({
    source: z.string(),
    basics: BasicsSchema,
    work: z.array(WorkSchema).optional(),
    volunteer: z.array(VolunteerSchema).optional(),
    education: z.array(EducationSchema).optional(),
    awards: z.array(AwardSchema).optional(),
    skills: z.array(z.string()).optional(),
    languages: z.array(LanguageSchema).optional(),
    projects: z.array(ProjectSchema).optional(),
    certificates: z.array(CertificateSchema).optional(),
    talks: z.array(TalkSchema).optional(),
    references: z.array(ReferenceSchema).optional(),
    contributions: z.array(ContributionSchema).optional(),
  })
  .loose();

export type Resume = z.infer<typeof ResumeSchema>;
export type Basics = Resume["basics"];
export type Location = NonNullable<Resume["basics"]["location"]>;
export type Profile = NonNullable<Resume["basics"]["profiles"]>[number];
export type Work = NonNullable<Resume["work"]>[number];
export type Volunteer = NonNullable<Resume["volunteer"]>[number];
export type Education = NonNullable<Resume["education"]>[number];
export type Award = NonNullable<Resume["awards"]>[number];
export type Skill = string;
export type Language = NonNullable<Resume["languages"]>[number];
export type Project = NonNullable<Resume["projects"]>[number];
export type Certificates = NonNullable<Resume["certificates"]>[number];
export type Talks = NonNullable<Resume["talks"]>[number];
export type Reference = NonNullable<Resume["references"]>[number];
export type Contribution = NonNullable<Resume["contributions"]>[number];

/** Apply defaults for optional array fields. Use after validation when loading external data. */
export function withResumeDefaults(data: Resume): Resume & {
  work: NonNullable<Resume["work"]>;
  volunteer: NonNullable<Resume["volunteer"]>;
  education: NonNullable<Resume["education"]>;
  awards: NonNullable<Resume["awards"]>;
  skills: NonNullable<Resume["skills"]>;
  languages: NonNullable<Resume["languages"]>;
  projects: NonNullable<Resume["projects"]>;
  certificates: NonNullable<Resume["certificates"]>;
  talks: NonNullable<Resume["talks"]>;
  references: NonNullable<Resume["references"]>;
  contributions: NonNullable<Resume["contributions"]>;
} {
  return {
    ...data,
    work: data.work ?? [],
    volunteer: data.volunteer ?? [],
    education: data.education ?? [],
    awards: data.awards ?? [],
    skills: data.skills ?? [],
    languages: data.languages ?? [],
    projects: data.projects ?? [],
    certificates: data.certificates ?? [],
    talks: data.talks ?? [],
    references: data.references ?? [],
    contributions: data.contributions ?? [],
  };
}
