import { NextRequest, NextResponse } from "next/server";
import { resume } from "@/lib/resume";
import { getResumeAsMarkdown, getResumeAsJsonLd } from "@/lib/transformers";
import { RESUME_CONFIG } from "@/lib/config";

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
      return NextResponse.redirect(
        `${request.nextUrl.origin}${RESUME_CONFIG.pdfPath()}`,
        302
      );

    case "json":
    default:
      return NextResponse.json(resume);
  }
}
