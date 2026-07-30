import TestData from "../data/test-date";
import fs from 'fs';
import path from 'path';
import {parse} from "csv-parse/sync";


//read appData
const makeAppTestData = TestData.makeAppointmentTestData();

// node debug/play.ts or npx tsx debug/play.ts
for (const appData of makeAppTestData) {
    console.log(`Test data: ${JSON.stringify(appData)}`);
}

//read CSV
// npm i --save-dev csv-parse
const csvFilePath = path.resolve(`${process.cwd()}/data/demo/mytest.data.csv`)
const csvData = fs.readFileSync(csvFilePath, {encoding: "utf-8"})
console.log(`read CSV: ${csvData}`)

//parse
const parsedArray = parse(csvData, {columns: true, skip_empty_lines: true, trim: true})

//print
console.log(parsedArray)

function readCsv(file: string): any[] {

    const csvFilePath = path.resolve(`${process.cwd()}/data/demo/mytest.data.csv`)
    const csvData = fs.readFileSync(csvFilePath, {encoding: "utf-8"})
    console.log(`read CSV: ${csvData}`)

    const parsedArray = parse(csvData, {columns: true, skip_empty_lines: true, trim: true})

    return parsedArray;
}


//unit test csv 
const data = readCsv(csvFilePath);
console.log(`read testId CSV: ${data[0].testId}`)