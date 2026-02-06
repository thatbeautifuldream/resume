"use client";

import { Loading } from "@/components/loading";
import { ResumeView } from "@/components/resume";
import { resume } from "@/lib/resume";
import { Header } from "@/components/header";
import { Suspense } from "react";
import { motion } from "motion/react";
import { useChatSidebar } from "@/components/providers/chat-sidebar-provider";
import { useIsDesktop } from "@/hooks/use-media-query";

export default function Page() {
  const { isOpen } = useChatSidebar();
  const isDesktop = useIsDesktop();

  return (
    <motion.div
      animate={{
        marginRight: isOpen && isDesktop ? "480px" : "0",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="print:!mr-0"
    >
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[60px] print:pt-0">
        <Suspense fallback={<Loading />}>
          <ResumeView data={resume} />
        </Suspense>
      </main>
    </motion.div>
  );
}
