#!/usr/bin/env node
/**
 * Apply high-confidence FR↔EN relatedSlug links based on scripts/related-slugs-report.json
 * - Threshold: default 0.66 (can be overridden by env APPLY_THRESHOLD=0.75 for example)
 * - Ensures reciprocity (sets both relatedSlugFr and relatedSlugEn)
 * - Only fills when a side is missing (does not overwrite existing explicit links)
 * - Rewrites updated markdown files preserving frontmatter using gray-matter
 */
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "scripts/related-slugs-report.json");
const FR_DIR = path.join(ROOT, "src/pages/blog/posts/fr");
const EN_DIR = path.join(ROOT, "src/pages/blog/posts/en");

const THRESH = Number(process.env.APPLY_THRESHOLD || 0.66);

function loadJSON(p) {
  return fs.readFile(p, "utf8").then((t) => JSON.parse(t));
}

async function loadPosts(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => e.name);
  const map = new Map();
  for (const file of files) {
    const full = path.join(dir, file);
    const raw = await fs.readFile(full, "utf8");
    const fm = matter(raw);
    const slug = (fm.data.slug || "").toString().trim() || file.replace(/\.md$/, "");
    map.set(slug, { file, full, raw, fm, data: fm.data });
  }
  return map;
}

async function writeIfChanged(entry, newData) {
  const updated = matter.stringify(entry.fm.content, newData);
  if (updated !== entry.raw) {
    await fs.writeFile(entry.full, updated, "utf8");
    return true;
  }
  return false;
}

function normalizeSlug(s) {
  return (s || "").toString().trim();
}

async function main() {
  const report = await loadJSON(REPORT_PATH);
  const frPosts = await loadPosts(FR_DIR);
  const enPosts = await loadPosts(EN_DIR);

  const applied = [];
  const skipped = [];
  const missingSide = [];

  for (const s of report.suggestions || []) {
    const from = s.from;
    const best = s.bestCandidate || {};
    const score = Number(best.score ?? 0);

    if (score < THRESH) {
      skipped.push({ reason: "low-score", from, best });
      continue;
    }

    if (from.lang === "fr") {
      const frSlug = normalizeSlug(from.slug);
      const enSlug = normalizeSlug(best.enSlug);
      if (!frSlug || !enSlug) {
        skipped.push({ reason: "invalid-slug", from, best });
        continue;
      }
      const fr = frPosts.get(frSlug);
      const en = enPosts.get(enSlug);
      if (!fr || !en) {
        missingSide.push({ side: !fr ? "fr" : "en", from, best });
        continue;
      }

      // Only fill when missing (do not overwrite explicit manual links)
      const needFr = !fr.data.relatedSlugEn;
      const needEn = !en.data.relatedSlugFr;
      if (!needFr && !needEn) {
        skipped.push({ reason: "already-linked", from, best });
        continue;
      }

      let changed = false;
      if (needFr) {
        fr.data.relatedSlugEn = enSlug;
        const ch = await writeIfChanged(fr, fr.data);
        changed = changed || ch;
      }
      if (needEn) {
        en.data.relatedSlugFr = frSlug;
        const ch = await writeIfChanged(en, en.data);
        changed = changed || ch;
      }
      applied.push({ from, best, score, changed });
    } else if (from.lang === "en") {
      const enSlug = normalizeSlug(from.slug);
      const frSlug = normalizeSlug(best.frSlug);
      if (!frSlug || !enSlug) {
        skipped.push({ reason: "invalid-slug", from, best });
        continue;
      }
      const en = enPosts.get(enSlug);
      const fr = frPosts.get(frSlug);
      if (!fr || !en) {
        missingSide.push({ side: !fr ? "fr" : "en", from, best });
        continue;
      }

      const needEn = !en.data.relatedSlugFr;
      const needFr = !fr.data.relatedSlugEn;
      if (!needFr && !needEn) {
        skipped.push({ reason: "already-linked", from, best });
        continue;
      }

      let changed = false;
      if (needEn) {
        en.data.relatedSlugFr = frSlug;
        const ch = await writeIfChanged(en, en.data);
        changed = changed || ch;
      }
      if (needFr) {
        fr.data.relatedSlugEn = enSlug;
        const ch = await writeIfChanged(fr, fr.data);
        changed = changed || ch;
      }
      applied.push({ from, best, score, changed });
    }
  }

  const summary = {
    threshold: THRESH,
    appliedCount: applied.length,
    skippedCount: skipped.length,
    missingSideCount: missingSide.length,
  };

  const outPath = path.join(path.dirname(REPORT_PATH), "related-slugs-apply-report.json");
  await fs.writeFile(outPath, JSON.stringify({ summary, applied, skipped, missingSide }, null, 2), "utf8");

  console.log("High-confidence relatedSlug application completed.");
  console.log(summary);
  console.log(`Detailed report: ${path.relative(ROOT, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
