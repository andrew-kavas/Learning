import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import neatCsv from 'neat-csv';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const results = [];
 
fs.createReadStream(path.join(__dirname, 'leads_test.csv'))
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });

// export default async function csvReader(csv_file) {
//   const csv_file_path = path.join(__dirname, csv_file);

//   fs.readFile(csv_file_path, async (err, data) => {
//     if (err) {
//       console.error(err);
//       return
//     }
//     var csv = await neatCsv(data);
//     // console.log(csv);
//     return csv
//   })
// }

// const a = await csvReader('leads_test.csv');
// console.log(a);