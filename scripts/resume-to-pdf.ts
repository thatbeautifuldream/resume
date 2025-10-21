import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { dirname } from "path";
import { RESUME_CONFIG } from "@/lib/config";

const RESUME_URL = "https://resume.milind.app";

export async function printResumeToPdf() {
  console.log(`Fetching resume from ${RESUME_URL}...`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(RESUME_URL, {
    waitUntil: "networkidle0",
  });

  const filePath = `public/pdf/${RESUME_CONFIG.pdfFilename}`;
  await mkdir(dirname(filePath), { recursive: true });

  console.log("Generating PDF...");
  await page.pdf({
    path: filePath,
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
  console.log(`Saved to ${filePath}`);
}

printResumeToPdf().catch(console.error);
