import { test, expect } from "@playwright/test";

test("Should check title", async ({ page }) => {
  await page.goto("http://katalon-demo-cura.herokuapp.com/");
  await expect(page).toHaveTitle(/CURA/);

  await expect(page.locator("//h1")).toContainText("CURA");

  

});
