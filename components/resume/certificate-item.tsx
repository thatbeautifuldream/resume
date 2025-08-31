import type { Certificates } from "@/lib/resume-schema"

export function CertificateItem({ item }: { item: Certificates }) {
  return (
    <div>
      <div className="flex justify-between items-baseline">
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
        {item.date && <em>{item.date}</em>}
      </div>
      {item.issuer && <div className="italic mb-2">{item.issuer}</div>}
    </div>
  )
}