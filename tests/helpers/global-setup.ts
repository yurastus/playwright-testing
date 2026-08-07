import { type FullConfig } from "@playwright/test";
import path from "path";
import fs from "fs";

export default async function globalSetup(config: FullConfig) {
  console.log(`Hello from global setup 😎`);

  if (process.env.RUNNER?.toUpperCase() === "LOCAL") {
    console.log("delete local runner allure results");
    // Delete allure results
    const resultDir = path.resolve(process.cwd(), "test-results");
    console.log(`>>> resultDir: ${resultDir}`);

    if (fs.existsSync(resultDir)) {
      fs.rmSync(resultDir, { recursive: true, force: true });
    }
  }

  console.log("global setup done 👍");
  process.env.LOGIN_COOKIES = undefined;
}
