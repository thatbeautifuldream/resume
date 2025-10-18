import { z } from "zod";

const url = z.string().url();
const isoDate = z
  .string()
  .regex(
    /^\d{4}(-\d{2})?(-\d{2})?$/,
    "Expected ISO-like date (YYYY or YYYY-MM or YYYY-MM-DD)"
  );

export const ProfileSchema = z.object({
  network: z.string(),
  username: z.string().optional(),
  url: z.string().url().optional(),
});

export const LocationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
});

export const BasicsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  image: url.optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  url: url.optional(),
  summary: z.string().optional(),
  location: LocationSchema.optional(),
  timezone: z.string().optional(),
  profiles: z.array(ProfileSchema).optional(),
});

export const WorkSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  url: url.optional(),
  logo: z.string().optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
  institution: z.string(),
  area: z.string().optional(),
  url: url.optional(),
  logo: z.string().optional(),
  studyType: z.string().optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  score: z.string().optional(),
});

export const AwardSchema = z.object({
  title: z.string(),
  date: isoDate.optional(),
  awarder: z.string().optional(),
  summary: z.string().optional(),
});

export const SkillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  keywords: z.array(z.string()).default([]),
});

export const LanguageSchema = z.object({
  language: z.string(),
  fluency: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  url: url.optional(),
  roles: z.array(z.string()).optional(),
  entity: z.string().optional(),
  type: z.string().optional(),
});

export const VolunteerSchema = z.object({
  organization: z.string(),
  position: z.string().optional(),
  url: url.optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const CertificatesSchema = z.object({
  name: z.string(),
  date: isoDate.optional(),
  issuer: z.string().optional(),
  url: url.optional(),
});

export const TalksSchema = z.object({
  title: z.string(),
  event: z.string().optional(),
  date: isoDate.optional(),
  url: url.optional(),
  summary: z.string().optional(),
});

export const ReferenceSchema = z.object({
  name: z.string(),
  reference: z.string(),
});

export const PRSchema = z.object({
  title: z.string(),
  url: url,
});

export const ContributionSchema = z.object({
  repository: url,
  prs: z.array(PRSchema).default([]),
});

export const ResumeSchema = z.object({
  basics: BasicsSchema,
  work: z.array(WorkSchema).default([]),
  volunteer: z.array(VolunteerSchema).default([]),
  education: z.array(EducationSchema).default([]),
  awards: z.array(AwardSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certificates: z.array(CertificatesSchema).default([]),
  talks: z.array(TalksSchema).default([]),
  references: z.array(ReferenceSchema).default([]),
  contributions: z.array(ContributionSchema).default([]),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type Basics = z.infer<typeof BasicsSchema>;
export type Work = z.infer<typeof WorkSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Certificates = z.infer<typeof CertificatesSchema>;
export type Talks = z.infer<typeof TalksSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type Contribution = z.infer<typeof ContributionSchema>;
export type PR = z.infer<typeof PRSchema>;
