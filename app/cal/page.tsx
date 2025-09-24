"use client";

import { ebGaramond } from "@/lib/fonts";
import Cal from "@calcom/embed-react";

export default function CalPage() {
  return (
    <div className="w-full">
      <Cal
        calLink="milind/15min"
        config={{ theme: "light" }}
        className={ebGaramond.className}
        style={{
          font: "--font-eb-garamond",
        }}
      ></Cal>
    </div>
  );
}
