# Playwright E2E Test Suite

End-to-end test automation framework for the **CURA Healthcare** web application, built with Playwright and TypeScript. The framework supports multi-environment execution (dev / UAT), data-driven testing, rich multi-reporter output, and a CI pipeline via GitHub Actions.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev/) | ^1.61.1 | Browser automation and test runner |
| TypeScript | via `@types/node ^26` | Type-safe test authoring |
| Allure Playwright | ^3.10.2 | Rich HTML test reporting |
| dotenv | ^17.4.2 | Environment variable management |
| GitHub Actions | — | CI/CD pipeline |

---

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9
- Playwright browsers installed (handled by setup step below)

---

## Installation

```bash
# 1. Install dependencies
npm ci

# 2. Install Playwright browsers and OS dependencies
npx playwright install --with-deps
```

---

## Project Structure

```
playwright_e2e/
├── .env                          # Local environment variables (RUNNER=local)
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI pipeline
├── config/
│   ├── dev.playwright.config.ts  # Dev environment config
│   └── uat.playwright.config.ts  # UAT environment config
├── data/
│   ├── constant.json             # Shared HTTP status code constants
│   └── test-date.ts              # TestData factory — data-driven test datasets
├── debug/
│   └── play.ts                   # Standalone data inspection script
├── tests/
│   ├── demo/
│   │   └── mytest.spec.ts        # Make Appointment feature tests
│   └── helpers/
│       ├── config-fixture.ts     # Typed env fixture (EnvConfig)
│       ├── global-setup.ts       # Pre-run hooks (clean results dir, reset shared state)
│       └── global-teardown.ts    # Post-run hooks (optional Allure auto-serve)
├── playwright.config.ts          # Base config — exported as `baseConfig`
└── tsconfig.json                 # TypeScript compiler config
```

---

## Configuration Architecture

The framework uses a **config inheritance pattern**: a shared `baseConfig` is exported from the root `playwright.config.ts` and extended by each environment-specific config.

```
playwright.config.ts          ← baseConfig (timeouts, reporters, globalSetup/Teardown)
       ├── config/dev.playwright.config.ts   ← spread + override (envName, appUrl, dbConfig)
       └── config/uat.playwright.config.ts   ← spread + override (envName, appUrl, dbConfig)
```

Environment configs are passed to tests via a **typed Playwright fixture** (`EnvConfig`) defined in `tests/helpers/config-fixture.ts`:

```ts
export type EnvConfig = {
  envName: string;   // "dev" | "uat"
  appUrl: string;    // base URL for the environment
  dbConfig: {};      // database connection (placeholder)
};
```

Tests access these values via `testInfo.project.use.appUrl` — no hardcoded URLs in spec files.

### Base Config Highlights

| Setting | Value |
|---|---|
| `timeout` | 10 000 ms per test |
| `expect.timeout` | 3 000 ms |
| `navigationTimeout` | 30 000 ms |
| `fullyParallel` | `true` |
| `retries` | 2 on CI, 0 locally |
| `workers` | 1 on CI, default locally |
| `screenshot` | `only-on-failure` |
| `video` | `retain-on-failure` |
| `trace` | `on-first-retry` |
| Active browsers | Chromium (Desktop Chrome) |

---

## Running Tests

### Environment-specific runs

```bash
# Run against dev environment
npm run dev:tests

# Run against UAT environment
npm run uat:tests

# List all tests for UAT without executing
npm run "uat:list tests"
```

### Debug modes

```bash
# Run with Playwright UI Mode (interactive test runner)
npm run debug:ui

# Run headed with step-by-step debugger (PWDEBUG=1)
npm run debug:cli

# Run with traces captured for all tests
npm run debug:trace
```

### Tag-based filtering

```bash
# Run only tests tagged @smoke
npm run tag
```

### Miscellaneous

```bash
# Run headed (all tests)
npm run demo

# Pipe test output to a log file
npm run log
```

### Direct Playwright CLI

```bash
# Run a specific test file
npx playwright test tests/demo/mytest.spec.ts

# Run with a specific config
npx playwright test --config=config/dev.playwright.config.ts

# Show test list
npx playwright test --list
```

---

## Environment Variables

| Variable | Values | Description |
|---|---|---|
| `RUNNER` | `local` / `ci` | Controls local-only behavior in global setup/teardown |
| `LOGIN_COOKIES` | JSON string | Runtime-only: stores session cookies between tests (set in `global-setup.ts`) |

Set `RUNNER=local` in `.env` for local development. On CI, this variable is unset so cleanup behaviors are skipped.

---

## Test Architecture Patterns

### Custom Typed Fixture

`config-fixture.ts` extends Playwright's `test` with `EnvConfig` options. Env-specific configs inject values; tests read them via `testInfo.project.use`. This decouples test logic from environment details.

### Data-Driven Tests

Test datasets are defined in `data/test-date.ts` via a `TestData` class with static factory methods. Tests are generated at describe-block parse time:

```ts
for (const { testId, facility, hcp } of TestData.makeAppointmentTestData()) {
  test(`${testId}: Should test data`, async ({ page }) => { ... });
}
```

### Global Lifecycle Hooks

- **global-setup.ts** — runs once before all tests; cleans `test-results/` on local runs; resets `LOGIN_COOKIES`.
- **global-teardown.ts** — runs once after all tests; optionally auto-launches Allure (currently disabled via comment).

### Cross-Test State

Session cookies can be shared between tests by serialising them to `process.env.LOGIN_COOKIES`. This is intentional for cookie-sharing demonstration but is order-dependent — use with caution in fully parallel runs.

---

## Reporting

Five reporters run simultaneously:

| Reporter | Output | Notes |
|---|---|---|
| `html` | `playwright-report/` | Opens automatically after local run |
| `allure-playwright` | `allure-results/` | Run `npx allure serve allure-results` to view |
| `line` | stdout | Compact progress in terminal |
| `json` | `test-results.json` | Machine-readable results |
| `junit` | `test-results.xml` | Compatible with CI dashboards (Jenkins, Azure DevOps) |

### Viewing Allure Reports

```bash
npx allure serve allure-results
```

The Allure report is pre-configured with environment metadata:

| Property | Value |
|---|---|
| App Name | CURA Healthcare |
| Release | 1.0.0 |
| Node Version | (detected at runtime) |

---

## CI/CD — GitHub Actions

`.github/workflows/playwright.yml` runs on every push and pull request targeting `main` or `master`:

```
Checkout → Node.js LTS → npm ci → playwright install → playwright test → Upload report artifact
```

The HTML report is uploaded as a build artifact and retained for **30 days**, even if the pipeline is cancelled.

CI-specific behavior (controlled by `playwright.config.ts`):
- `forbidOnly: true` — fails the build if `.only` is left in any test
- `retries: 2` — flaky tests get two retries
- `workers: 1` — serialised execution

---

## Application Under Test

**CURA Healthcare Demo** — [https://katalon-demo-cura.herokuapp.com/](https://katalon-demo-cura.herokuapp.com/)

A publicly available Katalon demo application used for QA practice.

| Credential | Value |
|---|---|
| Username | `John Doe` |
| Password | `ThisIsNotAPassword` |

> These credentials are intentionally public and part of the demo app.

---

## Known Limitations & TODOs

- **No Page Object Model** — selectors are currently inline in spec files. Introducing a `pages/` layer would improve maintainability as the suite grows.
- **UAT URL mirrors Dev** — both environment configs currently point to the same Heroku URL. Differentiate once a real UAT environment is available.
- **DB config placeholder** — `dbConfig` in both env configs contains empty connection strings; update when API/DB-layer tests are added.
- **`config/` excluded from tsc** — the `tsconfig.json` `include` array omits `config/`; type errors there won't surface during `tsc` checks. Consider adding `"config/**/*.ts"` to `include`.
- **Data-driven test bodies** — `TC001–TC003` tests log data but contain no assertions yet; they are scaffolded placeholders.
