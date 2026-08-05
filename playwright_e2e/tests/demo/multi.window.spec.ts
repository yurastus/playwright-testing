import { test, expect } from "@playwright/test";

test("should handle opening and switching between windows", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/windows");

  await expect(page.locator("h3")).toContainText("Opening a new window");

  const [newPage] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: /click here/i }).click(),
  ]);

  await newPage.waitForLoadState("domcontentloaded");
  await expect(newPage.locator("h3")).toContainText("New Window");

  await page.bringToFront();
  await expect(page.locator("h3")).toContainText("Opening a new window");
});
