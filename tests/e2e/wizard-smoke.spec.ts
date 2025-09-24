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
    await expect(page.locator("body")).toContainText(/Profil|Profile/i);

    await page.goto("/wizard/prestations");
    await expect(page.locator("body")).toContainText(/RRQ|QPP|SV|OAS/i);

    expect(errors, "console errors").toHaveLength(0);
  });
});
