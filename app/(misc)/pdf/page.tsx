import { redirect } from "next/navigation";

export default async function ResumePdf({
  searchParams,
}: {
  searchParams: Promise<{ full?: string }>;
}) {
  const params = await searchParams;

  if (params.full === "true") {
    redirect(
      "/pdf/milind-mishra-full-resume-2025.pdf"
    );
  } else {
    redirect(
      "/pdf/milind-mishra-resume-2025.pdf"
    );
  }
}
