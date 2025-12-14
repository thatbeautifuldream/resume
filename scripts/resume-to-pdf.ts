import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { dirname } from "path";
import { spawn, exec } from "child_process";
import { promisify } from "util";
import { RESUME_CONFIG } from "@/lib/config";

const LOCAL_PORT = 3000;
const RESUME_URL = `http://localhost:${LOCAL_PORT}`;
const execAsync = promisify(exec);

async function killPortProcess(port: number): Promise<void> {
  try {
    console.log(`Checking for processes using port ${port}...`);
    const { stdout } = await execAsync(`lsof -ti:${port}`);

    if (stdout.trim()) {
      const pids = stdout.trim().split('\n');
      console.log(`Found processes using port ${port}: ${pids.join(', ')}`);

      for (const pid of pids) {
        try {
          await execAsync(`kill -9 ${pid}`);
          console.log(`Killed process ${pid} using port ${port}`);
        } catch (error) {
          console.warn(`Failed to kill process ${pid}:`, error);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.log(`No processes found using port ${port}`);
  }
}

async function startLocalServer() {
  await killPortProcess(LOCAL_PORT);
  console.log("Building the application...");

  await new Promise<void>((resolve, reject) => {
    const build = spawn("pnpm", ["run", "build"], {
      stdio: "inherit"
    });

    build.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });

  console.log("Starting local server...");

  const server = spawn("pnpm", ["run", "start"], {
    stdio: "pipe"
  });

  await new Promise<void>((resolve, reject) => {
    let ready = false;

    server.stdout?.on("data", (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes("localhost") || output.includes(`started server on`) || output.includes(`ready on`)) {
        ready = true;
        resolve();
      }
    });

    server.stderr?.on("data", (data) => {
      console.error(data.toString());
    });

    setTimeout(() => {
      if (!ready) {
        reject(new Error("Server did not start within 30 seconds"));
      }
    }, 30000);
  });

  return server;
}

export async function printResumeToPdf() {
  let server: any = null;

  try {
    server = await startLocalServer();
    console.log(`Fetching resume from ${RESUME_URL}...`);

    await new Promise(resolve => setTimeout(resolve, 2000));

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
  } finally {
    if (server) {
      console.log("Shutting down local server...");
      server.kill();
    }
  }
}

printResumeToPdf().catch(console.error);
