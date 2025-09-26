import { getResumeAsJsonLd } from "@/lib/transformers";

export function StructuredData() {
  const jsonLd = getResumeAsJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2),
      }}
    />
  );
}