import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { dirname } from "path";
import { RESUME_CONFIG } from "../lib/config.ts";

const RESUME_URL = "https://resume.milind.app";

export async function printResumeToPdf() {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.goto(RESUME_URL, {
    waitUntil: "networkidle0",
  });

  const filePath = `public/pdf/${RESUME_CONFIG.pdfFilename}`;
  await mkdir(dirname(filePath), { recursive: true });

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
}

printResumeToPdf().catch(console.error);
