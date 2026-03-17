import { expect, test } from "@playwright/test";

test("tools catalogue displays gated cards", async ({ page }) => {
  await page.goto("/outils");

  // AllToolsPage is lazy-loaded; wait for the heading to appear before asserting content
  const heading = page.locator('[data-testid="tools-page-heading"]');
  await expect(heading).toBeVisible({ timeout: 20_000 });
  await expect(heading).toContainText(/Outils|Tools/i);

  // ToolCard renders role="region" with aria-label
  const cards = page.getByRole("region");
  await expect(cards.first()).toBeVisible();

  // Free tools show "Ouvrir l'outil"; locked (pro/expert) show "Mettre à niveau"
  await expect(page.getByRole("link", { name: /Ouvrir/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Mettre|Upgrade/i })).toBeVisible();
});
