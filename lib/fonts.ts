import localFont from "next/font/local";

export const tsanger = localFont({
  src: [
    {
      path: "../public/fonts/TsangerJinKai02-W04.ttf",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});
