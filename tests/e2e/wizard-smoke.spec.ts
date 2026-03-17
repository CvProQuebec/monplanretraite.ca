import { expect, test } from "@playwright/test";

test.describe("Retirement wizard smoke", () => {
  test("loads profile and prestations sections without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", message => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });

    await page.goto("/wizard/profil");
    // WizardLayout h1 renders synchronously once WizardPage module loads
    const wizardHeading = page.locator('[data-testid="wizard-layout-heading"]');
    await expect(wizardHeading).toBeVisible({ timeout: 20_000 });

    await page.goto("/wizard/prestations");
    // WizardPage is lazy-loaded; wait for the heading to appear before asserting content
    const prestationsHeading = page.locator('[data-testid="prestations-heading"]');
    await expect(prestationsHeading).toBeVisible({ timeout: 20_000 });
    await expect(prestationsHeading).toContainText(/RRQ|QPP/i);

    expect(errors, "console errors").toHaveLength(0);
  });
});
