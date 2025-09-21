#!/usr/bin/env node
/**
 * Report counts of EN blog posts per category.
 * Reads frontmatter from src/pages/blog/posts/en/*.md and aggregates category counts.
 */
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "src/pages/blog/posts/en");

async function main() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const files = entries.filter(e => e.isFile() && e.name.endsWith(".md")).map(e => e.name);

  const counts = {};
  const filesByCategory = {};

  for (const name of files) {
    const full = path.join(POSTS_DIR, name);
    const raw = await fs.readFile(full, "utf8");
    const fm = matter(raw);
    const cat = typeof fm.data.category === "string" ? fm.data.category : "(none)";
    counts[cat] = (counts[cat] || 0) + 1;
    if (!filesByCategory[cat]) filesByCategory[cat] = [];
    filesByCategory[cat].push(name);
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log("EN Blog Category Counts:");
  for (const [cat, n] of sorted) {
    console.log(`${n.toString().padStart(2, " ")} - ${cat}`);
  }
  const total = files.length;
  console.log(`Total EN posts: ${total}`);

  // Write a JSON report as well
  const reportPath = path.join(ROOT, "scripts/en-category-counts-report.json");
  await fs.writeFile(reportPath, JSON.stringify({ counts, total, filesByCategory }, null, 2), "utf8");
  console.log(`Report written: ${path.relative(ROOT, reportPath)}`);
}

main().catch(err => {
  console.error("Error generating category counts:", err);
  process.exit(1);
});
