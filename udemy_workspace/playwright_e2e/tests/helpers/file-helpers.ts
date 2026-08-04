import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

function readCsv(file: string): any[] {
  const csvFilePath = path.resolve(
    `${process.cwd()}/data/demo/mytest.data.csv`,
  );
  const csvData = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
  return parse(csvData, { columns: true, skip_empty_lines: true, trim: true });
}

function writeFile(filePath: string, data: string) {
  try {
    fs.writeFileSync(filePath, data, { encoding: "utf-8" });
    console.log(`File written successfully to ${filePath}`);
  } catch (err) {
    console.error(`Error writing file to ${filePath}:`, err);
  }
}

export default { readCsv, writeFile };
