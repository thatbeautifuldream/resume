"use client";

import { ResumeView } from "@/components/resume/resume";
import { Header } from "@/components/header";
import { resume } from "@/lib/data";
import { Suspense, useState } from "react";
import { useQueryState, parseAsBoolean } from "nuqs";

function ResumePageContent() {
  const [expandAll, setExpandAll] = useQueryState(
    "expand",
    parseAsBoolean.withDefault(false)
  );
  const [showAllWork, setShowAllWork] = useState(false);
  const [showAllContributions, setShowAllContributions] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllTalks, setShowAllTalks] = useState(false);

  const toggleExpandAll = () => {
    const newExpandAll = !expandAll;
    setExpandAll(newExpandAll);
    setShowAllWork(newExpandAll);
    setShowAllContributions(newExpandAll);
    setShowAllProjects(newExpandAll);
    setShowAllEducation(newExpandAll);
    setShowAllCertificates(newExpandAll);
    setShowAllTalks(newExpandAll);
  };

  return (
    <>
      <Header
        showExpandAll={true}
        expandAllState={expandAll}
        onExpandAllToggle={toggleExpandAll}
      />
      <div className="pt-16 print:pt-0">
        <ResumeView
          data={resume}
          expandAll={expandAll}
          showAllWork={showAllWork}
          setShowAllWork={setShowAllWork}
          showAllContributions={showAllContributions}
          setShowAllContributions={setShowAllContributions}
          showAllProjects={showAllProjects}
          setShowAllProjects={setShowAllProjects}
          showAllEducation={showAllEducation}
          setShowAllEducation={setShowAllEducation}
          showAllCertificates={showAllCertificates}
          setShowAllCertificates={setShowAllCertificates}
          showAllTalks={showAllTalks}
          setShowAllTalks={setShowAllTalks}
          setExpandAll={setExpandAll}
        />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumePageContent />
    </Suspense>
  );
}
