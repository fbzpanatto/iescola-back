const fs = require('fs');
const XLSX = require('xlsx');

const runTimeSchool = 'pires'
const runTimeSubject = 'matematica'

const workbook = XLSX.readFile(`pires_5B.xlsx`);

let worksheet = {};

for(const sheetName of workbook.SheetNames) {
  worksheet[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

const jsonData = JSON.stringify(worksheet, null, 2)

fs.writeFile(`./${runTimeSchool}/${runTimeSchool}_${runTimeSubject}.json`, jsonData, 'utf8', (err) => {
    if (err) throw err;
});
