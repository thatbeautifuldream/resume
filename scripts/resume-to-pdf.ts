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

      await waitForPortToBeFree(port);
    }
  } catch (error) {
    console.log(`No processes found using port ${port}`);
  }
}

async function waitForPortToBeFree(port: number): Promise<void> {
  const maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await execAsync(`lsof -ti:${port}`);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch {
      return;
    }
  }
  throw new Error(`Port ${port} is still in use after killing processes`);
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

  await waitForServerReady(LOCAL_PORT);
  return server;
}

async function waitForServerReady(port: number): Promise<void> {
  console.log(`Waiting for server to be ready on port ${port}...`);
  const maxAttempts = 30; // 3 seconds with 100ms intervals
  const checkInterval = 100;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`http://localhost:${port}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(500)
      });

      if (response.ok) {
        console.log(`Server is ready on http://localhost:${port}/`);
        return;
      }
    } catch {
    }

    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  throw new Error(`Server failed to start on port ${port} within ${maxAttempts * checkInterval / 1000} seconds`);
}

export async function printResumeToPdf() {
  let server: any = null;

  try {
    server = await startLocalServer();
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
  } finally {
    if (server) {
      console.log("Shutting down local server...");
      server.kill();
      server.unref();
    }
  }
}

printResumeToPdf().catch(console.error);
