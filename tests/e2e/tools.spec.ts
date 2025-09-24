import { expect, test } from "@playwright/test";

test("tools catalogue displays gated cards", async ({ page }) => {
  await page.goto("/outils");
  await expect(page.getByRole("heading", { level: 1, name: /Outils|Tools/i })).toBeVisible();

  const cards = page.getByRole("region");
  await expect(cards.first()).toBeVisible();

  await expect(page.getByRole("link", { name: /Ouvrir/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Mettre|Upgrade/i })).toBeVisible();
});
