import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const remotionCli = path.join(
  projectRoot,
  "node_modules",
  "@remotion",
  "cli",
  "remotion-cli.js",
);
const windowsScript = path.join(projectRoot, "scripts", "run-remotion.ps1");
const entryPointCommands = new Set([
  "studio",
  "bundle",
  "render",
  "still",
  "compositions",
  "benchmark",
]);

function hasExplicitEntryPoint(args) {
  if (args.length < 2) {
    return false;
  }

  return /\.(jsx?|tsx?|mjs|mts|cjs|cts)$/i.test(args[1]);
}

function normalizeArgs(rawArgs) {
  if (rawArgs.length === 0) {
    return ["studio", "src/index.ts"];
  }

  const normalized = [...rawArgs];
  if (entryPointCommands.has(normalized[0]) && !hasExplicitEntryPoint(normalized)) {
    normalized.splice(1, 0, "src/index.ts");
  }

  return normalized;
}

function detectBrowserExecutable() {
  const candidatesByPlatform = {
    win32: [
      process.env.BROWSER_EXECUTABLE,
      process.env.PUPPETEER_EXECUTABLE_PATH,
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ],
    darwin: [
      process.env.BROWSER_EXECUTABLE,
      process.env.PUPPETEER_EXECUTABLE_PATH,
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Microsoft Edge Canary.app/Contents/MacOS/Microsoft Edge Canary",
    ],
    linux: [
      process.env.BROWSER_EXECUTABLE,
      process.env.PUPPETEER_EXECUTABLE_PATH,
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/snap/bin/chromium",
      "/usr/bin/microsoft-edge",
    ],
  };

  const candidates = candidatesByPlatform[process.platform] ?? [];
  for (const candidate of candidates) {
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        ...options.env,
      },
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `${command} exited due to signal ${signal}`
            : `${command} exited with code ${code ?? "unknown"}`,
        ),
      );
    });
  });
}

export async function main() {
  const rawArgs = process.argv.slice(2);

  if (process.platform === "win32") {
    await runProcess("powershell", [
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      windowsScript,
      ...rawArgs,
    ]);
    return;
  }

  const normalizedArgs = normalizeArgs(rawArgs);
  const browserExecutable = detectBrowserExecutable();
  const cliArgs = [remotionCli, ...normalizedArgs];

  if (
    browserExecutable &&
    !normalizedArgs.some(
      (arg) => arg === "--browser-executable" || arg.startsWith("--browser-executable="),
    )
  ) {
    cliArgs.push("--browser-executable", browserExecutable);
  }

  await runProcess("node", cliArgs);
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;

if (isMainModule) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

function pathToFileURL(filePath) {
  return new URL(`file://${path.resolve(filePath)}`);
}
