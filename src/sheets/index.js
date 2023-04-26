const fs = require('fs');
const XLSX = require('xlsx');

const workbook = XLSX.readFile('agenor_simulado_matematica.xlsx');

let worksheet = {};

for(const sheetName of workbook.SheetNames) {
  worksheet[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

const jsonData = JSON.stringify(worksheet['5A'], null, 2);

console.log(jsonData);

fs.writeFile('./agenor/agenor_5a_matematica.json', jsonData, 'utf8', (err) => {
  if (err) throw err;
});
