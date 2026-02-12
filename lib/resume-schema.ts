import { schema } from "tjs";

const isoDate = {
  type: "string" as const,
  pattern: "^\\d{4}(-\\d{2})?(-\\d{2})?$",
  description: "ISO-like date (YYYY or YYYY-MM or YYYY-MM-DD)",
};

/** URL/URI - use type string; format "uri" would reject URLs without protocol (e.g. "milindmishra.com"). */
const url = { type: "string" as const };

const workTypeEnum = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Freelance",
  "Full Time / Contract",
] as const;

export const ResumeSchema = schema({
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    source: { type: "string" },
    basics: {
      type: "object",
      properties: {
        name: { type: "string" },
        label: { type: "string" },
        image: url,
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        url,
        summary: { type: "string" },
        location: {
          type: "object",
          properties: {
            address: { type: "string" },
            postalCode: { type: "string" },
            city: { type: "string" },
            countryCode: { type: "string" },
            region: { type: "string" },
          },
        },
        timezone: { type: "string" },
        profiles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              network: { type: "string" },
              username: { type: "string" },
              url,
            },
            required: ["network"],
          },
        },
      },
      required: ["name", "timezone"],
    },
    work: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          position: { type: "string" },
          location: { type: "string" },
          url,
          startDate: isoDate,
          endDate: isoDate,
          summary: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" },
          },
          workType: { enum: [...workTypeEnum] },
        },
        required: [],
      },
    },
    volunteer: {
      type: "array",
      items: {
        type: "object",
        properties: {
          organization: { type: "string" },
          position: { type: "string" },
          url,
          startDate: isoDate,
          endDate: isoDate,
          summary: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["organization"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          url,
          studyType: { type: "string" },
          startDate: isoDate,
          endDate: isoDate,
        },
        required: ["institution", "url", "studyType"],
      },
    },
    awards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          date: isoDate,
          awarder: { type: "string" },
          summary: { type: "string" },
        },
        required: ["title"],
      },
    },
    skills: {
      type: "array",
      items: { type: "string" },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          language: { type: "string" },
          fluency: { type: "string" },
        },
        required: ["language"],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" },
          },
          keywords: {
            type: "array",
            items: { type: "string" },
          },
          date: isoDate,
          startDate: isoDate,
          endDate: isoDate,
          url,
          roles: { type: "array", items: { type: "string" } },
          entity: { type: "string" },
          type: { type: "string" },
        },
        required: ["name"],
      },
    },
    certificates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          date: isoDate,
          issuer: { type: "string" },
          url,
        },
        required: ["name"],
      },
    },
    talks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          organiser: { type: "string" },
          link: url,
        },
        required: ["title", "organiser"],
      },
    },
    references: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          title: { type: "string" },
          reference: { type: "string" },
        },
        required: ["name", "title", "reference"],
      },
    },
    contributions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          url,
        },
        required: ["title", "url"],
      },
    },
  },
  required: ["source", "basics"],
});

export type Resume = (typeof ResumeSchema)["type"];
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
export function withResumeDefaults(
  data: Resume,
): Resume & {
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

export const validateResume = (data: unknown) => ResumeSchema.validate(data);
