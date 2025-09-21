#!/usr/bin/env node
/**
 * Link relatedSlugFr / relatedSlugEn between FR and EN blog posts.
 * - Ensures reciprocity when one side is already present
 * - Inventories missing links and proposes best candidate based on slug token similarity with FR→EN keyword mapping
 * - By default, only applies reciprocal fixes where the counterpart is explicitly provided.
 * - Writes a report JSON with summary and suggestions for manual review.
 *
 * Directories:
 *  - FR: src/pages/blog/posts/fr
 *  - EN: src/pages/blog/posts/en
 */
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const FR_DIR = path.join(ROOT, "src/pages/blog/posts/fr");
const EN_DIR = path.join(ROOT, "src/pages/blog/posts/en");
const REPORT_PATH = path.join(ROOT, "scripts/related-slugs-report.json");

/** Normalize for comparison: lowercase, strip accents/diacritics, keep a-z0-9 and dashes/spaces */
function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeSlug(s = "") {
  const n = normalize(s).replace(/-/g, " ");
  return n.split(/\s+/).filter(Boolean);
}

/** FR → EN keyword hints to improve matching across languages */
const FR_TO_EN = new Map([
  // Government programs
  ["sv", "oas"],
  ["securite", "security"],
  ["vieillesse", "old"],
  ["securite de la vieillesse", "old age security"],
  ["rrq", "qpp"],
  ["rpc", "cpp"],

  // Accounts
  ["celi", "tfsa"],
  ["reer", "rrsp"],

  // Tax
  ["impot", "tax"],
  ["impots", "taxes"],
  ["fiscalite", "tax"],
  ["fiscalitee", "tax"],

  // Themes
  ["retraite", "retirement"],
  ["couple", "couples"],
  ["femmes", "women"],
  ["veuvage", "widowhood"],
  ["soins", "healthcare"],
  ["sante", "health"],
  ["fraudes", "fraud"],
  ["documents", "documents"],
  ["conseiller", "advisor"],
  ["demenager", "moving"],
  ["residence", "residence"],
  ["outils", "tools"],
  ["ressources", "resources"],
  ["categorie", "category"],
  ["cout", "cost"],
  ["vie", "living"],
  ["gratuites", "free"],
  ["peu", "low"],
  ["couteuses", "cost"],
  ["activites", "activities"],
]);

/** Map FR tokens to EN aliases for scoring */
function mapFrTokenToEn(token) {
  if (!token) return token;
  const mapped = FR_TO_EN.get(token);
  if (mapped) return normalize(mapped).replace(/-/g, " ");
  return token;
}

/** Score similarity between FR slug tokens (mapped) and EN slug tokens */
function scoreFrToEnTokens(frSlug, enSlug) {
  const frTokensRaw = tokenizeSlug(frSlug);
  // Map FR→EN tokens where possible
  const frTokens = frTokensRaw
    .map(mapFrTokenToEn)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean);

  const enTokens = tokenizeSlug(enSlug);
  const frSet = new Set(frTokens);
  const enSet = new Set(enTokens);
  const inter = [...frSet].filter((t) => enSet.has(t));
  const interSize = inter.length;
  const denom = Math.max(1, Math.min(frSet.size, enSet.size));
  return interSize / denom; // ratio vs smaller set size
}

async function loadPosts(dir, lang) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => e.name);

  const posts = [];
  for (const file of files) {
    const full = path.join(dir, file);
    const raw = await fs.readFile(full, "utf8");
    const fm = matter(raw);
    const slug = (fm.data.slug || "").toString().trim() || file.replace(/\.md$/, "");
    posts.push({
      file,
      full,
      slug,
      lang,
      fmData: fm.data || {},
      fm,
      raw,
    });
  }
  return posts;
}

async function main() {
  const frPosts = await loadPosts(FR_DIR, "fr");
  const enPosts = await loadPosts(EN_DIR, "en");

  const byFrSlug = new Map(frPosts.map((p) => [p.slug, p]));
  const byEnSlug = new Map(enPosts.map((p) => [p.slug, p]));

  const updates = [];
  const alreadyLinked = [];
  const missingPairs = [];

  // First pass: ensure reciprocity where related is provided on either side
  for (const fr of frPosts) {
    const relEn = fr.fmData.relatedSlugEn && fr.fmData.relatedSlugEn.toString().trim();
    if (relEn && byEnSlug.has(relEn)) {
      const en = byEnSlug.get(relEn);
      const needUpdate = en.fmData.relatedSlugFr !== fr.slug;
      if (needUpdate) {
        en.fmData.relatedSlugFr = fr.slug;
        const updated = matter.stringify(en.fm.content, en.fmData);
        if (updated !== en.raw) {
          await fs.writeFile(en.full, updated, "utf8");
          updates.push({ action: "set-relatedSlugFr", file: en.file, value: fr.slug });
        }
      } else {
        alreadyLinked.push({ fr: fr.slug, en: en.slug });
      }
    }
  }

  for (const en of enPosts) {
    const relFr = en.fmData.relatedSlugFr && en.fmData.relatedSlugFr.toString().trim();
    if (relFr && byFrSlug.has(relFr)) {
      const fr = byFrSlug.get(relFr);
      const needUpdate = fr.fmData.relatedSlugEn !== en.slug;
      if (needUpdate) {
        fr.fmData.relatedSlugEn = en.slug;
        const updated = matter.stringify(fr.fm.content, fr.fmData);
        if (updated !== fr.raw) {
          await fs.writeFile(fr.full, updated, "utf8");
          updates.push({ action: "set-relatedSlugEn", file: fr.file, value: en.slug });
        }
      } else {
        alreadyLinked.push({ fr: fr.slug, en: en.slug });
      }
    }
  }

  // Second pass: find posts missing linkage on both sides; propose best candidates
  const frMissing = frPosts.filter((p) => !p.fmData.relatedSlugEn);
  const enMissing = enPosts.filter((p) => !p.fmData.relatedSlugFr);

  const suggestions = [];

  // For each FR missing, find best EN
  for (const fr of frMissing) {
    // If an EN already references this FR (one-way), we handled above; skip here
    const candidates = enPosts
      .map((en) => ({
        enSlug: en.slug,
        score: scoreFrToEnTokens(fr.slug, en.slug),
      }))
      .sort((a, b) => b.score - a.score);

    const best = candidates[0];
    suggestions.push({
      from: { lang: "fr", slug: fr.slug, file: fr.file },
      bestCandidate: best,
      top5: candidates.slice(0, 5),
    });

    if (!best || best.score < 0.5) {
      missingPairs.push({ lang: "fr", slug: fr.slug, file: fr.file });
    }
  }

  // For each EN missing, find best FR
  for (const en of enMissing) {
    const candidates = frPosts
      .map((fr) => ({
        frSlug: fr.slug,
        // Re-use scoring in reverse by swapping arguments (tokens symmetric enough)
        score: scoreFrToEnTokens(fr.slug, en.slug),
      }))
      .sort((a, b) => b.score - a.score);

    const best = candidates[0];
    suggestions.push({
      from: { lang: "en", slug: en.slug, file: en.file },
      bestCandidate: best,
      top5: candidates.slice(0, 5),
    });

    if (!best || best.score < 0.5) {
      missingPairs.push({ lang: "en", slug: en.slug, file: en.file });
    }
  }

  const report = {
    summary: {
      frCount: frPosts.length,
      enCount: enPosts.length,
      updatesApplied: updates.length,
      alreadyLinkedCount: alreadyLinked.length,
      frMissingCount: frMissing.length,
      enMissingCount: enMissing.length,
    },
    updates,
    alreadyLinked,
    missingPairs,
    suggestions,
  };

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  console.log("relatedSlug linking completed.");
  console.log(`FR posts: ${frPosts.length}, EN posts: ${enPosts.length}`);
  console.log(`Updates applied: ${updates.length}, already linked: ${alreadyLinked.length}`);
  console.log(`Report written: ${path.relative(ROOT, REPORT_PATH)}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
