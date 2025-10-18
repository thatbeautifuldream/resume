import type { Certificates } from "@/lib/resume-schema";

export function CertificateItem({ item }: { item: Certificates }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline sm:flex-row flex-col sm:items-baseline">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            <strong>{item.name}</strong>
          </a>
        ) : (
          <strong>{item.name}</strong>
        )}
        <div className="sm:flex sm:gap-4 sm:items-baseline">
          {item.issuer && (
            <div className="italic hidden sm:block float-right">{item.issuer}</div>
          )}
          {item.date && <em className="sm:mt-0 mt-1 text-sm">{item.date}</em>}
        </div>
      </div>
      {item.issuer && <div className="italic sm:hidden">{item.issuer}</div>}
    </div>
  );
}
