import { type FullConfig } from "@playwright/test";
import { exec } from "child_process";

export default async function globalTeardown(config: FullConfig) {
  console.log(`Hello from global teardown 😎`);

  if (process.env.RUNNER?.toUpperCase() === "LOCAL") {
    console.log("local run detected - starting allure server");
    // exec("allure serve", (error, stdout, stderr) => {
    //   if (error) {
        // console.error(`Error starting allure server: ${error.message}`);
    //   }
    // });
  }

  console.log("global teardown done 👍");
}