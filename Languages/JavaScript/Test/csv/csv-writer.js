import csvReader from './csv-reader.js';

csv_file = 'leads_test.csv';
var my_csv = await csvReader(csv_file);
console.log(my_csv)




