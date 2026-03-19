import { expect, test } from "@playwright/test";

test("tools catalogue displays gated cards", async ({ page }) => {
  await page.goto("/outils");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Trouvez le bon calculateur retraite|Find the right retirement calculator/i
    })
  ).toBeVisible();

  const cards = page.getByRole("region");
  await expect(cards.first()).toBeVisible();

  await expect(page.getByRole("heading", { name: /Assistant financier|Financial Assistant/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Ouvrir cet outil|Open this tool/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Mettre a niveau|Mettre à niveau|Upgrade/i }).first()).toBeVisible();
});
