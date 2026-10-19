// Writes AREA-PAGES-CONTENT.md from the area content files so the review
// document always matches what the pages render.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { AREA_MODULES } from "./area-modules.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function tableToText(block) {
  const lines = ["**" + block.caption + "**", ""];
  lines.push("| " + block.head.join(" | ") + " |");
  lines.push("| " + block.head.map(() => "---").join(" | ") + " |");
  for (const row of block.rows) lines.push("| " + row.join(" | ") + " |");
  return lines.join("\n");
}

function blockToText(block) {
  switch (block.type) {
    case "h3":
      return "### " + block.text;
    case "list":
      return block.items.map((i) => "- " + i).join("\n");
    case "table":
      return tableToText(block);
    case "note":
      return "> " + block.text;
    default:
      return block.text;
  }
}

function areaToText(area, index) {
  const out = [];
  out.push("# Page " + (index + 1) + ": " + area.placeShortName);
  out.push("");
  out.push("- Route: /" + area.slug);
  out.push("- Meta title: " + area.metaTitle);
  out.push("- Meta description: " + area.metaDescription);
  out.push("- Homepage card title: " + area.card.title);
  out.push("- Homepage card teaser: " + area.card.teaser);
  out.push("");
  out.push("## " + area.title);
  out.push("");
  out.push("*" + area.dek + "*");
  out.push("");
  out.push("## Executive Summary");
  out.push("");
  for (const p of area.summary) out.push(p, "");
  out.push("### Key Takeaways");
  out.push("");
  for (const t of area.takeaways) out.push("- " + t);
  out.push("");
  out.push("## Key Metrics");
  out.push("");
  for (const m of area.metrics) out.push("- **" + m.label + ":** " + m.value + " — " + m.note);
  out.push("");
  for (const s of area.sections) {
    out.push("## " + s.heading);
    out.push("");
    for (const b of s.blocks) out.push(blockToText(b), "");
  }
  out.push("## Frequently Asked Questions");
  out.push("");
  for (const f of area.faqs) out.push("**" + f.q + "**", "", f.a, "");
  out.push("## References and Disclaimers");
  out.push("");
  out.push("### Academic and Primary References");
  out.push("");
  area.references.forEach((r, i) => out.push(i + 1 + ". " + r.text + (r.url ? " <" + r.url + ">" : "")));
  out.push("");
  out.push("### Statutory and Editorial Disclaimers");
  out.push("");
  for (const d of area.disclaimers) out.push(d, "");
  return out.join("\n");
}

const areas = await Promise.all(AREA_MODULES.map((m) => import(m).then((mod) => mod.default)));

const header = [
  "# Area Pages Content — Batch 1",
  "",
  "Full written text of the five area pages for content review. Generated from `content/areas/*.js` by `npm run content:md`; edit the content files, not this document.",
  "",
  "---",
  "",
].join("\n");

const body = areas.map(areaToText).join("\n\n---\n\n");
writeFileSync(path.join(root, "AREA-PAGES-CONTENT.md"), header + body + "\n");
console.log("Wrote AREA-PAGES-CONTENT.md for " + areas.length + " pages.");
