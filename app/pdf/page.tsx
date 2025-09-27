import { redirect } from "next/navigation";

export default async function ResumePdf({
  searchParams,
}: {
  searchParams: Promise<{ full?: string }>;
}) {
  const params = await searchParams;

  if (params.full === "true") {
    redirect(
      "https://cdn.jsdelivr.net/gh/thatbeautifuldream/resume-to-pdf@main/dist/Milind_Mishra_Full_Resume_2025.pdf"
    );
  } else {
    redirect(
      "https://cdn.jsdelivr.net/gh/thatbeautifuldream/resume-to-pdf@main/dist/Milind_Mishra_Resume_2025.pdf"
    );
  }
}
