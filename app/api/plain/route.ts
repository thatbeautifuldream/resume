import { resume } from "@/lib/resume";
import { resumeToPlainText } from "@/lib/resume-plain";

export async function GET() {
  const text = resumeToPlainText(resume);

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="milind-mishra-resume-ats.txt"',
    },
  });
}
