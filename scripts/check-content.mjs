// Post-build content checks for the area pages:
//   1. no dollar sign in any source file, the review document, or rendered page content/metadata
//   2. each FAQPage schema matches the visible FAQs exactly
//   3. each page contains every section its prompt requires, plus summary, metrics, FAQ and references
//   4. each page has 10 FAQs and 4 metrics
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { AREA_MODULES, REQUIRED_SECTIONS } from "./area-modules.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOLLAR = String.fromCharCode(36);
const failures = [];
const fail = (msg) => failures.push(msg);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// 1a. Source files and review document
const sourceFiles = ["app", "components", "content", "lib", "scripts"]
  .flatMap((d) => walk(path.join(root, d)))
  .concat([path.join(root, "AREA-PAGES-CONTENT.md")]);
for (const file of sourceFiles) {
  if (readFileSync(file, "utf8").includes(DOLLAR)) fail("Dollar sign found in " + path.relative(root, file));
}

function decode(html) {
  return html
    .replace(/<!-- -->/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const areas = await Promise.all(AREA_MODULES.map((m) => import(m).then((mod) => mod.default)));

for (const area of areas) {
  const label = area.slug;
  const htmlPath = path.join(root, ".next", "server", "app", area.slug + ".html");
  if (!existsSync(htmlPath)) {
    fail(label + ": prerendered HTML not found; run the build first");
    continue;
  }
  const html = readFileSync(htmlPath, "utf8");

  // 1b. Rendered head metadata and article content (framework hydration scripts excluded)
  const head = html.slice(0, html.indexOf("</head>"));
  const headMeta = (head.match(/<(title|meta)[^>]*>([^<]*<\/title>)?/g) || []).join("\n");
  const articleStart = html.indexOf("<article");
  const articleHtml = html.slice(articleStart, html.indexOf("</article>") + 10);
  if (headMeta.includes(DOLLAR)) fail(label + ": dollar sign in rendered metadata");
  if (articleHtml.includes(DOLLAR)) fail(label + ": dollar sign in rendered article content");
  if (JSON.stringify(area).includes(DOLLAR)) fail(label + ": dollar sign in content data");

  // 2. FAQPage schema vs visible FAQs
  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1])
  );
  const types = ldBlocks.map((b) => b["@type"]).sort().join(",");
  if (types !== "Article,BreadcrumbList,FAQPage") fail(label + ": unexpected JSON-LD types " + types);
  const faqSchema = ldBlocks.find((b) => b["@type"] === "FAQPage");
  const visible = [...articleHtml.matchAll(/<button id="faq-button-\d+"[^>]*><span>([\s\S]*?)<\/span>[\s\S]*?<div id="faq-panel-\d+"[^>]*><p>([\s\S]*?)<\/p><\/div>/g)].map(
    (m) => ({ q: decode(m[1]), a: decode(m[2]) })
  );
  if (!faqSchema) {
    fail(label + ": FAQPage schema missing");
  } else {
    const schemaPairs = faqSchema.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text }));
    if (schemaPairs.length !== visible.length) {
      fail(label + ": schema has " + schemaPairs.length + " FAQs, page shows " + visible.length);
    }
    schemaPairs.forEach((pair, i) => {
      const shown = visible[i];
      if (!shown || shown.q !== pair.q || shown.a !== pair.a) fail(label + ": FAQ " + (i + 1) + " schema/visible mismatch");
    });
  }
  if (area.faqs.length !== 10) fail(label + ": expected 10 FAQs, found " + area.faqs.length);
  if (area.metrics.length !== 4) fail(label + ": expected 4 metrics, found " + area.metrics.length);

  // 3. Required sections
  const required = ["summary-heading", "metrics-heading", "faq", "references"].concat(REQUIRED_SECTIONS[area.slug]);
  for (const id of required) {
    if (!articleHtml.includes('id="' + id + '"')) fail(label + ": missing section #" + id);
  }

  console.log(
    label + ": " + visible.length + " visible FAQs, " + (faqSchema ? faqSchema.mainEntity.length : 0) + " in schema, " +
      area.sections.length + " body sections"
  );
}

if (failures.length) {
  console.error("\nFAILED:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("\nAll content checks passed.");
