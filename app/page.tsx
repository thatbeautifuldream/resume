import { ResumeView } from "@/components/resume/resume";
import { resume } from "@/lib/data";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeView data={resume} />
    </Suspense>
  );
}
