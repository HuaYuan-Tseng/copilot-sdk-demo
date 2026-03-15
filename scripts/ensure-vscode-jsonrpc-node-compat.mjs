import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const vscodeJsonRpcDir = path.join(rootDir, "node_modules", "vscode-jsonrpc");
const sourceFile = path.join(vscodeJsonRpcDir, "node.js");
const compatFile = path.join(vscodeJsonRpcDir, "node");
const compatSource = 'export * from "./node.js";\n';

async function ensureFileExists(filePath) {
  await access(filePath);
}

async function writeCompatFile() {
  await ensureFileExists(sourceFile);

  let currentSource = null;

  try {
    currentSource = await readFile(compatFile, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  if (currentSource === compatSource) {
    console.log("vscode-jsonrpc compatibility shim already present");
    return;
  }

  await writeFile(compatFile, compatSource, "utf8");
  console.log("Created vscode-jsonrpc compatibility shim for Node ESM resolution");
}

await writeCompatFile();
