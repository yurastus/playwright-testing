import { test, expect } from "@playwright/test";

//npm run debug
test.describe("make appointment", () => {
  
  test.beforeEach("login", async ({page}) => {
    await page.goto('https://katalon-demo-cura.herokuapp.com/');

    await page.getByRole('link', { name: 'Make Appointment' }).click();
    // await page.getByRole('link', { name: 'Make Appointment' }).press('Enter');
    //await page.getByRole('link', { name: 'Make Appointment' }).doubleClick({});
    await page.getByLabel('Username').fill('John Doe');
    await page.getByLabel('Password').fill('ThisIsNotAPassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('button', { name: 'Book Appointment' })).toBeVisible();
    
  });

  test("Should male an appoimntment with non default values", async ({ page }) => {
    
    await page.getByLabel("Facility")
      .selectOption("Hongkong CURA Healthcare Center");
      //.selectOption({index: 0});

      
    let options = page.getByLabel("Facility").locator("option");

    let arr = []
    for (let elem of await options.all()) {

      let elText = await elem.textContent();
      if (elText) {
        arr.push(elText);
      }
    }



    console.log(`>>> options: ${arr}`);
    console.log(`>>> ALL OPTIONS: ${await options.all()}`);

    let arrUpperCase = arr.map((v) => v.toUpperCase()).filter((v) => !v.includes("HONGKONG"));

    console.log(`>>> OPTIONS: ${arrUpperCase}`);

    await expect(options).toHaveCount(3);
    await page.getByRole("checkbox", { name: "Apply for hospital readmission" }).check();
    await expect(page.getByRole("checkbox", { name: "Apply for hospital readmission" })).toBeChecked();

    await page.getByRole("checkbox", { name: "Apply for hospital readmission" }).uncheck();
    await expect(page.getByRole("checkbox", { name: "Apply for hospital readmission" })).not.toBeChecked();


    await page.getByRole("radio", { name: "Medicaid" }).check();
    await page.locator(".input-group-addon").click();

    await page.getByRole('textbox', { name: 'Visit Date (Required)' }).click();
    await page.getByRole('textbox', { name: 'Visit Date (Required)' }).fill("18/07/2026");
    await page.getByRole('textbox', { name: 'Visit Date (Required)' }).press('Enter');
    //await page.pause(); //npm run debug:ui - will pause in this place

    await page.getByRole("textbox", { name: "Comment" }).click();
    await page.getByRole("textbox", { name: "Comment" }).fill("this is comment");

    //await page.getByRole("textbox", { name: "Comment" }).pressSequentially("this is comment", {delay: 1000});

    await page.getByRole("button", { name: "Book Appointment" }).click();
    await expect(page.locator("h2")).toContainText("Appointment Confirmation");
    await page.getByText("Please be informed that your").click();
    await page.getByText("Please be informed that your").click();
    await expect(page.locator("#summary")).toContainText("Please be informed that your appointment has been booked as following:");
    

    let temp = await page.locator("#visit_date").textContent();
    const visible = await page.locator("#visit_date").isVisible();


    await expect(page.locator("#visit_date")).toContainText("-18/07/2026");
    await page.getByText("Medicaid").click();
    await expect(page.locator("#program")).toContainText("Medicaid");
    await expect(page.locator("#facility")).toContainText("Hongkong CURA Healthcare Center");
  });

    test("Should test 2", async ({ page }) => {
      await page.getByLabel("Facility").selectOption("Hongkong CURA Healthcare Center");
    });

});
