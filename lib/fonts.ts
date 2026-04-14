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
