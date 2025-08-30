import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milind's Resume",
  description:
    "Milind's resume with LaTeX-inspired styling and dark/light mode support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://latex.vercel.app/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
