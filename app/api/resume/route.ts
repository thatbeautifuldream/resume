import { NextRequest, NextResponse } from "next/server";
import { resume } from "@/lib/resume";
import { getResumeAsMarkdown, getResumeAsJsonLd } from "@/lib/transformers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  switch (format.toLowerCase()) {
    case "markdown":
      return new NextResponse(getResumeAsMarkdown(), {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
        },
      });

    case "json-ld":
      return NextResponse.json(getResumeAsJsonLd(), {
        headers: {
          "Content-Type": "application/ld+json",
        },
      });

    case "pdf":
      const pdfType = searchParams.get("type") || "normal";
      const pdfFilename = pdfType === "full"
        ? "milind-mishra-full-resume-2025.pdf"
        : "milind-mishra-resume-2025.pdf";
      return NextResponse.redirect(
        `${request.nextUrl.origin}/pdf/${pdfFilename}`,
        302
      );

    case "json":
    default:
      return NextResponse.json(resume);
  }
}
