import { defineConfig } from "@playwright/test";
import { baseConfig } from "../playwright.config";
import { EnvConfig } from "../tests/helpers/config-fixture";
import path from "path";

console.log("Running in UAT env");

export default defineConfig<EnvConfig>({
  ...baseConfig, //loads existing config from baseConfig
  testDir: path.resolve(process.cwd(), "./tests"),

  use: {
    ...baseConfig.use, // ✅ Locading existing object and extend
    envName: "uat",
    appUrl: "https://katalon-demo-cura.herokuapp.com/",
    dbConfig: {
      server: "",
      dbName: "",
    },
  },
});
