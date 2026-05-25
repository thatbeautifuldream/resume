import { spawn, type ChildProcess } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outputPath = resolve(projectRoot, "public/resume.pdf");

const PORT = process.env.PDF_PORT ?? "3210";
const URL = `http://localhost:${PORT}/`;

function waitForServer(url: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now();
  return new Promise((resolvePromise, rejectPromise) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status < 500) return resolvePromise();
      } catch {}
      if (Date.now() - start > timeoutMs) {
        return rejectPromise(new Error(`Server did not start at ${url}`));
      }
      setTimeout(tick, 500);
    };
    tick();
  });
}

function startServer(): ChildProcess {
  const child = spawn(
    "pnpm",
    ["exec", "next", "start", "--port", PORT],
    {
      cwd: projectRoot,
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, PORT },
    },
  );
  return child;
}

async function ensureBuild() {
  return new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn("pnpm", ["exec", "next", "build"], {
      cwd: projectRoot,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`next build exited with code ${code}`));
    });
  });
}

async function main() {
  await mkdir(dirname(outputPath), { recursive: true });

  if (!process.env.PDF_SKIP_BUILD) {
    console.log("Building Next.js app...");
    await ensureBuild();
  }

  console.log(`Starting server on port ${PORT}...`);
  const server = startServer();

  const cleanup = () => {
    if (!server.killed) server.kill("SIGTERM");
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });

  try {
    await waitForServer(URL);
    console.log("Server up. Launching browser...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 60_000 });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    await browser.close();
    console.log(`Saved ${outputPath}`);
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
