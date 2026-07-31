import { test } from "@playwright/test";
import chalk, { colorNames } from "chalk";

export type Level = "info" | "warn" | "error" | "debug";

export async function log(level: Level, message: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const plainLine = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  let colorLine = plainLine;

  // npm i --save-dev chalk
  switch (level) {
    case "info":
      colorLine = chalk.blue(plainLine);
      break;
    case "warn":
      colorLine = chalk.yellow(plainLine);
      break;
    case "error":
      colorLine = chalk.red(plainLine);
      break;
    case "debug":
      colorLine = chalk.gray(plainLine);
      break;
  }

  //print colored output
  (console[level], console.log)(colorLine)

  await test.step(plainLine, async () => {});
}