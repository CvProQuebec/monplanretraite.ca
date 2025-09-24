import { expect, test } from "@playwright/test";
import { scanA11y } from "./utils/axe-helper";

const PAGES = [
  { path: "/", id: "home" },
  { path: "/wizard/profil", id: "wizard" },
  { path: "/planification-urgence", id: "emergency" },
  { path: "/outils", id: "tools" }
];

test.describe("Accessibility", () => {
  for (const pageConfig of PAGES) {
    test(`axe scan ${pageConfig.id}`, async ({ page }, testInfo) => {
      await page.goto(pageConfig.path);
      const { violations, results } = await scanA11y(page);
      await testInfo.attach(`axe-${pageConfig.id}.json`, {
        body: JSON.stringify(results, null, 2),
        contentType: "application/json"
      });
      expect(violations, "axe violations").toEqual([]);
    });
  }
});
