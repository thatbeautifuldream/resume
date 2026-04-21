import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/InterVariable.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const newsreader = localFont({
  src: [
    {
      path: "../public/fonts/Newsreader.woff2",
      style: "normal",
      weight: "400 500",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
