import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export async function scanA11y(page: Page, tags: string[] = ["wcag2a", "wcag2aa"]) {
  const results = await new AxeBuilder({ page })
    .withTags(tags)
    .analyze();

  return {
    results,
    violations: results.violations ?? []
  };
}
