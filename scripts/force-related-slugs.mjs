#!/usr/bin/env node
/**
 * Force explicit FR↔EN relatedSlug pairs (overrides incorrect links if any).
 * Use when auto-matching is insufficient. Ensures reciprocity on both sides.
 */
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const FR_DIR = path.join(ROOT, "src/pages/blog/posts/fr");
const EN_DIR = path.join(ROOT, "src/pages/blog/posts/en");

// Explicit pairs to enforce
const PAIRS = [
  // Evident correspondences
  { fr: "comment-faire-durer-son-argent-toute-sa-vie", en: "make-money-last-lifetime" },
  { fr: "comment-proteger-ses-economies-de-l-inflation", en: "protect-savings-inflation" },
  { fr: "rester-chez-soi-ou-aller-en-residence-planifier-les-couts", en: "staying-home-residence" },
  { fr: "comment-choisir-un-conseiller-financier-de-confiance", en: "financial-advisor" },
  { fr: "les-calculateurs-en-ligne-lesquels-utiliser-et-comment", en: "online-calculators" },
  { fr: "le-fractionnement-de-revenus-explique-simplement", en: "income-splitting-simple" },
  { fr: "nouveaux-plafonds-de-cotisation-ce-que-ca-change-pour-vous", en: "contribution-limits-2025" },
  { fr: "de-combien-d-argent-ai-je-vraiment-besoin-calculer-ses-besoins-sans-se-casser-la-tete", en: "retirement-money-needs" },
  { fr: "que-faire-si-vous-avez-travaille-au-quebec-et-dans-une-autre-province", en: "work-quebec-other-provinces" },
  { fr: "comment-rester-actif-et-en-sante-a-la-retraite", en: "staying-active-healthy-retirement" },
  { fr: "comment-eviter-les-7-pieges-les-plus-courants-de-la-retraite", en: "retirement-traps-avoid" },
  { fr: "l-ordre-intelligent-pour-retirer-son-argent-a-la-retraite", en: "smart-withdrawal-order" },
  { fr: "les-trois-piliers-de-votre-retraite-rrq-rpc-regimes-d-employeur-et-epargne-personnelle-expliques-simplement", en: "three-pillars-retirement" },
  { fr: "ou-trouver-de-l-aide-gratuite-pour-planifier-sa-retraite", en: "free-retirement-help" },
  { fr: "comment-partager-les-revenus-de-retraite-et-economiser-des-impots", en: "income-sharing-couples" },
  // Additional explicit mappings to close remaining gaps
  { fr: "que-faire-quand-un-conjoint-veut-partir-avant-l-autre", en: "retirement-timing-couples" },
  { fr: "planifier-la-retraite-en-couple-eviter-les-surprises", en: "couple-retirement-planning" },
  { fr: "gerer-l-anxiete-face-a-l-argent-a-la-retraite", en: "managing-retirement-money-anxiety" },
  { fr: "conges-de-maternite-et-retraite-comment-rattraper-le-retard", en: "maternity-leave-retirement" },
];

async function loadPost(dir, slug) {
  const file = `${slug}.md`;
  const full = path.join(dir, file);
  const raw = await fs.readFile(full, "utf8");
  const fm = matter(raw);
  return { file, full, raw, fm, data: fm.data };
}

async function writeIfChanged(entry, data) {
  const updated = matter.stringify(entry.fm.content, data);
  if (updated !== entry.raw) {
    await fs.writeFile(entry.full, updated, "utf8");
    return true;
  }
  return false;
}

async function main() {
  const results = [];
  for (const { fr, en } of PAIRS) {
    try {
      const frEntry = await loadPost(FR_DIR, fr);
      const enEntry = await loadPost(EN_DIR, en);

      // Set reciprocity explicitly (override if mismatched)
      const before = {
        frRelatedEn: frEntry.data.relatedSlugEn || null,
        enRelatedFr: enEntry.data.relatedSlugFr || null,
      };

      frEntry.data.relatedSlugEn = en;
      enEntry.data.relatedSlugFr = fr;

      const frChanged = await writeIfChanged(frEntry, frEntry.data);
      const enChanged = await writeIfChanged(enEntry, enEntry.data);

      results.push({
        pair: { fr, en },
        before,
        changed: { fr: frChanged, en: enChanged },
      });
    } catch (err) {
      results.push({ pair: { fr, en }, error: String(err) });
    }
  }

  const outPath = path.join(ROOT, "scripts", "force-related-slugs-report.json");
  await fs.writeFile(outPath, JSON.stringify({ results }, null, 2), "utf8");
  console.log("Forced relatedSlug pairs applied. Report:", path.relative(ROOT, outPath));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
