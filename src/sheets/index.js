const fs = require('fs');
const XLSX = require('xlsx');

const runTimeClassExecution = ['5A', '5B', '5C', '9A', '9B', '9C']
const runTimeSchool = 'agenor'
const runTimeSubject = 'matematica'

const workbook = XLSX.readFile(`${runTimeSchool}_simulado_${runTimeSubject}.xlsx`);

let worksheet = {};

for(const sheetName of workbook.SheetNames) {
  worksheet[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

for(let classroom of runTimeClassExecution) {
    const jsonData = JSON.stringify(worksheet[classroom], null, 2);

    fs.writeFile(`./${runTimeSchool}/${runTimeSchool}_${classroom}_${runTimeSubject}.json`, jsonData, 'utf8', (err) => {
        if (err) throw err;
    });
}
