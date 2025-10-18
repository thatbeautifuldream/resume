import localFont from "next/font/local";

export const optimisticDisplay = localFont({
  src: [
    {
      path: "../public/fonts/optimistic/Optimistic_Display_W_Md.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/optimistic/Optimistic_Display_W_SBd.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/optimistic/Optimistic_Display_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-optimistic-display",
  display: "swap",
});

export const optimisticText = localFont({
  src: [
    {
      path: "../public/fonts/optimistic/Optimistic_Text_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/optimistic/Optimistic_Text_W_It.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/optimistic/Optimistic_Text_W_Md.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/optimistic/Optimistic_Text_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-optimistic-text",
  display: "swap",
});

export const sourceCodePro = localFont({
  src: [
    {
      path: "../public/fonts/source-code-pro/Source-Code-Pro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/source-code-pro/Source-Code-Pro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-source-code-pro",
  display: "swap",
});
