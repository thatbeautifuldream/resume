import { Loading } from "@/components/loading";
import { ResumeView } from "@/components/resume/resume";
import { resume } from "@/lib/resume";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResumeView data={resume} />
    </Suspense>
  );
}
