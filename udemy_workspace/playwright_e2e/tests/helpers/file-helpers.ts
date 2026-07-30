import fs from 'fs';
import path from 'path';
import {parse} from "csv-parse/sync";

const csvFilePath = path.resolve(`${process.cwd()}/data/demo/mytest.data.csv`)

/**
 * 
 * @param file 
 * @returns array of objects
 */
function readCsv(file: string): any[] {
    const csvFilePath = path.resolve(`${process.cwd()}/data/demo/mytest.data.csv`)
    const csvData = fs.readFileSync(csvFilePath, {encoding: "utf-8"})
    return parse(csvData, {columns: true, skip_empty_lines: true, trim: true})
}

export default {readCsv};