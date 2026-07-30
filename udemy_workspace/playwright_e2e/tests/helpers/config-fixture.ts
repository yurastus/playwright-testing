import { test as base } from "@playwright/test";

export type EnvConfig = {
  envName: string;
  appUrl: string;
  dbConfig: {};
};

export const test = base.extend<EnvConfig>({
  //define option with default value
  envName: ["uat", { option: true }],
  appUrl: ["<providedUrl>", { option: true }],
  dbConfig: [{}, { option: true }],
});
