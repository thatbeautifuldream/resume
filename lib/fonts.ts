import { STIX_Two_Text, Geist_Mono } from "next/font/google";

export const stixTwoText = STIX_Two_Text({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-stix-two-text",
  display: "swap",
});

export const geistMono = Geist_Mono({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
