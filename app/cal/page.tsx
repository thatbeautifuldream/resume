"use client";

import Cal from "@calcom/embed-react";

export default function CalPage() {
  return (
    <div className="w-full">
      <Cal
        calLink="milind/15min"
        config={{ theme: "light" }}
        style={{
          font: "--font-eb-garamond",
        }}
      ></Cal>
    </div>
  );
}
