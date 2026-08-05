import { test, expect } from "@playwright/test";
import constants from "../../data/constant.json";
import TestData from "../../data/test-date";
import path from 'path';
import fileHelpers from "../helpers/file-helpers";
import { LOG } from "../helpers/logger"


const csvFilePath = path.resolve(`${process.cwd()}/data/demo/mytest.data.csv`)
const makeAppTestData = fileHelpers.readCsv(csvFilePath);

test.beforeEach(async ({ page }) => {
  await LOG("info", "before each")
});


for (const appData of makeAppTestData) {
  
  test.describe("Make app with csv data", () => {
      console.log(`Test data: ${JSON.stringify(appData)}`);

      test(`TEST: ${appData.testId}: Should test data CSV`, async ({ page }) => {
        await LOG("warn", `In test csv: ${JSON.stringify(appData)}`);
      });
    });
}

//npm run debug
test.describe("make appointment", { annotation: { type: "Story Jira - XXXX", description: "Test description" },},
  () => {
    test.beforeEach("login", async ({ page }, testInfo) => {
      const envConfig = testInfo.project.use as any;
      await LOG("error", `Runnning test on env: ${JSON.stringify(envConfig.envName)}`);

      await page.goto(envConfig.appUrl);
      //await page.goto('https://katalon-demo-cura.herokuapp.com/');

      await page.getByRole("link", { name: "Make Appointment" }).click();
      // await page.getByRole('link', { name: 'Make Appointment' }).press('Enter');
      //await page.getByRole('link', { name: 'Make Appointment' }).doubleClick({});

      //login with sensetive data
      await LOG("debug", `user name: ${process.env.TEST_USER_NAME!}`);
      await page.getByLabel("Username").fill(process.env.TEST_USER_NAME!);
      await page.getByLabel("Password").fill(process.env.TEST_PASSWORD!);
      await page.getByRole("button", { name: "Login" }).click();
      await expect(
        page.getByRole("button", { name: "Book Appointment" }),
      ).toBeVisible();
    });

    test("Should male an appoimntment with non default values", {
        annotation: { type: "Bug Jira - XXXX test", description: "Test Bug" }, tag: "@smoke",},
      async ({ page, browserName }, testInfo) => {
        test.skip(
          browserName === "firefox",
          "This test is not supported in firefox",
        );
        test.setTimeout(testInfo.timeout - 3000);

        //await page
          //.getByLabel("Facility11")
          //.selectOption("Hongkong CURA Healthcare Center");
          //.selectOption({index: 0});

        let pageScreenshot = await page.screenshot({ fullPage: true });
        testInfo.attach("page screenshot", {
          body: pageScreenshot,
          contentType: "image/png",
        });

        let options = page.getByLabel("Facility").locator("option");

        let arr: string[] = [];
        for (let elem of await options.all()) {
          let elText = await elem.textContent();
          if (elText) {
            arr.push(elText);
          }
        }

        console.log(`>>> options: ${arr}`);
        console.log(`>>> ALL OPTIONS: ${await options.all()}`);

        let arrUpperCase = arr
          .map((v) => v.toUpperCase())
          .filter((v) => !v.includes("HONGKONG"));

        console.log(`>>> OPTIONS: ${arrUpperCase}`);

        await expect(options).toHaveCount(3);
        await page
          .getByRole("checkbox", { name: "Apply for hospital readmission" })
          .check();
        await expect(
          page.getByRole("checkbox", {
            name: "Apply for hospital readmission",
          }),
        ).toBeChecked();

        await page
          .getByRole("checkbox", { name: "Apply for hospital readmission" })
          .uncheck();
        await expect(
          page.getByRole("checkbox", {
            name: "Apply for hospital readmission",
          }),
        ).not.toBeChecked();

        await page.getByRole("radio", { name: "Medicaid" }).check();
        await page.locator(".input-group-addon").click();

        await page
          .getByRole("textbox", { name: "Visit Date (Required)" })
          .click();
        await page
          .getByRole("textbox", { name: "Visit Date (Required)" })
          .fill("18/07/2026");
        await page
          .getByRole("textbox", { name: "Visit Date (Required)" })
          .press("Enter");
        //await page.pause(); //npm run debug:ui - will pause in this place

        await page.getByRole("textbox", { name: "Comment" }).click();
        await page
          .getByRole("textbox", { name: "Comment" })
          .fill("this is comment");

        //await page.getByRole("textbox", { name: "Comment" }).pressSequentially("this is comment", {delay: 1000});

        await page.getByRole("button", { name: "Book Appointment" }).click();
        await expect(page.locator("h2")).toContainText(
          "Appointment Confirmation",
        );
        await page.getByText("Please be informed that your").click();
        await page.getByText("Please be informed that your").click();
        await expect(page.locator("#summary")).toContainText(
          "Please be informed that your appointment has been booked as following:",
        );

        let temp = await page.locator("#visit_date").textContent();
        const visible = await page.locator("#visit_date").isVisible();

        //await expect(page.locator("#visit_date")).toContainText("-18/07/2026");
        await page.getByText("Medicaid").click();
        await expect(page.locator("#program")).toContainText("Medicaid");
        // await expect(page.locator("#facility")).toContainText(
          // "Hongkong CURA Healthcare Center",
        // );
      },
    );

    test("Should test 2", async ({ page }) => {
      const cookies = await page.context().cookies();
      //global data setup
      process.env.LOGIN_COOKIES = JSON.stringify(cookies);
      console.log(`>>> save cookies : ${process.env.LOGIN_COOKIES}`);

      await page
        .getByLabel("Facility")
        .selectOption("Hongkong CURA Healthcare Center");
    });

    test("Should test config", async ({page, browserName, context,}, testInfo) => {
      await LOG("debug", `>>> testInfo prop: ${JSON.stringify(testInfo.title)}`);
      //console.log(`>>> read cookies : ${process.env.LOGIN_COOKIES}`);
    });

    //test data array test example
    const makeAppTestData = TestData.makeAppointmentTestData();

    for (const appData of makeAppTestData) {
      //console.log(`Test data in FOR: ${JSON.stringify(appData)}`);

      test(`${appData.testId}: Should test data`, async ({ page }) => {
        await LOG("warn", `In test constants for : ${JSON.stringify(appData)}`);
      });
    }
  },
);
