"use client";

import { ResumeView } from "@/components/resume";
import { resume } from "@/lib/resume";
import { Header } from "@/components/header";

export default function Page() {
  return (
    <>
      <Header />
      <main className="container pt-16 print:pt-0">
        <ResumeView data={resume} />
      </main>
    </>
  );
}
