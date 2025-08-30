import { ResumeSchema, type Resume } from "./resume-schema";

export async function fetchResume(src?: string): Promise<Resume> {
  const url = src?.trim() || "https://milind-old.vercel.app/resume.json";

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch resume: ${res.status}`);

  const raw = await res.json();
  const data = ResumeSchema.safeParse(raw?.resume ?? raw);
  if (!data.success) {
    const issues = data.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Resume validation failed: ${issues}`);
  }
  return data.data;
}
