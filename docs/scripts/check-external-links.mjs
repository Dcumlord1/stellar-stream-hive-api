#!/usr/bin/env node
// Checks that external (http/https) links in page.mdx files still resolve.
// Unlike check-links.mjs (internal /docs links, checked on every PR), this
// is meant to run on a schedule: external sites rot silently and a
// transient failure shouldn't block a PR, so this script never exits
// non-zero — it just prints a summary for the job log.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(DOCS_ROOT, "app", "docs");
const LINK = /\]\(([^)\s]+)\)/g;

const TIMEOUT_MS = 10_000;
const RETRIES = 2;

async function findPages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findPages(full)));
    else if (entry.name === "page.mdx") files.push(full);
  }
  return files;
}

function proseLines(text) {
  let inFence = false;
  return text.split("\n").map((line) => {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      return null;
    }
    return inFence ? null : line;
  });
}

async function checkUrl(url) {
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
      if (res.status === 405 || res.status === 501) {
        res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
      }
      clearTimeout(timer);
      if (res.ok) return { ok: true };
      if (attempt === RETRIES) return { ok: false, detail: `HTTP ${res.status}` };
    } catch (err) {
      clearTimeout(timer);
      if (attempt === RETRIES) return { ok: false, detail: err.message };
    }
  }
  return { ok: false, detail: "unknown error" };
}

const pages = await findPages(PAGES_DIR);
const links = new Map(); // url -> [{ file, lineNumber }]

for (const file of pages) {
  const prose = proseLines(await readFile(file, "utf8"));
  prose.forEach((line, index) => {
    if (line === null) return;
    for (const match of line.matchAll(LINK)) {
      const target = match[1];
      if (!/^https?:/.test(target)) continue;
      const where = `${path.relative(DOCS_ROOT, file)}:${index + 1}`;
      if (!links.has(target)) links.set(target, []);
      links.get(target).push(where);
    }
  });
}

console.log(`Checking ${links.size} unique external links across ${pages.length} pages...`);

const broken = [];
for (const [url, locations] of links) {
  const result = await checkUrl(url);
  if (!result.ok) broken.push({ url, locations, detail: result.detail });
}

console.log("");
if (broken.length === 0) {
  console.log(`All ${links.size} external links resolved.`);
} else {
  console.log(`## External link check summary: ${broken.length} of ${links.size} links failed`);
  for (const { url, locations, detail } of broken) {
    console.log(`- ${url} (${detail})`);
    for (const where of locations) console.log(`    used at ${where}`);
  }
}

// Intentionally does not set process.exitCode: this check runs on a
// schedule, is informational, and must never fail a PR.
