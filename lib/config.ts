export const RESUME_CONFIG = {
  pdfFilename: `milind-mishra-resume-${new Intl.DateTimeFormat("en", { year: "numeric" }).format(new Date())}.pdf`,
  pdfPath: () => `/pdf/${RESUME_CONFIG.pdfFilename}`,
} as const;
