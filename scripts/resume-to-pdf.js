import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { dirname } from "path";

const RESUME_URLS = {
  normal: "https://resume.milind.app",
  expanded: "https://resume.milind.app/?expand=true",
};

export async function printResumeToPdf() {
  const browser = await puppeteer.launch({ headless: true });

  const currentYear = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
    new Date()
  );

  const normalPage = await browser.newPage();
  await normalPage.goto(RESUME_URLS.normal, {
    waitUntil: "networkidle0",
  });

  const normalFilePath = `public/pdf/milind-mishra-resume-${currentYear}.pdf`;
  await mkdir(dirname(normalFilePath), { recursive: true });

  await normalPage.pdf({
    path: normalFilePath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "1cm",
      bottom: "1cm",
      left: "1cm",
      right: "1cm",
    },
  });

  const expandedPage = await browser.newPage();
  await expandedPage.goto(RESUME_URLS.expanded, {
    waitUntil: "networkidle0",
  });

  const expandedFilePath = `public/pdf/milind-mishra-full-resume-${currentYear}.pdf`;

  await expandedPage.pdf({
    path: expandedFilePath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "1cm",
      bottom: "1cm",
      left: "1cm",
      right: "1cm",
    },
  });

  await browser.close();
}

printResumeToPdf().catch(console.error);
