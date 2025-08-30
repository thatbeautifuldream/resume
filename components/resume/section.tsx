import type * as React from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="pb-1 uppercase font-semibold border-b">{title}</h4>
      <div>{children}</div>
    </section>
  );
}
