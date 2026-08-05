import { test, expect } from "@playwright/test";
import constants from "../../data/constant.json";
import TestData from "../../data/test-date";
import fileHelpers from "../helpers/file-helpers";
import { LOG } from "../helpers/logger"
import LoginPage from "../page-objects/login.page";
import helpers from "../helpers/pw-helpers";


const makeAppTestData = fileHelpers.readCsv("demo/mytest.data.csv");

test.beforeEach(async ({ page }) => {
  await LOG("info", "before each")
});


//npm run debug
test.describe("Make an appointment", { annotation: { type: "Story Jira - XXXX", description: "Test description" },}, () => {
    
  test.beforeEach("Login", async ({ page }, testInfo) => {
      const envConfig = testInfo.project.use as any;
      await LOG("error", `Runnning test on env: ${JSON.stringify(envConfig.envName)}`);

      const loginPage = new LoginPage(page);
      await loginPage.login(envConfig.appUrl, process.env.TEST_USER_NAME!, process.env.TEST_PASSWORD!);

      await page.getByRole("link", { name: "Make Appointment" }).click();
      await expect(page.getByRole("button", { name: "Book Appointment" }),).toBeVisible();
    });

    //TODO - create home page obj and update test below
    test("Should make an appoimntment with non default values:", { annotation: { type: "Bug Jira - XXXX test", description: "Test Bug" }, tag: "@smoke",},
      async ({ page, browserName }, testInfo) => {

        helpers.takeFullPageScreenshot(page, "Full page screenshot");
        helpers.takeElementScreenshot(page.getByRole("button", { name: "Book Appointment" }), "button screenshot");

        let options = page.getByLabel("Facility").locator("option");
        await expect(options).toHaveCount(3);
        await page.getByRole("checkbox", { name: "Apply for hospital readmission" }).check();
        await expect( page.getByRole("checkbox", { name: "Apply for hospital readmission",}),).toBeChecked();

        await page.getByRole("checkbox", { name: "Apply for hospital readmission" }).uncheck();
        await expect(page.getByRole("checkbox", { name: "Apply for hospital readmission"}),).not.toBeChecked();

        await page.getByRole("radio", { name: "Medicaid" }).check();
        await page.locator(".input-group-addon").click();
        await page.getByRole("textbox", { name: "Visit Date (Required)" }).click();
        await page.getByRole("textbox", { name: "Visit Date (Required)" }).fill("18/07/2026");
        await page.getByRole("textbox", { name: "Visit Date (Required)" }).press("Enter");
        await page.getByRole("textbox", { name: "Comment" }).click();
        await page.getByRole("textbox", { name: "Comment" }).fill("this is comment");

        await page.getByRole("button", { name: "Book Appointment" }).click();
        await expect(page.locator("h2")).toContainText("Appointment Confirmation");
        await page.getByText("Please be informed that your").click();
        await page.getByText("Please be informed that your").click();
        await expect(page.locator("#summary")).toContainText("Please be informed that your appointment has been booked as following:");
        await page.locator("#visit_date").isVisible();
        await page.getByText("Medicaid").click();
        await expect(page.locator("#program")).toContainText("Medicaid");
      },
    )



});
