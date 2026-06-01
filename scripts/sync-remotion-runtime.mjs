import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const windowsScript = path.join(projectRoot, "scripts", "sync-remotion-runtime.ps1");

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
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
  if (process.platform !== "win32") {
    return;
  }

  await runProcess("powershell", [
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    windowsScript,
  ]);
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
