import { ResumeView } from "@/components/resume/resume";
import { resume } from "@/lib/data";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   const params = await searchParams;
//   const src = typeof params?.src === "string" ? params.src : undefined;
//   const data = await fetchResume(src);

//   return <ResumeView data={data} />;
// }

export default function Page() {
  return <ResumeView data={resume} />;
}
