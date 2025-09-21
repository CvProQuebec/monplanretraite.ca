#!/usr/bin/env node
/**
 * Categorize EN blog posts according to the agreed mapping.
 * - Normalizes existing FR category labels to EN
 * - Adds missing category fields
 * - Leaves other frontmatter fields untouched
 *
 * Directory: src/pages/blog/posts/en
 */
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "src/pages/blog/posts/en");

// Final category names (English)
const C = {
  RETIREMENT_BASICS: "Retirement basics",
  GOV_PROGRAMS: "Government programs",
  MANAGE_SAVINGS: "Manage savings and investments",
  COUPLES: "Planning for couples",
  WOMEN: "Women-specific challenges",
  PRACTICAL: "Practical everyday aspects",
  TAX_SIMPLE: "Simple taxation",
  SEASONAL: "Seasonal and current topics",
  TOOLS: "Tools and resources",
  WELL_BEING: "Well-being and quality of life",
};

// File → Category mapping
const categoryMap = {
  // Retirement basics
  "why-keep-60-to-75-pourcent-in-stocks-during-retirement-the-modern-planning-revolution.md": C.RETIREMENT_BASICS,
  "the-4-pourcent-rule-the-modern-withdrawal-strategy-that-revolutionizes-retirement.md": C.RETIREMENT_BASICS,
  "rrsp-vs-tfsa-the-complete-decision-guide-to-maximize-your-retirement-savings.md": C.RETIREMENT_BASICS,
  "retirement-ages-portfolio.md": C.RETIREMENT_BASICS,
  "retirement-money-needs.md": C.RETIREMENT_BASICS,
  "three-pillars-retirement.md": C.RETIREMENT_BASICS,
  "retirement-traps-avoid.md": C.RETIREMENT_BASICS,
  "full-retirement-or-partial-retirement-the-advantages-of-each-option.md": C.RETIREMENT_BASICS,
  "retirement-budget-what-really-changes.md": C.RETIREMENT_BASICS,

  // Government programs
  "old-age-security-what-you-need-to-know.md": C.GOV_PROGRAMS,
  "gis-eligibility-are-you-eligible.md": C.GOV_PROGRAMS,
  "delaying-government-pensions-why-it-can-pay-off.md": C.GOV_PROGRAMS,
  "qpp-and-cpp-when-to-apply-to-get-the-maximum.md": C.GOV_PROGRAMS,
  "work-quebec-other-provinces.md": C.GOV_PROGRAMS,
  "how-to-optimize-your-qpp-cpp-and-old-age-security-benefits-the-complete-strategic-guide.md": C.GOV_PROGRAMS,

  // Manage savings and investments
  "rrsp-tfsa-55plus.md": C.MANAGE_SAVINGS,
  "make-money-last-lifetime.md": C.MANAGE_SAVINGS,
  "smart-withdrawal-order.md": C.MANAGE_SAVINGS,
  "debt-retirement.md": C.MANAGE_SAVINGS,
  "protect-savings-inflation.md": C.MANAGE_SAVINGS,

  // Planning for couples
  "couple-retirement-planning.md": C.COUPLES,
  "retirement-timing-couples.md": C.COUPLES,
  "income-sharing-couples.md": C.COUPLES,
  "retirement-separation.md": C.COUPLES,

  // Women-specific challenges
  "women-retirement.md": C.WOMEN,
  "maternity-leave-retirement.md": C.WOMEN,
  "widowhood-finances.md": C.WOMEN,

  // Practical everyday aspects
  "financial-advisor.md": C.PRACTICAL,
  "moving-retirement.md": C.PRACTICAL,
  "staying-home-residence.md": C.PRACTICAL,
  "healthcare-retirement.md": C.PRACTICAL,
  "financial-fraud-65.md": C.PRACTICAL,

  // Simple taxation
  "retirement-tax-changes.md": C.TAX_SIMPLE,
  "saving-taxes-retirement.md": C.TAX_SIMPLE,
  "income-splitting-simple.md": C.TAX_SIMPLE,

  // Seasonal and current topics
  "contribution-limits-2025.md": C.SEASONAL,
  "cost-of-living-retirement.md": C.SEASONAL,
  "tax-return-retirement.md": C.SEASONAL,

  // Tools and resources
  "online-calculators.md": C.TOOLS,
  "free-retirement-help.md": C.TOOLS,
  "important-retirement-documents.md": C.TOOLS,

  // Well-being and quality of life
  "staying-active-healthy-retirement.md": C.WELL_BEING,
  "managing-retirement-money-anxiety.md": C.WELL_BEING,
  "free-or-low-cost-activities-for-retirees.md": C.WELL_BEING,
};

// Normalize FR category values that may already exist
const FR_TO_EN = new Map([
  ["Les bases de la retraite", C.RETIREMENT_BASICS],
  ["Comprendre les régimes gouvernementaux", C.GOV_PROGRAMS],
  ['"Les bases de la retraite"', C.RETIREMENT_BASICS],
  ['"Comprendre les régimes gouvernementaux"', C.GOV_PROGRAMS],
]);

async function main() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name);

  const summary = {
    totalFiles: mdFiles.length,
    updated: [],
    unchanged: [],
    missingMapping: [],
  };

  for (const filename of mdFiles) {
    const fullPath = path.join(POSTS_DIR, filename);
    const raw = await fs.readFile(fullPath, "utf8");
    const fm = matter(raw);

    const desiredCategory = categoryMap[filename];
    if (!desiredCategory) {
      summary.missingMapping.push(filename);
      continue;
    }

    let current = fm.data?.category;
    let changed = false;

    // Normalize FR → EN if needed
    if (typeof current === "string" && FR_TO_EN.has(current)) {
      current = FR_TO_EN.get(current);
      fm.data.category = current;
      changed = true;
    }

    // Apply desired category if missing or different
    if (!current || current !== desiredCategory) {
      fm.data.category = desiredCategory;
      changed = true;
    }

    if (changed) {
      const updated = matter.stringify(fm.content, fm.data);
      if (updated !== raw) {
        await fs.writeFile(fullPath, updated, "utf8");
        summary.updated.push({ filename, category: fm.data.category });
        continue;
      }
    }

    summary.unchanged.push({ filename, category: desiredCategory });
  }

  // Write a small report next to the script
  const reportPath = path.join(ROOT, "scripts/categorize-en-posts-report.json");
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2), "utf8");

  // Human-friendly console output
  console.log("Categorization completed.");
  console.log(`Total files: ${summary.totalFiles}`);
  console.log(`Updated: ${summary.updated.length}`);
  console.log(`Unchanged: ${summary.unchanged.length}`);
  console.log(`Missing mapping: ${summary.missingMapping.length}`);
  if (summary.missingMapping.length) {
    console.log("Files missing mapping:");
    for (const f of summary.missingMapping) console.log(" -", f);
  }
}

main().catch((err) => {
  console.error("Error during categorization:", err);
  process.exit(1);
});
