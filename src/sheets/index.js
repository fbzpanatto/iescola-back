const fs = require('fs');
const XLSX = require('xlsx');

const workbook = XLSX.readFile('simulado.xlsx');

let worksheet = {};

for(const sheetName of workbook.SheetNames) {
  worksheet[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

const jsonData = JSON.stringify(worksheet['BASE'], null, 2);

console.log(jsonData);

/* fs.writeFile('data.json', jsonData, 'utf8', (err) => {
  if (err) throw err;
}); */
