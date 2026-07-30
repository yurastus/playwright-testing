import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

// npm install -D dotenv
// node -e "console.log('CPU cores:', require('os').cpus().length)"
// count how many tests are in the project
// npx playwright test --list

 import dotenv from 'dotenv';
 import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

console.log(`Hello from config 😎`);

export default defineConfig({
  testDir: "./tests",
  timeout: 10 * 1000,
  expect: { timeout: 3000 },
  globalSetup: require.resolve("./tests/helpers/global-setup.ts"),
  globalTeardown: require.resolve("./tests/helpers/global-teardown.ts"),
  // globalTimeout: 60 * 1000,
  /* Run tests in files in parallel */
  //true - wiil run every test in separate worker , false will run every project in separate workers - will take half of pc capacity CPU
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // in cli - allure serve
  reporter: [
    ["html", {
      open: "always",
    }], 
    [
      "allure-playwright",
      {
        details: true,
        suiteTitle: true,
        environmentInfo: {
          name: "Playwright E2E",
          appName: "CURA Healthcare",
          Release: "1.0.0",
          node_version: process.version,
        },
      },
    ],
    ["line"],
    ["json", { outputFile: "test-results.json" }],
    ["junit", { outputFile: "test-results.xml" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        // viewport: null,
        // launchOptions: {
          // args: ["--start-maximized"],
        // },
      },
    },

    //  {
    //    name: 'firefox',
    //    use: { ...devices['Desktop Firefox'] },
    //  },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], ignoreHTTPSErrors: true },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
    // { name: "Galaxy A55",
      // use: { ...devices["Galaxy S24"] },
    // }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
