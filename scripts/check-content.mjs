// Checks the Long Branch content against the brief: no dollar signs in source
// or rendered page text, no percentages except the statutory 100 percent standard,
// exactly ten FAQs, and every FAQ answer present in the rendered page.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import area from "../content/long-branch.js";

const DOLLAR = String.fromCharCode(36);
const EXTENSIONS = [".js", ".jsx", ".mjs", ".css", ".json", ".md"];
const errors = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (EXTENSIONS.some((ext) => name.endsWith(ext)) && name !== "package-lock.json") out.push(path);
  }
  return out;
}

for (const file of walk(".")) {
  if (readFileSync(file, "utf8").includes(DOLLAR)) errors.push("Dollar sign found in " + file);
}

const text = JSON.stringify(area);
if (/\d\s*%/.test(text)) errors.push("Percent sign found in content");
for (const match of text.matchAll(/(\d+)\s+percent/g)) {
  if (match[1] !== "100") errors.push("Non-statutory percentage in content: " + match[0]);
}

if (area.faqs.length !== 10) errors.push("Expected 10 FAQs, found " + area.faqs.length);

const html = ".next/server/app/" + area.slug + ".html";
if (existsSync(html)) {
  const built = readFileSync(html, "utf8");
  // React's script payloads and Suspense comment markers use the dollar sign
  // internally, so only markup outside scripts and comments is checked.
  const markup = built.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  if (markup.includes(DOLLAR)) errors.push("Dollar sign found in rendered page text");
  for (const faq of area.faqs) {
    if (!built.includes(JSON.stringify(faq.a).slice(1, -1))) errors.push("FAQ answer missing from JSON-LD: " + faq.q);
  }
  for (const id of area.sections.map((s) => s.id).concat(["summary", "faq", "references"])) {
    if (!built.includes('id="' + id + '"')) errors.push("Section missing from built HTML: " + id);
  }
} else {
  console.warn("No build output found; run `npm run build` first to check the rendered page.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Content checks passed.");
