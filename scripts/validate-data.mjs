import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { validateDataCollections } from "./data-validation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const names = ["events", "codes", "gamepasses", "crates", "toys"];
const collections = {};

for (const name of names) {
  collections[name] = JSON.parse(await readFile(path.join(root, "data", `${name}.json`), "utf8"));
}

const errors = validateDataCollections(collections);
if (errors.length) {
  console.error("Data validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Data validation passed for ${names.length} collections.`);
