import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const compositions = [
  "WensliTrainingIntro",
  "WensliTrainingGoals",
  "WensliTrainingOverview",
  "WensliTrainingGuide",
  "WensliTrainingEntry",
  "WensliTrainingPrompt",
  "WensliTrainingFilter",
  "WensliTrainingExport",
  "WensliTrainingBrowse",
  "WensliTrainingProduct",
  "WensliTrainingDetail",
  "WensliTrainingProfileChapter",
  "WensliTrainingProfileEntry",
  "WensliTrainingFiles",
  "WensliTrainingThanks",
  "WensliTrainingFull",
];

const run = (command, args) =>
  new Promise((resolve, reject) => {
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

const main = async () => {
  for (const compositionId of compositions) {
    const outputPath = path.join("public", "training-videos", `${compositionId}.mp4`);
    await run("node", [
      "scripts/run-remotion.mjs",
      "render",
      compositionId,
      outputPath,
    ]);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
