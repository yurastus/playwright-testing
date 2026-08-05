import test, { Locator, Page } from "@playwright/test";

async function takeFullPageScreenshot(page: Page, screenshotName: string) {
  const screenShot = await page.screenshot({ fullPage: true });

  await test.info().attach(screenshotName, {
    body: screenShot,
    contentType: "image/png",
  });
}

async function takeElementScreenshot(element: Locator, screenshotName: string) {
  const screenShot = await element.screenshot();

  await test.info().attach(screenshotName, {
    body: screenShot,
    contentType: "image/png",
  });

}


export default { takeFullPageScreenshot, takeElementScreenshot };