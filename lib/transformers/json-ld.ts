import type { Resume } from "../resume-schema";

export interface PersonJsonLd {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: string;
  email: string;
  telephone: string;
  url: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  description: string;
  sameAs: string[];
  worksFor: Array<{
    "@type": "Organization";
    name: string;
    url?: string;
    startDate: string;
    endDate?: string;
    jobTitle: string;
    description?: string;
    achievements?: string[];
  }>;
  alumniOf: Array<{
    "@type": "EducationalOrganization";
    name: string;
    url?: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  knowsAbout: string[];
  hasCredential: Array<{
    "@type": "EducationalOccupationalCredential";
    name: string;
    credentialCategory: string;
    recognizedBy: {
      "@type": "Organization";
      name: string;
    };
    url?: string;
  }>;
  owns: Array<{
    "@type": "CreativeWork";
    name: string;
    description: string;
    url?: string;
    keywords: string[];
    about: string[];
  }>;
  performerIn?: Array<{
    "@type": "Event";
    name: string;
    startDate?: string;
    url?: string;
    description?: string;
    workPerformed: {
      "@type": "CreativeWork";
      name: string;
    };
  }>;
}

export function resumeToJsonLd(resume: Resume): PersonJsonLd {
  const sameAs = resume.basics.profiles?.map(p => p.url).filter(Boolean) as string[] || [];

  const worksFor = resume.work?.map(job => ({
    "@type": "Organization" as const,
    name: job.name || "",
    url: job.url,
    startDate: job.startDate || "",
    endDate: job.endDate || "",
    jobTitle: job.position || "",
    description: job.summary,
    achievements: job.highlights
  })) || [];

  const alumniOf = resume.education?.map(edu => ({
    "@type": "EducationalOrganization" as const,
    name: edu.institution,
    url: edu.url,
    degree: edu.studyType || "",
    startDate: edu.startDate || "",
    endDate: edu.endDate || ""
  })) || [];

  const knowsAbout = resume.skills || [];

  const hasCredential = resume.certificates?.map(cert => ({
    "@type": "EducationalOccupationalCredential" as const,
    name: cert.name,
    credentialCategory: "Certificate",
    recognizedBy: {
      "@type": "Organization" as const,
      name: cert.issuer || ""
    },
    url: cert.url
  })) || [];

  const owns = resume.projects?.map(project => ({
    "@type": "CreativeWork" as const,
    name: project.name,
    description: project.description || "",
    url: project.url,
    keywords: project.keywords || [],
    about: project.highlights || []
  })) || [];

  const performerIn = resume.talks?.map(talk => ({
    "@type": "Event" as const,
    name: talk.organiser || "",
    url: talk.link,
    workPerformed: {
      "@type": "CreativeWork" as const,
      name: talk.title
    }
  })) || [];

  const jsonLd: PersonJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resume.basics.name || "",
    jobTitle: resume.basics.label || "",
    email: resume.basics.email || "",
    telephone: resume.basics.phone || "",
    url: resume.basics.url || "",
    address: {
      "@type": "PostalAddress",
      addressLocality: resume.basics.location?.city || "",
      addressRegion: resume.basics.location?.region || "",
      postalCode: resume.basics.location?.postalCode || "",
      addressCountry: resume.basics.location?.countryCode || ""
    },
    description: resume.basics.summary || "",
    sameAs,
    worksFor,
    alumniOf,
    knowsAbout,
    hasCredential,
    owns
  };

  if (performerIn.length > 0) {
    jsonLd.performerIn = performerIn;
  }

  return jsonLd;
}